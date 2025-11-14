import { RefObject, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Contract, JsonRpcSigner, Provider, ZeroHash } from "ethers";
import { AuroraMosaicABI } from "@/abi/AuroraMosaicABI";
import { AuroraMosaicAddresses } from "@/abi/AuroraMosaicAddresses";
import type { FhevmInstance } from "@/fhevm/fhevmTypes";
import { FhevmDecryptionSignature } from "@/fhevm/FhevmDecryptionSignature";
import type { GenericStringStorage } from "@/fhevm/GenericStringStorage";
import { useAppWeb3 } from "@/contexts/AppWeb3Context";

export type TileCell = {
  x: number;
  y: number;
  handle: `0x${string}`;
  artisan: string;
  updatedAt: number;
  color?: string;
};

export type PanelStats = {
  totalBrushes?: number;
  userBrushes?: number;
};

type DecodeOptions = {
  forceDecrypt?: boolean;
  forceNewSignature?: boolean;
};

export function useAuroraMosaic(parameters: {
  fhevmDecryptionSignatureStorage: GenericStringStorage;
  panelId?: number;
  instance?: FhevmInstance | undefined;
  ethersSigner?: JsonRpcSigner | undefined;
  ethersReadonlyProvider?: Provider | undefined;
  chainId?: number | undefined;
  sameSigner?: RefObject<(candidate: JsonRpcSigner | undefined) => boolean>;
  autoDecrypt?: boolean;
}) {
  const appWeb3 = useAppWeb3();
  const {
    instance = appWeb3.fhevmInstance,
    ethersSigner = appWeb3.ethersSigner ?? undefined,
    ethersReadonlyProvider = appWeb3.ethersReadonlyProvider ?? undefined,
    chainId = appWeb3.chainId,
    sameSigner = appWeb3.sameSigner,
    fhevmDecryptionSignatureStorage,
    panelId = 1,
    autoDecrypt = true,
  } = parameters;

  const [statusMessage, setStatusMessage] = useState<string>("Standing by");
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isDecrypting, setIsDecrypting] = useState<boolean>(false);
  const [board, setBoard] = useState<Map<string, TileCell>>(new Map());
  const [panelSize, setPanelSize] = useState<{ width: number; height: number }>({
    width: 128,
    height: 128,
  });
  const [isSealed, setIsSealed] = useState<boolean>(false);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<number | undefined>(undefined);
  const [selectedColor, setSelectedColor] = useState<string>("#6B4CF0");
  const [stats, setStats] = useState<PanelStats>({});
  const [relicId, setRelicId] = useState<number | undefined>(undefined);
  const [decryptionEnabled, setDecryptionEnabled] = useState<boolean>(autoDecrypt !== false);

  const signatureRef = useRef<FhevmDecryptionSignature | null>(null);
  const signaturePromiseRef = useRef<Promise<FhevmDecryptionSignature | null> | null>(null);
  const contractRef = useRef<Contract | null>(null);
  const listenerRef = useRef<() => void>(() => undefined);

  const fallbackSameSignerRef = useRef<(candidate: JsonRpcSigner | undefined) => boolean>(() => false);
  const resolvedSameSigner = sameSigner ?? fallbackSameSignerRef;

  const contractAddress = useMemo(() => {
    if (!chainId) return undefined;
    const entry =
      AuroraMosaicAddresses[
        chainId.toString() as keyof typeof AuroraMosaicAddresses
      ];
    if (!entry || !("address" in entry)) {
      return undefined;
    }
    return entry.address as `0x${string}`;
  }, [chainId]);

  const canInteract = Boolean(
    contractAddress &&
      instance &&
      ethersSigner &&
      (resolvedSameSigner.current?.(ethersSigner) ?? false)
  );

  const contract = useMemo(() => {
    if (!contractAddress || !ethersReadonlyProvider) return null;
    const base = new Contract(contractAddress, AuroraMosaicABI.abi, ethersReadonlyProvider);
    contractRef.current = base;
    return base;
  }, [contractAddress, ethersReadonlyProvider]);

  const writeContract = useMemo(() => {
    if (!contract || !ethersSigner) return null;
    return contract.connect(ethersSigner);
  }, [contract, ethersSigner]);

  const ensureSignature = useCallback(
    async (options?: { forceNew?: boolean }) => {
      if (!instance || !ethersSigner || !contractAddress) return null;

      const forceNew = options?.forceNew ?? false;
      if (!forceNew && signatureRef.current) {
        return signatureRef.current;
      }

      if (forceNew) {
        signatureRef.current = null;
        signaturePromiseRef.current = null;
      } else if (signaturePromiseRef.current) {
        return signaturePromiseRef.current;
      }

      const promise = (async () => {
        try {
          const signature = await FhevmDecryptionSignature.loadOrSign(
            instance,
            [contractAddress],
            ethersSigner,
            fhevmDecryptionSignatureStorage,
            undefined,
            { forceNew }
          );
          signatureRef.current = signature;
          return signature;
        } finally {
          signaturePromiseRef.current = null;
        }
      })();

      signaturePromiseRef.current = promise;
      return promise;
    },
    [contractAddress, ethersSigner, fhevmDecryptionSignatureStorage, instance]
  );

  const decodeHandleMap = useCallback(
    async (handles: `0x${string}`[], options?: DecodeOptions) => {
      const shouldDecrypt = options?.forceDecrypt ?? decryptionEnabled;
      if (!shouldDecrypt) {
        return {};
      }
      if (!instance || !ethersSigner || !contractAddress) return {};
      const signature = await ensureSignature({ forceNew: options?.forceNewSignature });
      if (!signature) {
        setStatusMessage("Failed to generate FHE decryption signature");
        return {};
      }

      const uniqueHandles = Array.from(new Set(handles.filter((h) => h !== ZeroHash)));
      if (uniqueHandles.length === 0) {
        return {};
      }

      const payload = uniqueHandles.map((handle) => ({
        handle,
        contractAddress,
      }));

      setIsDecrypting(true);
      try {
        const result = await instance.userDecrypt(
          payload,
          signature.privateKey,
          signature.publicKey,
          signature.signature,
          signature.contractAddresses,
          signature.userAddress,
          signature.startTimestamp,
          signature.durationDays
        );
        return result;
      } finally {
        setIsDecrypting(false);
      }
    },
    [contractAddress, decryptionEnabled, ensureSignature, ethersSigner, instance]
  );

  const refreshPanelMeta = useCallback(async () => {
    if (!contract || !contractAddress) return;
    try {
      const [meta, forgedRelicId] = await contract.describePanel(panelId);
      setPanelSize({ width: Number(meta.width), height: Number(meta.height) });
      setIsSealed(meta.isSealed);
      setLastUpdatedAt(meta.sealedAt > 0 ? Number(meta.sealedAt) : Number(meta.createdAt));
      setRelicId(forgedRelicId > 0 ? Number(forgedRelicId) : undefined);
    } catch (error) {
      console.error("[useAuroraMosaic] refreshPanelMeta", error);
      setStatusMessage("Unable to load panel metadata");
    }
  }, [panelId, contract, contractAddress]);

  const refreshBoardFromEvents = useCallback(
    async (options?: DecodeOptions) => {
      if (!contractAddress || !contract || !instance || !ethersSigner) {
        setStatusMessage("Please connect your wallet and initialize FHEVM");
        return;
      }

      setIsSyncing(true);
      try {
        const filter = contract.filters.TileBrushed(panelId);
        const events = await contract.queryFilter(filter, 0, "latest");

        if (events.length === 0) {
          setBoard(new Map());
          return;
        }

        const handles = events
          .map((event) => (event as any).args?.encryptedColorHandle as `0x${string}`)
          .filter(Boolean);
        const decrypted = await decodeHandleMap(handles, options);

        const nextBoard = new Map<string, TileCell>();
        for (const event of events) {
          const { x, y, artisan, encryptedColorHandle } = ((event as any).args || {}) as {
            x?: bigint;
            y?: bigint;
            artisan?: string;
            encryptedColorHandle?: `0x${string}`;
          };
          if (x === undefined || y === undefined) continue;
          const key = `${x}:${y}`;
          const handle = encryptedColorHandle as `0x${string}`;
          const clearValue = decrypted?.[handle];
          const colorHex =
            clearValue === undefined
              ? undefined
              : normalizeColor(clearValue as string | number | bigint);
          nextBoard.set(key, {
            x: Number(x),
            y: Number(y),
            handle,
            artisan: (artisan ?? "") as string,
            updatedAt: Math.floor(Date.now() / 1000),
            color: colorHex,
          });
        }
        setBoard(nextBoard);
        setStatusMessage(
          (options?.forceDecrypt ?? decryptionEnabled)
            ? "Panel data synced"
            : "Panel data synced (awaiting decryption)"
        );
      } catch (error) {
        console.error("[useAuroraMosaic] refreshBoardFromEvents", error);
        setStatusMessage("Failed to sync panel, please try again later");
      } finally {
        setIsSyncing(false);
      }
    },
    [panelId, contract, contractAddress, decodeHandleMap, decryptionEnabled, ethersSigner, instance]
  );

  const refreshStrokeStats = useCallback(
    async (options?: DecodeOptions) => {
      if (!contractAddress || !contract || !instance || !ethersSigner) return;
      try {
        const encryptedCount = await contract.panelBrushTotal(panelId);
        const contribution = await contract.artisanContribution(ethersSigner.address);
        const decrypted = await decodeHandleMap(
          [encryptedCount as `0x${string}`, contribution as `0x${string}`],
          options
        );
        const totalBrushes = parseDecryptedNumber(
          decrypted?.[encryptedCount as `0x${string}`]
        );
        const userBrushes = parseDecryptedNumber(
          decrypted?.[contribution as `0x${string}`]
        );
        setStats({ totalBrushes, userBrushes });
      } catch (error) {
        console.error("[useAuroraMosaic] refreshBrushStats", error);
      }
    },
    [panelId, contract, contractAddress, decodeHandleMap, ethersSigner, instance]
  );

  useEffect(() => {
    signatureRef.current = null;
    signaturePromiseRef.current = null;
  }, [chainId, contractAddress, ethersSigner]);

  useEffect(() => {
    refreshPanelMeta();
    const shouldForce = autoDecrypt !== false;
    refreshBoardFromEvents({ forceDecrypt: shouldForce });
    refreshStrokeStats({ forceDecrypt: shouldForce });
  }, [autoDecrypt, refreshBoardFromEvents, refreshPanelMeta, refreshStrokeStats]);

  useEffect(() => {
    if (!contract || !contractAddress || !instance || !ethersSigner) {
      return;
    }
    const onTileBrushed = async (
      updatedPanelId: bigint,
      x: bigint,
      y: bigint,
      artisan: string,
      encryptedColorHandle: `0x${string}`
    ) => {
      if (Number(updatedPanelId) !== panelId) return;

      const decrypted = await decodeHandleMap([encryptedColorHandle]);
      const colorHex = decrypted
        ? normalizeColor(decrypted[encryptedColorHandle] as string | number | bigint)
        : undefined;

      setBoard((prev) => {
        const next = new Map(prev);
        next.set(`${x}:${y}`, {
          x: Number(x),
          y: Number(y),
          handle: encryptedColorHandle,
          artisan,
          updatedAt: Number(Date.now() / 1000),
          color: colorHex,
        });
        return next;
      });

      refreshStrokeStats();
      setStatusMessage("Tile updated and decrypted");
    };

    contract.on("TileBrushed", onTileBrushed);
    listenerRef.current = () => {
      contract.off("TileBrushed", onTileBrushed);
    };

    return () => {
      listenerRef.current();
    };
  }, [panelId, contract, contractAddress, decodeHandleMap, ethersSigner, instance, refreshStrokeStats]);

  const paintTile = useCallback(
    async (x: number, y: number, colorHex: string) => {
      if (!writeContract || !contractAddress || !instance || !ethersSigner) {
        setStatusMessage("Please connect your wallet and wait for FHEVM initialization");
        return;
      }
      if (isSealed) {
        setStatusMessage("Panel is sealed; painting is disabled");
        return;
      }

      const colorValue = parseInt(colorHex.replace("#", ""), 16);
      if (Number.isNaN(colorValue)) {
        setStatusMessage("Invalid color format");
        return;
      }

      setIsSubmitting(true);
      setStatusMessage("Encrypting tile...");

      try {
        const encryptedInput = await instance
          .createEncryptedInput(contractAddress, ethersSigner.address as `0x${string}`)
          .add32(colorValue)
          .encrypt();

        setStatusMessage("Submitting encrypted stroke...");
        const tx = await (writeContract as any).applyTile(
          panelId,
          x,
          y,
          encryptedInput.handles[0],
          encryptedInput.inputProof
        );
        await tx.wait();
        setStatusMessage("Tile submitted; awaiting refresh");
      } catch (error) {
        console.error("[useAuroraMosaic] paintTile error", error);
        setStatusMessage("Painting failed; please try again");
      } finally {
        setIsSubmitting(false);
      }
    },
    [panelId, contractAddress, ethersSigner, instance, isSealed, writeContract]
  );

  const sealCurrentPanel = useCallback(async () => {
    if (!writeContract) return;
    try {
      const tx = await (writeContract as any).sealPanel(panelId);
      await tx.wait();
      setIsSealed(true);
      setStatusMessage("Panel sealed");
    } catch (error) {
      console.error("[useAuroraMosaic] sealPanel", error);
      setStatusMessage("Failed to seal panel");
    }
  }, [panelId, writeContract]);

  const forgePanelSnapshot = useCallback(
    async (metadataCID: string) => {
      if (!writeContract) return;
      try {
      const tx = await (writeContract as any).forgePanelRelic(panelId, metadataCID);
        const receipt = await tx.wait();
        const mintedEvent = receipt?.logs
          ?.map((log: any) => {
            try {
              return contract?.interface.parseLog(log);
            } catch {
              return undefined;
            }
          })
          .find((parsed: any) => parsed && parsed.name === "PanelForged");

        const mintedRelicId =
          mintedEvent?.args?.relicId !== undefined
            ? Number(mintedEvent.args.relicId)
            : undefined;
        setRelicId(mintedRelicId);
        setStatusMessage("Aurora Relic minted");
        return mintedRelicId;
      } catch (error) {
        console.error("[useAuroraMosaic] forgePanelSnapshot", error);
        setStatusMessage("Mint failed");
        return undefined;
      }
    },
    [panelId, contract, writeContract]
  );

  const orderedTiles = useMemo(() => {
    const cells = Array.from(board.values());
    return cells.sort((a, b) => a.y - b.y || a.x - b.x);
  }, [board]);

  const enableDecryption = useCallback(
    async ({ forceNewSignature = false }: { forceNewSignature?: boolean } = {}) => {
      setDecryptionEnabled(true);
      await Promise.all([
        refreshBoardFromEvents({ forceDecrypt: true, forceNewSignature }),
        refreshStrokeStats({ forceDecrypt: true, forceNewSignature }),
      ]);
    },
    [refreshBoardFromEvents, refreshStrokeStats]
  );

  return {
    contractAddress,
    canInteract,
    board,
    orderedTiles,
    panelSize,
    isSealed,
    statusMessage,
    isSyncing,
    isSubmitting,
    isDecrypting,
    selectedColor,
    setSelectedColor,
    refreshBoard: refreshBoardFromEvents,
    refreshPanelMeta,
    refreshStrokeStats,
    paintTile,
    sealCurrentPanel,
    forgePanelSnapshot,
    stats,
    relicId,
    lastUpdatedAt,
    decryptionEnabled,
    enableDecryption,
  };
}

function normalizeColor(value: string | number | bigint | undefined) {
  if (value === undefined) return undefined;
  let numeric: bigint;
  if (typeof value === "string") {
    numeric = BigInt(value);
  } else if (typeof value === "number") {
    numeric = BigInt(value);
  } else {
    numeric = value;
  }
  const hex = numeric.toString(16).padStart(6, "0");
  return `#${hex.slice(-6)}`.toUpperCase();
}

function parseDecryptedNumber(value: string | number | bigint | undefined) {
  if (value === undefined) return undefined;
  if (typeof value === "string") {
    return Number(BigInt(value));
  }
  if (typeof value === "bigint") {
    return Number(value);
  }
  return Number(value);
}

