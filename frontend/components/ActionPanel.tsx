"use client";

import clsx from "clsx";
import { Loader2, Lock, RefreshCw, Sparkles, UploadCloud } from "lucide-react";

type ActionPanelProps = {
  isSubmitting: boolean;
  isDecrypting: boolean;
  isSyncing: boolean;
  isSealed: boolean;
  statusMessage: string;
  onRefresh: () => void;
  onSeal: () => void;
  onMint: () => void;
};

export function ActionPanel({
  isSubmitting,
  isDecrypting,
  isSyncing,
  isSealed,
  statusMessage,
  onRefresh,
  onSeal,
  onMint,
}: ActionPanelProps) {
  const loading = isSubmitting || isDecrypting || isSyncing;

  return (
    <div className="flex flex-col gap-4 rounded-[28px] border border-emerald-200/20 bg-[#06151a] px-6 py-5 text-sm text-emerald-100/80 shadow-[0_24px_85px_rgba(6,22,20,0.5)] md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-3">
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin text-emerald-200" />
        ) : (
          <Sparkles className="h-4 w-4 text-emerald-200" />
        )}
        <span className="font-mono text-xs uppercase tracking-[0.3em] text-emerald-300/60">
          Live Status
        </span>
        <span className="text-base text-white">{statusMessage}</span>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={onRefresh}
          className="group inline-flex items-center gap-2 rounded-full border border-emerald-200/35 bg-emerald-200/15 px-4 py-2 text-xs uppercase tracking-widest text-emerald-100 transition hover:border-emerald-100 hover:bg-emerald-200/30 hover:text-white"
        >
          <RefreshCw className="h-3.5 w-3.5 group-hover:rotate-180 group-hover:text-emerald-50" />
          Refresh
        </button>
        <button
          onClick={onSeal}
          disabled={isSealed}
          className={clsx(
            "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs uppercase tracking-widest transition",
            isSealed
              ? "cursor-not-allowed border-slate-600 bg-slate-800/40 text-slate-400"
              : "border-teal-200/45 bg-teal-200/15 text-teal-100 hover:border-teal-100 hover:bg-teal-200/35 hover:text-white"
          )}
        >
          <Lock className="h-3.5 w-3.5" />
          Seal Panel
        </button>
        <button
          onClick={onMint}
          className="inline-flex items-center gap-2 rounded-full border border-sky-200/45 bg-sky-200/15 px-4 py-2 text-xs uppercase tracking-widest text-sky-100 transition hover:border-sky-100 hover:bg-sky-200/30 hover:text-white"
        >
          <UploadCloud className="h-3.5 w-3.5" />
          Mint Relic
        </button>
      </div>
    </div>
  );
}

