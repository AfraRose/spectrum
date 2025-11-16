"use client";

import Link from "next/link";
import { Fragment, useCallback, useMemo } from "react";
import { Sparkles, Clock3, Heart, ArrowRight } from "lucide-react";
import { AuroraMosaicProvider, useAuroraMosaicContext } from "@/contexts/AuroraMosaicContext";
import { useAppWeb3 } from "@/contexts/AppWeb3Context";
import { normalizeAddress } from "@/utils/addresses";

function MyCreationsInner() {
  const {
    orderedTiles,
    stats,
    panelSize,
    decryptionEnabled,
    enableDecryption,
    isDecrypting,
    isSyncing,
    statusMessage,
  } = useAuroraMosaicContext();
  const { accounts, chainId } = useAppWeb3();
  const account = accounts?.[0];

  const contributions = useMemo(() => {
    if (!account) return [];
    return orderedTiles
      .filter((tile) => normalizeAddress(tile.artisan) === normalizeAddress(account))
      .sort((a, b) => (b.updatedAt ?? 0) - (a.updatedAt ?? 0));
  }, [account, orderedTiles]);

  const summary = useMemo(
    () => ({
      totalPixels: contributions.length,
      latest: contributions[0],
      userBrushes: decryptionEnabled ? stats.userBrushes ?? 0 : undefined,
      totalBrushes: decryptionEnabled ? stats.totalBrushes ?? 0 : undefined,
    }),
    [contributions, decryptionEnabled, stats]
  );

  const handleManualDecrypt = useCallback(async () => {
    try {
      await enableDecryption({ forceNewSignature: true });
    } catch (error) {
      console.error("[MyCreations] enableDecryption", error);
    }
  }, [enableDecryption]);

  const decrypting = isDecrypting || isSyncing;

  return (
    <div className="space-y-12 pb-24">
      <section className="relative overflow-hidden rounded-[36px] border border-emerald-200/20 bg-gradient-to-br from-[#041015] via-[#081b23] to-[#07111a] px-8 py-12 shadow-[0_34px_130px_rgba(6,20,26,0.6)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(94,234,212,0.12),transparent_60%)]" />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-soft-light" />
        <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200/30 bg-emerald-200/15 px-4 py-1 text-xs font-semibold uppercase tracking-[0.45em] text-emerald-100/80">
              Artisan Trail
            </span>
            <h1 className="mt-4 text-3xl font-semibold text-white md:text-4xl">My Inspiration Trail</h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-emerald-100/75">
              Review every tile you have placed on Aurora Mosaic panels. Each record carries an on-chain timestamp
              and can be decrypted later to reveal the exact color.
            </p>
          </div>
          <div className="flex flex-col items-stretch gap-3">
            <div className="rounded-2xl border border-emerald-200/20 bg-emerald-200/10 px-4 py-3 text-xs text-emerald-100/80 backdrop-blur">
              <div>Wallet: {account ?? "Not connected"}</div>
              <div>Chain: {chainId ?? "Not connected"}</div>
              <div>
                Panel size: {panelSize.width} × {panelSize.height}
              </div>
            </div>
            <button
              type="button"
              onClick={handleManualDecrypt}
              disabled={decrypting || !account}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-emerald-200/45 bg-emerald-200/15 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-emerald-100 transition hover:border-emerald-100 hover:bg-emerald-200/30 hover:text-white disabled:cursor-not-allowed disabled:border-white/20 disabled:text-slate-400"
            >
              {decryptionEnabled ? "Decrypt Again" : "Decrypt My Colors"}
              <Sparkles className="h-3.5 w-3.5" />
            </button>
            <p className="text-xs text-emerald-200/70">
              {statusMessage}
              {!decryptionEnabled && " · The first decryption requires a MetaMask signature."}
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        <div className="rounded-3xl border border-emerald-200/20 bg-[#061419] p-6 text-emerald-100/80 shadow-[0_28px_90px_rgba(6,20,24,0.5)]">
          <h3 className="text-sm uppercase tracking-[0.3em] text-emerald-300/60">Total Tiles</h3>
          <p className="mt-4 text-4xl font-semibold text-white">{summary.totalPixels}</p>
          <p className="mt-2 text-xs text-emerald-200/70">Tiles you have placed on the current panel.</p>
        </div>
        <div className="rounded-3xl border border-emerald-200/20 bg-[#061419] p-6 text-emerald-100/80 shadow-[0_28px_90px_rgba(6,20,24,0.5)]">
          <h3 className="text-sm uppercase tracking-[0.3em] text-emerald-300/60">My Brushstrokes</h3>
          <p className="mt-4 text-4xl font-semibold text-white">
            {summary.userBrushes ?? "—"}
          </p>
          <p className="mt-2 text-xs text-emerald-200/70">Brush count decrypted for your wallet.</p>
        </div>
        <div className="rounded-3xl border border-emerald-200/20 bg-[#061419] p-6 text-emerald-100/80 shadow-[0_28px_90px_rgba(6,20,24,0.5)]">
          <h3 className="text-sm uppercase tracking-[0.3em] text-emerald-300/60">Global Brushstrokes</h3>
          <p className="mt-4 text-4xl font-semibold text-white">
            {summary.totalBrushes ?? "—"}
          </p>
          <p className="mt-2 text-xs text-emerald-200/70">Total collaborative strokes on this panel.</p>
        </div>
      </section>

      <section className="rounded-3xl border border-white/10 bg-[rgba(8,14,24,0.85)] p-8 shadow-[0_22px_60px_rgba(7,14,26,0.45)]">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-white">Timeline</h2>
          <Link
            href="/canvas"
            className="inline-flex items-center gap-2 rounded-full border border-emerald-200/30 px-4 py-2 text-xs uppercase tracking-wide text-emerald-100 transition hover:border-emerald-100 hover:text-white"
          >
            Back to Canvas
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        {account ? (
          contributions.length > 0 ? (
            <ul className="mt-6 space-y-5">
              {contributions.map((tile, index) => (
                <li
                  key={`${tile.x}-${tile.y}-${tile.updatedAt}-${index}`}
                  className="flex flex-col gap-2 rounded-2xl border border-emerald-200/20 bg-emerald-200/10 px-4 py-3 text-sm text-emerald-100/80 backdrop-blur md:flex-row md:items-center md:justify-between"
                >
                  <div className="flex items-center gap-4">
                    <span className="grid h-10 w-10 place-items-center rounded-lg border border-emerald-200/20 bg-[#05141a] font-mono text-xs text-emerald-200/70">
                      {tile.x},{tile.y}
                    </span>
                    <div>
                      <p>
                        Tile color:{" "}
                        <span className="font-mono text-emerald-200">
                          {tile.color ?? "Ciphertext pending decryption"}
                        </span>
                      </p>
                      <p className="text-xs text-emerald-200/70">
                        Updated at:
                        {tile.updatedAt ? new Date(tile.updatedAt * 1000).toLocaleString() : "Unknown"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200/25 px-3 py-1 text-xs text-emerald-100">
                      <Clock3 className="h-3 w-3" />
                      Block time
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200/25 px-3 py-1 text-xs text-emerald-100">
                      <Heart className="h-3 w-3" />
                      Inspiration mark
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-6 rounded-2xl border border-dashed border-emerald-200/35 bg-emerald-200/10 px-6 py-12 text-center text-emerald-100/80">
              <p className="text-lg font-semibold text-emerald-100">No tiles painted yet</p>
              <p className="mt-2 text-sm">
                Head to the canvas, try your first FHE-encrypted stroke, and let it live here as a memory.
              </p>
              <Link
                href="/canvas"
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-200 px-5 py-2 text-xs font-semibold uppercase tracking-wide text-[#041013]"
              >
                Start painting
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )
        ) : (
          <div className="mt-6 rounded-2xl border border-dashed border-emerald-200/25 bg-emerald-200/10 px-6 py-12 text-center text-emerald-100/80 backdrop-blur">
            Connect your wallet to view your inspiration history. Use the “Connect MetaMask” button in the navbar.
          </div>
        )}
      </section>
    </div>
  );
}

export default function MyCreationsPage() {
  return (
    <AuroraMosaicProvider autoDecrypt={false}>
      <MyCreationsInner />
    </AuroraMosaicProvider>
  );
}

