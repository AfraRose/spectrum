"use client";

import clsx from "clsx";

const PRESET_COLORS = [
  "#5BE9B9",
  "#4DD5C5",
  "#3BC6D3",
  "#2DB1E0",
  "#1C96ED",
  "#B5F5E6",
  "#9EE7D8",
  "#8FD4C9",
  "#7EC2BA",
  "#6AA9A8",
  "#5D8FA4",
  "#4F7CA0",
  "#6E77FF",
  "#A388FF",
  "#FF9CEF",
  "#FFC18E",
];

type ColorPaletteProps = {
  selectedColor: string;
  onSelect: (hex: string) => void;
};

export function ColorPalette({ selectedColor, onSelect }: ColorPaletteProps) {
  return (
    <div className="rounded-3xl border border-emerald-200/20 bg-[#071417] p-6 shadow-[0_26px_80px_rgba(6,22,20,0.45)]">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-emerald-300/60">
        Aurora Palette
      </p>
      <h3 className="mt-2 text-lg font-semibold text-white">Color Ribbon</h3>
      <div className="mt-5 grid grid-cols-8 gap-3">
        {PRESET_COLORS.map((color) => (
          <button
            key={color}
            onClick={() => onSelect(color)}
            className={clsx(
              "relative h-10 w-10 rounded-full transition duration-200 shadow-[0_0_22px_rgba(8,30,28,0.55)]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-200 focus-visible:ring-offset-2 focus-visible:ring-offset-[#061115]",
              selectedColor === color
                ? "ring-2 ring-sky-200 ring-offset-2 ring-offset-[#061115]"
                : "hover:scale-110"
            )}
            style={{ backgroundColor: color }}
          >
            {selectedColor === color && (
              <span className="pointer-events-none absolute inset-0 rounded-full border border-white/70 shadow-[0_0_22px_rgba(255,255,255,0.35)]" />
            )}
          </button>
        ))}
      </div>
      <div className="mt-6 rounded-2xl border border-emerald-200/15 bg-emerald-200/10 p-4 text-sm text-emerald-200/80">
        Current color:
        <span className="ml-2 font-mono text-white">{selectedColor}</span>
      </div>
    </div>
  );
}

