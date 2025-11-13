"use client";

import { Leaf, ShieldCheck, Sparkles } from "lucide-react";
import { PanelStats } from "@/hooks/useAuroraMosaic";

type CanvasStatsProps = {
  stats: PanelStats;
  lastUpdatedAt?: number;
  isSealed: boolean;
  relicId?: number;
};

export function CanvasStatsPanel({
  stats,
  lastUpdatedAt,
  isSealed,
  relicId,
}: CanvasStatsProps) {
  return (
    <div className="rounded-3xl border border-emerald-200/20 bg-gradient-to-br from-[#0B1F1A] via-[#0A1517] to-[#05090C] p-6 text-sm text-emerald-100 shadow-[0_32px_120px_rgba(8,28,24,0.55)] backdrop-blur-xl">
      <div className="flex items-center justify-between">
        <div>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-slate-400">
            Atelier Status
          </p>
          <h3 className="mt-2 text-lg font-semibold text-white">Panel Status Overview</h3>
        </div>
        <span className="rounded-full border border-emerald-300/40 bg-emerald-300/10 px-3 py-1 text-xs uppercase tracking-wide text-emerald-200 shadow-[0_0_18px_rgba(88,236,190,0.35)]">
          {isSealed ? "🔒 Sealed" : "🟢 Live"}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3">
        <StatCard
          icon={<Sparkles className="h-4 w-4 text-emerald-300 drop-shadow-[0_0_12px_rgba(120,255,210,0.55)]" />}
          label="Total Brushstrokes"
          value={stats.totalBrushes ?? 0}
        />
        <StatCard
          icon={<Leaf className="h-4 w-4 text-teal-200 drop-shadow-[0_0_12px_rgba(120,255,210,0.35)]" />}
          label="My Contributions"
          value={stats.userBrushes ?? 0}
        />
        <StatCard
          icon={<ShieldCheck className="h-4 w-4 text-sky-200 drop-shadow-[0_0_12px_rgba(140,205,255,0.45)]" />}
          label="Relic ID"
          value={relicId !== undefined ? `#${relicId}` : "-"}
        />
      </div>

      <div className="mt-5 rounded-2xl border border-emerald-300/15 bg-emerald-300/5 px-4 py-3 text-xs text-emerald-200/80">
        Last activity:
        <span className="ml-2 font-mono text-emerald-100">
          {lastUpdatedAt
            ? formatTimestamp(lastUpdatedAt)
            : "No strokes yet"}
        </span>
      </div>
    </div>
  );
}

type StatCardProps = {
  icon: React.ReactNode;
  label: string;
  value: number | string;
};

function StatCard({ icon, label, value }: StatCardProps) {
  return (
    <div className="flex flex-col items-start gap-2 rounded-xl border border-white/10 bg-[rgba(9,14,22,0.7)] px-3 py-4 shadow-[0_12px_34px_rgba(7,14,24,0.35)]">
      <span className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-slate-400">
        {icon}
        {label}
      </span>
      <span className="font-mono text-lg text-white">{value}</span>
    </div>
  );
}

function formatTimestamp(timestamp: number) {
  const date = new Date(timestamp * 1000);
  return date.toLocaleString();
}

