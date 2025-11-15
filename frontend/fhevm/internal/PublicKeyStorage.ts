const STORAGE_KEY = "pixelwall:fhevm:public-keys";

type PublicKeyEntry = {
  publicKey: string;
  publicParams: Uint8Array;
};

function loadMap(): Record<string, PublicKeyEntry> {
  if (typeof window === "undefined") {
    return {};
  }
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return {};
  }
  try {
    const parsed = JSON.parse(raw) as Record<
      string,
      { publicKey: string; publicParams: number[] }
    >;
    return Object.fromEntries(
      Object.entries(parsed).map(([key, value]) => [
        key,
        { publicKey: value.publicKey, publicParams: new Uint8Array(value.publicParams) },
      ])
    );
  } catch (error) {
    console.warn("[PublicKeyStorage] parse error", error);
    return {};
  }
}

export async function publicKeyStorageGet(aclAddress: string): Promise<PublicKeyEntry> {
  const map = loadMap();
  if (!map[aclAddress]) {
    throw new Error("FHEVM ACL public key not cached yet.");
  }
  return map[aclAddress];
}

export async function publicKeyStorageSet(
  aclAddress: string,
  publicKey: string,
  publicParams: Uint8Array
) {
  if (typeof window === "undefined") {
    return;
  }
  const map = loadMap();
  map[aclAddress] = { publicKey, publicParams };
  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(
      Object.fromEntries(
        Object.entries(map).map(([key, value]) => [
          key,
          { publicKey: value.publicKey, publicParams: Array.from(value.publicParams) },
        ])
      )
    )
  );
}

