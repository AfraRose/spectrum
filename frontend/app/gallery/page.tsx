"use client";

import Link from "next/link";
import { useMemo } from "react";
import { ShieldCheck, ArrowRight } from "lucide-react";
import { AuroraMosaicProvider, useAuroraMosaicContext } from "@/contexts/AuroraMosaicContext";
import { useAppWeb3 } from "@/contexts/AppWeb3Context";

function GalleryInner() {
  const { relicId, isSealed, stats, contractAddress, lastUpdatedAt } = useAuroraMosaicContext();
  const { chainId } = useAppWeb3();

  const forged = typeof relicId === "number" && relicId > 0;

  const infoBlocks = useMemo(
    () => [
      {
        title: "Panel Status",
        value: isSealed ? "Sealed" : "Open",
        description: isSealed
          ? "This panel has been sealed and is ready to become an Aurora Relic."
          : "Painting is still open; seal the panel to upload snapshots and mint.",
      },
      {
        title: "Total Brushstrokes",
        value: stats.totalBrushes ?? 0,
        description: "All strokes are counted via encrypted on-chain metrics for accuracy.",
      },
      {
        title: "My Contributions",
        value: stats.userBrushes ?? 0,
        description: "Your encrypted contributions can be decrypted inside My Inspiration for detail.",
      },
    ],
    [isSealed, stats]
  );

  return (
    <div className="space-y-12 pb-24">
      <section className="relative overflow-hidden rounded-[36px] border border-emerald-200/20 bg-gradient-to-br from-[#041013] via-[#081c25] to-[#070f1a] px-8 py-12 shadow-[0_36px_160px_rgba(6,20,24,0.55)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(94,234,212,0.1),transparent_60%)]" />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-soft-light" />
        <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-4">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200/30 bg-emerald-200/15 px-4 py-1 text-xs font-semibold uppercase tracking-[0.45em] text-emerald-100/80">
              Aurora Relic Gallery
            </span>
            <h1 className="text-3xl font-semibold text-white md:text-4xl">Aurora Archive</h1>
            <p className="max-w-2xl text-sm leading-relaxed text-emerald-100/80">
              Revisit every sealed panel, encrypted metric, and minted relic. All insights are derived from FHE ciphertext,
              revealing only the essentials needed to document this journey of light.
            </p>
          </div>
          <div className="rounded-2xl border border-emerald-200/20 bg-emerald-200/10 px-4 py-3 text-xs text-emerald-100/80 backdrop-blur">
            <div>Chain: {chainId ?? "Unknown"}</div>
            <div>Contract: {contractAddress ?? "Not deployed"}</div>
            <div>
              Last updated:{" "}
              {lastUpdatedAt ? new Date(lastUpdatedAt * 1000).toLocaleString() : "Not sealed yet"}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        {infoBlocks.map((item) => (
          <div
            key={item.title}
            className="rounded-3xl border border-emerald-200/15 bg-[#061417] p-6 text-emerald-100/85 shadow-[0_28px_90px_rgba(6,22,24,0.45)]"
          >
            <h3 className="text-sm uppercase tracking-[0.35em] text-emerald-300/60">{item.title}</h3>
            <p className="mt-4 text-3xl font-semibold text-white">{item.value}</p>
            <p className="mt-2 text-xs leading-relaxed text-emerald-200/70">{item.description}</p>
          </div>
        ))}
        <div className="rounded-3xl border border-dashed border-emerald-200/35 bg-emerald-200/10 p-6 text-emerald-100/80 shadow-[0_26px_85px_rgba(6,20,20,0.45)]">
          <h3 className="text-sm uppercase tracking-[0.3em] text-emerald-200">FHE Obfuscation</h3>
          <p className="mt-4 text-sm">
            Panel data is encrypted before touching the chain. Without an authorized signature, observers only see ciphertext handles,
            keeping the artwork safely shrouded.
          </p>
        </div>
      </section>

      <section className="rounded-[36px] border border-emerald-200/20 bg-[#061219] p-10 text-emerald-100/80 shadow-[0_36px_120px_rgba(6,20,28,0.55)]">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-white">Panel #1 · Aurora Relic</h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed">
              Once the panel is sealed, upload a rendered snapshot to IPFS and mint an Aurora Relic NFT.
              It records the spectrum and contributors of the moment while preserving encrypted color privacy.
            </p>
          </div>
          <Link
            href="/canvas"
            className="inline-flex items-center gap-2 rounded-full border border-emerald-200/25 px-4 py-2 text-xs uppercase tracking-wide text-emerald-100 transition hover:border-emerald-100 hover:text-white"
          >
            Back to Canvas
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <div className="rounded-3xl border border-emerald-200/20 bg-gradient-to-br from-emerald-200/10 via-teal-300/10 to-sky-300/10 p-8 text-white shadow-[0_28px_90px_rgba(6,26,32,0.55)]">
            <h3 className="text-xl font-semibold">On-Chain Aurora Relic</h3>
            <p className="mt-2 text-sm text-white/80">
              After minting, the relic lives in the AuroraMosaic contract and can power showcases, governance rewards, or DAO badges.
            </p>
            <div className="mt-6 grid gap-3 text-sm text-white/90">
              <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/10 px-4 py-3">
                <span>Relic ID</span>
                <span className="font-mono text-lg">
                  {forged ? `#${relicId}` : "Not minted"}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/10 px-4 py-3">
                <span>Mint status</span>
                <span className="font-mono">{forged ? "Completed" : "Pending"}</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/10 px-4 py-3">
                <span>Panel status</span>
                <span className="font-mono">{isSealed ? "Sealed" : "Open"}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4 rounded-3xl border border-emerald-200/20 bg-[#050f14] p-6 text-sm text-emerald-100/80 shadow-[0_28px_90px_rgba(6,20,26,0.55)]">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-10 w-10 text-emerald-200" />
              <div>
                <h4 className="text-lg font-semibold text-white">Privacy-Preserving Snapshots</h4>
                <p className="text-xs">
                  Only the minimal on-chain index is retained; color handles stay encrypted and contributor identities remain pseudonymous.
                </p>
              </div>
            </div>
            <div className="rounded-2xl border border-emerald-200/20 bg-emerald-200/10 px-4 py-3">
              <p className="text-xs">
                Minting flow: seal the panel → upload the render to IPFS → enter the CID on the canvas page → call{" "}
                <code>forgePanelRelic</code> to finish minting.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 text-xs">
              <Link
                href="/canvas"
                className="inline-flex items-center gap-2 rounded-full border border-emerald-200/30 px-3 py-1 text-emerald-100 hover:border-emerald-100 hover:text-white"
              >
                Seal a panel
              </Link>
              <Link
                href="https://docs.zama.ai"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-emerald-200/25 px-3 py-1 text-emerald-100 hover:border-emerald-100 hover:text-white"
              >
                Read FHEVM docs
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[32px] border border-emerald-200/20 bg-[#051015] px-8 py-10 text-center text-emerald-100/80 shadow-[0_30px_110px_rgba(6,18,22,0.6)]">
        <h2 className="text-2xl font-semibold text-white">Ready to cast your spectrum into a relic?</h2>
        <p className="mt-3 text-sm">
          When you and your collaborators are satisfied, seal the panel and mint an Aurora Relic. We will showcase it here while keeping
          every contributor’s encrypted signature intact.
        </p>
        <Link
          href="/canvas"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-emerald-200 px-5 py-2 text-xs font-semibold uppercase tracking-wide text-[#031015] transition hover:-translate-y-1 hover:bg-emerald-100"
        >
          Go to Canvas
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </div>
  );
}

export default function GalleryPage() {
  return (
    <AuroraMosaicProvider>
      <GalleryInner />
    </AuroraMosaicProvider>
  );
}

