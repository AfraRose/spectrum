"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { TileCell } from "@/hooks/useAuroraMosaic";
import clsx from "clsx";

const CANVAS_PIXEL_SIZE = 640;

type CanvasBoardProps = {
  tiles: TileCell[];
  width: number;
  height: number;
  selectedColor: string;
  disabled?: boolean;
  onPaint: (x: number, y: number, color: string) => Promise<void> | void;
};

type HoverState = { x: number; y: number } | null;

export function CanvasBoard({
  tiles,
  width,
  height,
  selectedColor,
  disabled,
  onPaint,
}: CanvasBoardProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [hoverState, setHoverState] = useState<HoverState>(null);

  const pixelSize = useMemo(() => Math.floor(CANVAS_PIXEL_SIZE / width), [width]);

  const drawGrid = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      ctx.fillStyle = "#051316";
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

      ctx.strokeStyle = "rgba(82, 233, 191, 0.08)";
      ctx.lineWidth = 1;
      for (let x = 0; x <= width; x += 1) {
        ctx.beginPath();
        ctx.moveTo(x * pixelSize + 0.5, 0);
        ctx.lineTo(x * pixelSize + 0.5, height * pixelSize);
        ctx.stroke();
      }
      for (let y = 0; y <= height; y += 1) {
        ctx.beginPath();
        ctx.moveTo(0, y * pixelSize + 0.5);
        ctx.lineTo(width * pixelSize, y * pixelSize + 0.5);
        ctx.stroke();
      }
    },
    [height, pixelSize, width]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    drawGrid(ctx);

    tiles.forEach((tile) => {
      if (!tile.color) return;
      ctx.fillStyle = tile.color;
      ctx.fillRect(tile.x * pixelSize, tile.y * pixelSize, pixelSize, pixelSize);
    });
  }, [tiles, drawGrid, pixelSize]);

  const getCanvasCoordinates = useCallback(
    (event: PointerEvent | TouchEvent) => {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return null;
      let clientX: number;
      let clientY: number;
      if ("touches" in event && event.touches.length > 0) {
        clientX = event.touches[0].clientX;
        clientY = event.touches[0].clientY;
      } else if ("clientX" in event) {
        clientX = event.clientX;
        clientY = event.clientY;
      } else {
        return null;
      }
      const x = Math.floor(((clientX - rect.left) / rect.width) * width);
      const y = Math.floor(((clientY - rect.top) / rect.height) * height);
      if (x < 0 || x >= width || y < 0 || y >= height) return null;
      return { x, y };
    },
    [height, width]
  );

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLCanvasElement>) => {
      const coords = getCanvasCoordinates(event.nativeEvent);
      setHoverState(coords);
    },
    [getCanvasCoordinates]
  );

  const handlePointerLeave = useCallback(() => {
    setHoverState(null);
  }, []);

  const handlePointerUp = useCallback(
    async (event: React.PointerEvent<HTMLCanvasElement>) => {
      if (disabled) return;
      const coords = getCanvasCoordinates(event.nativeEvent);
      if (!coords) return;
      await onPaint(coords.x, coords.y, selectedColor);
    },
    [disabled, getCanvasCoordinates, onPaint, selectedColor]
  );

  const hoverStyle = useMemo(() => {
    if (!hoverState) return undefined;
    return {
      left: hoverState.x * pixelSize,
      top: hoverState.y * pixelSize,
      width: pixelSize,
      height: pixelSize,
    };
  }, [hoverState, pixelSize]);

  return (
    <div
      ref={containerRef}
      className={clsx(
        "relative flex items-center justify-center overflow-hidden rounded-[28px] border border-emerald-200/20 bg-[#031113] p-6",
        disabled && "opacity-80"
      )}
    >
      <canvas
        ref={canvasRef}
        className="h-full w-full max-w-[720px] cursor-crosshair rounded-2xl"
        width={width * pixelSize}
        height={height * pixelSize}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        onPointerUp={handlePointerUp}
      />
      {hoverStyle && (
        <div
          className="pointer-events-none absolute rounded-sm border border-emerald-200/70 bg-emerald-200/10 shadow-[0_0_14px_rgba(90,246,203,0.45)]"
          style={hoverStyle}
        />
      )}
    </div>
  );
}

