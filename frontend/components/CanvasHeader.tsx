"use client";

import { Wallet } from "lucide-react";

type CanvasHeaderProps = {
  isConnected: boolean;
  account?: string;
  onConnect: () => Promise<void> | void;
  chainId?: number;
};

export function CanvasHeader({
  isConnected,
  account,
  onConnect,
  chainId,
}: CanvasHeaderProps) {
  const shortAccount = account
    ? `${account.slice(0, 6)}…${account.slice(-4)}`
    : undefined;

  return (
    <header className="flex flex-col gap-6 rounded-[32px] border border-emerald-200/25 bg-gradient-to-br from-[#061a17] via-[#0a1e28] to-[#091322] px-8 py-8 shadow-[0_40px_120px_rgba(8,24,20,0.6)] md:flex-row md:items-center md:justify-between">
      <div className="max-w-2xl space-y-4">
        <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200/30 bg-emerald-200/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.45em] text-emerald-200/80">
          Aurora Mosaic Studio
        </span>
        <h1 className="text-4xl font-semibold tracking-tight text-white md:text-5xl">
          Aurora Atelier · Encrypted Collaboration in Motion
        </h1>
        <p className="text-sm leading-relaxed text-emerald-100/80">
          With Fully Homomorphic Encryption, inspiration weaves through ciphertext while friends co-create on-chain.
          Feel every stroke without exposing raw data and chronicle each spark of creativity.
        </p>
      </div>
      <button
        onClick={() => onConnect()}
        className="group inline-flex items-center gap-4 rounded-full border border-emerald-200/50 bg-emerald-200/15 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-emerald-100 transition hover:border-emerald-100 hover:bg-emerald-200/25 hover:text-white"
      >
        <Wallet className="h-4 w-4 transition group-hover:text-emerald-100" />
        {isConnected
          ? shortAccount ?? "Connected"
          : "Connect MetaMask"}
        {chainId && (
          <span className="rounded-full border border-emerald-200/25 bg-emerald-200/15 px-2 py-0.5 text-[10px] uppercase text-emerald-100/70">
            Chain {chainId}
          </span>
        )}
      </button>
    </header>
  );
}

