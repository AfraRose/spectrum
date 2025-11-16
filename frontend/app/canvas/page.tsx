"use client";

import Link from "next/link";
import { useCallback } from "react";
import { AuroraMosaicProvider, useAuroraMosaicContext } from "@/contexts/AuroraMosaicContext";
import { useAppWeb3 } from "@/contexts/AppWeb3Context";
import { CanvasBoard } from "@/components/CanvasBoard";
import { ColorPalette } from "@/components/ColorPalette";
import { CanvasStatsPanel } from "@/components/CanvasStats";
import { ActionPanel } from "@/components/ActionPanel";

function CanvasInner() {
  const {
    contractAddress,
    orderedTiles,
    panelSize,
    selectedColor,
    setSelectedColor,
    canInteract,
    isSealed,
    paintTile,
    isSubmitting,
    isDecrypting,
    isSyncing,
    statusMessage,
    refreshBoard,
    refreshStrokeStats,
    sealCurrentPanel,
    forgePanelSnapshot,
    stats,
    relicId,
    lastUpdatedAt,
  } = useAuroraMosaicContext();
  const { chainId, accounts, fhevmStatus } = useAppWeb3();

  const isConnected = Boolean(accounts && accounts.length > 0);

  const handleMint = useCallback(async () => {
    const cid = window.prompt("Enter the IPFS CID for the panel snapshot:");
    if (!cid) return;
    await forgePanelSnapshot(cid.trim());
  }, [forgePanelSnapshot]);

  return (
    <div className="space-y-12 pb-24">
      <section className="relative overflow-hidden rounded-[36px] border border-emerald-200/20 bg-gradient-to-br from-[#05110F] via-[#0B1C24] to-[#08101A] px-8 py-10 shadow-[0_36px_140px_rgba(6,24,20,0.55)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(94,234,212,0.12),transparent_65%)]" />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-soft-light" />
        <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-4">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/30 bg-emerald-200/15 px-4 py-1 text-xs font-semibold uppercase tracking-[0.4em] text-emerald-200/80">
              Mosaic Canvas · Panel 1
            </span>
            <h2 className="text-3xl font-semibold text-white md:text-4xl">Kick Off an Encrypted Aurora</h2>
            <p className="max-w-2xl text-sm leading-relaxed text-emerald-100/75">
              Every stroke shines inside FHE ciphertext so only authorized users can reveal the true palette.
              When you are ready, pick a color and infuse the canvas with your inspiration.
            </p>
          </div>
          <div className="grid gap-2 rounded-2xl border border-emerald-200/20 bg-emerald-200/10 px-4 py-3 text-xs text-emerald-100/80">
            <div>Chain ID: {chainId ?? "Not connected"}</div>
            <div>FHEVM Status: {fhevmStatus}</div>
            <div>Contract: {contractAddress ?? "Not deployed"}</div>
          </div>
        </div>
      </section>

      <section className="grid gap-10 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-8">
          <div className="relative overflow-hidden rounded-[32px] border border-emerald-200/25 bg-[#061119] p-6 shadow-[0_28px_90px_rgba(4,18,24,0.55)]">
            <div className="absolute inset-2 rounded-[28px] border border-emerald-200/10" />
            <CanvasBoard
              tiles={orderedTiles}
              width={panelSize.width}
              height={panelSize.height}
              selectedColor={selectedColor}
              disabled={!canInteract || isSealed}
              onPaint={paintTile}
            />
          </div>
          <ActionPanel
            isSubmitting={isSubmitting}
            isDecrypting={isDecrypting}
            isSyncing={isSyncing}
            isSealed={isSealed}
            statusMessage={statusMessage}
            onRefresh={() => {
              refreshBoard();
              refreshStrokeStats();
            }}
            onSeal={sealCurrentPanel}
            onMint={handleMint}
          />
        </div>
        <aside className="space-y-8">
          <ColorPalette selectedColor={selectedColor} onSelect={setSelectedColor} />
          <CanvasStatsPanel
            stats={stats}
            lastUpdatedAt={lastUpdatedAt}
            isSealed={isSealed}
            relicId={relicId}
          />
          <div className="rounded-3xl border border-emerald-200/20 bg-emerald-200/10 p-6 text-sm text-emerald-100/80 shadow-[0_24px_70px_rgba(6,24,18,0.45)]">
            <h3 className="flex items-center gap-2 text-base font-semibold text-white">Inspiration Tips</h3>
            <ul className="mt-3 space-y-2 leading-relaxed">
              <li>· Every stroke is encrypted before submission; the contract stores ciphertext handles only.</li>
              <li>· Each wallet has a 60-second cooldown to prevent spam and keep collaboration balanced.</li>
              <li>· After sealing, upload a rendered image and mint an Aurora Relic NFT to preserve the panel.</li>
            </ul>
            {!isConnected && (
              <p className="mt-3 rounded-xl border border-emerald-300/25 bg-emerald-300/15 px-3 py-2 text-xs text-emerald-100">
                Wallet not connected yet. Click “Connect MetaMask” in the navbar to authorize access.
              </p>
            )}
          </div>
          <QuickLinks />
        </aside>
      </section>
    </div>
  );
}

function QuickLinks() {
  return (
    <div className="rounded-3xl border border-emerald-200/20 bg-[#060f13] p-6 text-sm text-emerald-100/80 shadow-[0_22px_70px_rgba(4,16,20,0.45)]">
      <div className="flex items-center justify-between">
        <span className="font-semibold text-white">More Resources</span>
        <Link
          href="/gallery"
          className="text-xs uppercase tracking-wide text-emerald-200 hover:text-white"
        >
          Aurora Archive
        </Link>
      </div>
      <div className="mt-4 flex flex-wrap gap-3 text-xs">
        <Link
          href="/my-creations"
          className="rounded-full border border-emerald-300/30 px-3 py-1 text-emerald-100 hover:border-white/40 hover:text-white"
        >
          My Inspiration Trail
        </Link>
        <Link
          href="/gallery"
          className="rounded-full border border-emerald-300/30 px-3 py-1 text-emerald-100 hover:border-white/40 hover:text-white"
        >
          Panel Archive
        </Link>
        <a
          href="https://docs.zama.ai"
          target="_blank"
          rel="noreferrer"
          className="rounded-full border border-emerald-300/30 px-3 py-1 text-emerald-100 hover:border-white/40 hover:text-white"
        >
          FHEVM Docs
        </a>
      </div>
    </div>
  );
}

export default function CanvasPage() {
  return (
    <AuroraMosaicProvider>
      <CanvasInner />
    </AuroraMosaicProvider>
  );
}

