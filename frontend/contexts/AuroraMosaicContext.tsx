"use client";

import { ReactNode, createContext, useContext } from "react";
import { useInMemoryStorage } from "@/hooks/useInMemoryStorage";
import { useAuroraMosaic } from "@/hooks/useAuroraMosaic";

type AuroraMosaicContextValue = ReturnType<typeof useAuroraMosaic>;

const AuroraMosaicContext = createContext<AuroraMosaicContextValue | null>(null);

export function AuroraMosaicProvider({
  children,
  panelId = 1,
  autoDecrypt,
}: {
  children: ReactNode;
  panelId?: number;
  autoDecrypt?: boolean;
}) {
  const { storage } = useInMemoryStorage();
  const auroraMosaic = useAuroraMosaic({
    fhevmDecryptionSignatureStorage: storage,
    panelId,
    autoDecrypt,
  });

  return <AuroraMosaicContext.Provider value={auroraMosaic}>{children}</AuroraMosaicContext.Provider>;
}

export function useAuroraMosaicContext() {
  const ctx = useContext(AuroraMosaicContext);
  if (!ctx) {
    throw new Error("useAuroraMosaicContext must be used within a AuroraMosaicProvider");
  }
  return ctx;
}

