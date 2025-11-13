"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, Palette, Grid2X2, Trophy, Home, Wallet2 } from "lucide-react";
import { useAppWeb3 } from "@/contexts/AppWeb3Context";
import clsx from "clsx";

const navItems = [
  { href: "/", label: "Aurora Overview", icon: Home },
  { href: "/canvas", label: "Collaboration", icon: Palette },
  { href: "/my-creations", label: "My Inspiration", icon: Grid2X2 },
  { href: "/gallery", label: "Archive", icon: Trophy },
];

export function AppNavbar() {
  const pathname = usePathname();
  const { isConnected, accounts, connect, chainId, fhevmStatus, fhevmError } = useAppWeb3();

  const currentAccount = accounts?.[0];
  const displayAccount = currentAccount
    ? `${currentAccount.slice(0, 6)}…${currentAccount.slice(-4)}`
    : "Connect MetaMask";

  return (
    <header className="sticky top-0 z-50 border-b border-emerald-200/20 bg-[#040d11cc] backdrop-blur-2xl shadow-[0_12px_80px_rgba(4,18,22,0.55)]">
      <div className="relative mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="group flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-300 to-sky-300 text-[#041013] shadow-[0_0_25px_rgba(94,234,212,0.45)] transition group-hover:-translate-y-1 group-hover:shadow-[0_20px_50px_rgba(94,234,212,0.45)]">
            <Sparkles className="h-5 w-5" />
          </span>
          <div className="flex flex-col">
            <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-emerald-200/70">
              Aurora Mosaic
            </span>
            <span className="text-lg font-semibold text-white">FHE Spectrum Studio</span>
          </div>
        </Link>
        <nav className="flex items-center gap-1 rounded-full border border-emerald-200/25 bg-emerald-200/15 px-1 py-1 backdrop-blur-md">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  "flex items-center gap-2 rounded-full px-3 py-2 text-xs font-medium uppercase tracking-wide transition",
                  isActive
                    ? "bg-white text-[#041015] shadow-[0_0_18px_rgba(94,234,212,0.45)]"
                    : "text-emerald-100/80 hover:text-white hover:bg-emerald-200/25"
                )}
              >
                <Icon className={clsx("h-4 w-4", isActive ? "text-[#041015]" : "text-emerald-200")} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-3">
          <div className="hidden flex-col text-right text-xs text-slate-400 sm:flex">
            <span className={fhevmStatus === "error" ? "text-red-400" : ""}>
              FHEVM Status: {fhevmStatus}
            </span>
            {fhevmError && <span className="text-red-400 text-[10px]">{fhevmError.message}</span>}
            <span>Chain: {chainId ?? "Not connected"}</span>
          </div>
          <button
            onClick={connect}
            className={clsx(
              "inline-flex items-center gap-2 rounded-full border px-5 py-2 text-xs font-semibold uppercase tracking-wider transition",
              isConnected
                ? "border-emerald-200/50 bg-emerald-200/20 text-emerald-100 hover:bg-emerald-200/35 hover:text-white"
                : "border-sky-200/60 bg-sky-200/20 text-sky-100 hover:bg-sky-200/35 hover:text-white"
            )}
          >
            <Wallet2 className="h-4 w-4" />
            {displayAccount}
          </button>
        </div>
      </div>
    </header>
  );
}

