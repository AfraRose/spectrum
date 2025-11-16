"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, ShieldCheck, Users, Zap, Palette, Cpu, Trophy } from "lucide-react";

const featureCards = [
  {
    icon: Palette,
    title: "Aurora Strokes",
    description:
      "128×128 collaborative panels that keep encrypted handles on-chain, letting the spectrum evolve in real time.",
  },
  {
    icon: ShieldCheck,
    title: "Obfuscated Encryption",
    description:
      "Every workflow runs under Fully Homomorphic Encryption; the contract stores ciphertext only and access is signature-gated.",
  },
  {
    icon: Users,
    title: "Collaborative Ledger",
    description:
      "Personal footprints, contribution heatmaps, and activity feeds are tracked automatically for DAOs and creative collectives.",
  },
  {
    icon: Trophy,
    title: "Aurora Relic",
    description:
      "Seal a panel, upload an IPFS snapshot, and mint an Aurora Relic NFT to archive the masterpiece forever.",
  },
];

const workflow = [
  {
    step: "01",
    title: "Connect & Boot the Spectrum",
    detail:
      "Use the Hardhat FHEVM mock locally and switch to the Relayer SDK on Sepolia. The navbar reflects chain ID and FHEVM status in real time.",
  },
  {
    step: "02",
    title: "Encrypt Each Stroke",
    detail:
      "Pick a color tile and submit an encrypted stroke. The contract validates it and updates contribution metrics instantly.",
  },
  {
    step: "03",
    title: "Decrypt & Explore",
    detail:
      "Authorized signatures unlock true colors. Toggle live refresh, collaborate across devices, and review your history in My Inspiration.",
  },
  {
    step: "04",
    title: "Seal and Mint",
    detail:
      "Once the spectrum feels complete, seal the panel, upload an IPFS snapshot, and mint an Aurora Relic NFT with a single transaction.",
  },
];

export default function HomePage() {
  return (
    <div className="space-y-16 pb-24">
      <section className="relative overflow-hidden rounded-[36px] border border-emerald-200/25 bg-gradient-to-br from-[#041218] via-[#061e25] to-[#051218] px-10 py-16 shadow-[0_48px_120px_rgba(6,20,26,0.55)]">
        <div className="pixel-grid-bg opacity-20" />
        <div className="absolute -left-24 top-12 h-72 w-72 rounded-full bg-emerald-300/25 blur-[110px]" />
        <div className="absolute -right-16 bottom-10 h-96 w-96 rounded-full bg-sky-300/25 blur-[140px]" />
        <div className="absolute inset-x-0 top-24 h-1/3 bg-[radial-gradient(circle_at_top,rgba(94,234,212,0.12),transparent_70%)]" />
        <div className="relative mx-auto flex max-w-4xl flex-col items-start gap-6">
          <span className="badge shadow-[0_0_30px_rgba(76,201,240,0.35)]">
            <Sparkles className="h-4 w-4 text-emerald-200" />
            Aurora Mosaic · FHE Canvas
          </span>
          <h1 className="text-4xl font-bold leading-tight text-transparent drop-shadow-[0_14px_45px_rgba(94,234,212,0.45)] sm:text-5xl bg-gradient-to-r from-white via-emerald-200 to-sky-200 bg-clip-text">
            Aurora Atelier · An FHE-Powered Collaborative Experience
          </h1>
          <p className="max-w-2xl text-lg text-slate-200/90">
            Bring together creators from around the world and secure every stroke with Fully Homomorphic Encryption.
            Whether you build locally or on testnet, watch an encrypted spectrum emerge in real time.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/canvas"
              className="glow-button floating inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-emerald-200 to-sky-200 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-[#031013] shadow-[0_0_45px_rgba(94,234,212,0.55)] transition hover:-translate-y-1 hover:shadow-[0_16px_60px_rgba(94,234,212,0.55)]"
            >
              Enter Canvas
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/gallery"
              className="inline-flex items-center gap-3 rounded-full border border-emerald-200/35 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-emerald-100 transition hover:border-emerald-100 hover:bg-emerald-200/20 hover:text-white"
            >
              Visit Gallery
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        {featureCards.map((feature) => (
          <div
            key={feature.title}
            className="relative overflow-hidden rounded-3xl border border-emerald-200/20 bg-[#05151b] p-8 text-emerald-100/80 shadow-[0_32px_110px_rgba(6,22,26,0.45)] transition hover:-translate-y-1.5 hover:border-emerald-100/40 hover:shadow-[0_36px_120px_rgba(94,234,212,0.28)]"
          >
            <div className="noise-overlay" />
            <feature.icon className="h-10 w-10 text-emerald-200 drop-shadow-[0_8px_18px_rgba(94,234,212,0.35)]" />
            <h3 className="mt-5 text-2xl font-semibold text-white">{feature.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-emerald-200/70">{feature.description}</p>
            <span className="absolute -right-10 -bottom-12 h-36 w-36 rounded-full bg-emerald-300/20 blur-3xl" />
          </div>
        ))}
      </section>

      <section className="rounded-3xl border border-emerald-200/20 bg-[#05151c] p-10 text-emerald-100/80 shadow-[0_38px_110px_rgba(6,18,24,0.55)]">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.35em] text-emerald-300/60">Workflow</p>
            <h2 className="mt-3 text-3xl font-semibold text-white">Four Steps to Finish Your Aurora Canvas</h2>
            <p className="mt-2 max-w-2xl text-sm">
              Whether you are new to FHEVM or crafting encrypted art, this workflow gets you productive in minutes.
            </p>
          </div>
          <Link
            href="/canvas"
            className="inline-flex items-center gap-2 rounded-full border border-emerald-200/30 bg-emerald-200/15 px-6 py-3 text-xs font-semibold uppercase tracking-wide text-emerald-100 transition hover:border-emerald-100 hover:bg-emerald-200/25 hover:text-white"
          >
            View Quickstart
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {workflow.map((item) => (
            <div
              key={item.step}
              className="relative overflow-hidden rounded-2xl border border-emerald-200/20 bg-gradient-to-br from-emerald-200/12 to-transparent p-6"
            >
              <span className="text-5xl font-black text-emerald-200/15">{item.step}</span>
              <h3 className="mt-4 text-xl font-semibold text-white">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-emerald-200/70">{item.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-3xl border border-emerald-200/20 bg-[#05131a] p-6 text-emerald-100/80 shadow-[0_32px_110px_rgba(6,20,24,0.5)] transition hover:-translate-y-1.5 hover:border-emerald-100/40">
          <h3 className="text-xl font-semibold text-white">Live Spectrum Dashboard</h3>
          <p className="mt-2 text-sm">
            Track panel count, brush totals, and active creators directly from on-chain data.
          </p>
          <Link
            href="/canvas"
            className="mt-6 inline-flex items-center gap-2 rounded-full border border-emerald-200/25 px-4 py-2 text-xs uppercase tracking-wide text-emerald-100 transition hover:border-emerald-100 hover:text-white"
          >
            Open Canvas
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="rounded-3xl border border-emerald-200/20 bg-[#05131a] p-6 text-emerald-100/80 shadow-[0_32px_110px_rgba(6,20,24,0.5)] transition hover:-translate-y-1.5 hover:border-emerald-100/40">
          <h3 className="text-xl font-semibold text-white">Aurora Archive</h3>
          <p className="mt-2 text-sm">
            Explore sealed panel snapshots, relic minting history, and contributor timelines for inspiration.
          </p>
          <Link
            href="/gallery"
            className="mt-6 inline-flex items-center gap-2 rounded-full border border-emerald-200/25 px-4 py-2 text-xs uppercase tracking-wide text-emerald-100 transition hover:border-emerald-100 hover:text-white"
          >
            Go to Archive
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="rounded-3xl border border-emerald-200/20 bg-[#05131a] p-6 text-emerald-100/80 shadow-[0_32px_110px_rgba(6,20,24,0.5)] transition hover:-translate-y-1.5 hover:border-emerald-100/40">
          <h3 className="text-xl font-semibold text-white">Inspiration Trail</h3>
          <p className="mt-2 text-sm">
            Keep an encrypted record of tiles, contributions, and timestamps to build your personal timeline.
          </p>
          <Link
            href="/my-creations"
            className="mt-6 inline-flex items-center gap-2 rounded-full border border-emerald-200/25 px-4 py-2 text-xs uppercase tracking-wide text-emerald-100 transition hover:border-emerald-100 hover:text-white"
          >
            View My Trail
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <section className="rounded-3xl border border-emerald-200/20 bg-gradient-to-br from-[#05131a] via-[#061921] to-[#05131a] p-10 text-center text-emerald-100/80 shadow-[0_36px_120px_rgba(6,18,22,0.55)]">
        <h2 className="text-3xl font-semibold text-white">Ready to Start Your Aurora Journey?</h2>
        <p className="mt-3 text-sm">
          Connect your wallet to experience FHEVM-enabled collaboration. From hackathon demos to DAO art projects,
          Aurora Mosaic helps you build privacy-first on-chain art.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/canvas"
            className="glow-button inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-emerald-200 to-sky-200 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-[#041015] transition hover:-translate-y-1.5 hover:shadow-[0_20px_60px_rgba(94,234,212,0.55)]"
          >
            Start Creating
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="https://docs.zama.ai"
            target="_blank"
            className="inline-flex items-center gap-3 rounded-full border border-emerald-200/30 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-emerald-100 transition hover:border-emerald-100 hover:bg-emerald-200/20 hover:text-white"
          >
            View FHEVM Docs
          </Link>
        </div>
      </section>
    </div>
  );
}

