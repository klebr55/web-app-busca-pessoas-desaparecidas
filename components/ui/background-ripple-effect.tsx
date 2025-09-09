"use client";
import React, { useMemo, useRef, useState, useEffect } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ActiveCell {
  row: number;
  col: number;
  photoUrl: string;
  opacity: number;
  fadeIn: boolean;
}

export const BackgroundRippleEffect = ({
  rows = 8,
  cols = 27,
  cellSize = 56,
  photos = [],
  className,
}: {
  rows?: number;
  cols?: number;
  cellSize?: number;
  photos?: string[];
  className?: string;
}) => {
  const [clickedCell, setClickedCell] = useState<{
    row: number;
    col: number;
  } | null>(null);
  const [rippleKey, setRippleKey] = useState(0);
  const [activeCells, setActiveCells] = useState<ActiveCell[]>([]);
  const ref = useRef<HTMLDivElement | null>(null);
  const [dynamicCols, setDynamicCols] = useState(cols);
  const photosRef = useRef<string[]>([]);

  const availablePhotos = useMemo(() => {
    if (photos && photos.length > 0) {
      photosRef.current = photos;
      return photos;
    }
    const placeholders = Array.from(
      { length: 30 },
      (_, i) => `https://i.pravatar.cc/300?img=${(i % 70) + 1}`,
    );
    photosRef.current = placeholders;
    return placeholders;
  }, [photos]);

  useEffect(() => {
    const updateCols = () => {
      const viewportWidth =
        typeof window !== "undefined" ? window.innerWidth : 0;
      if (viewportWidth) {
        const needed = Math.ceil(viewportWidth / cellSize) + 2;
        setDynamicCols(needed);
      }
    };
    updateCols();
    window.addEventListener("resize", updateCols);
    return () => window.removeEventListener("resize", updateCols);
  }, [cellSize]);

  useEffect(() => {
    const availablePhotos =
      photos.length > 0
        ? photos
        : [
            "https://i.pravatar.cc/300?img=1",
            "https://i.pravatar.cc/300?img=2",
            "https://i.pravatar.cc/300?img=3",
            "https://i.pravatar.cc/300?img=4",
            "https://i.pravatar.cc/300?img=5",
            "https://i.pravatar.cc/300?img=6",
            "https://i.pravatar.cc/300?img=7",
            "https://i.pravatar.cc/300?img=8",
          ];

    if (!photosRef.current.length) return;

    const timers: NodeJS.Timeout[] = [];

    const createStar = () => {
      const currentPhotos = photosRef.current;
      if (!currentPhotos.length) return;

      const row = Math.floor(Math.random() * rows);
      const col = Math.floor(Math.random() * dynamicCols);
      const photoUrl =
        currentPhotos[Math.floor(Math.random() * currentPhotos.length)];

      const newStar: ActiveCell = {
        row,
        col,
        photoUrl,
        opacity: 0,
        fadeIn: true,
      };

      setActiveCells((prev) => {
        const existingCell = prev.find(
          (cell) => cell.row === row && cell.col === col,
        );
        if (existingCell) return prev;

        return [...prev, newStar];
      });

      setTimeout(() => {
        setActiveCells((prev) =>
          prev.map((cell) =>
            cell.row === row && cell.col === col
              ? { ...cell, opacity: 1 }
              : cell,
          ),
        );
      }, 50);

      const fadeOutTime = Math.random() * 2000 + 2000;
      setTimeout(() => {
        setActiveCells((prev) =>
          prev.map((cell) =>
            cell.row === row && cell.col === col
              ? { ...cell, fadeIn: false, opacity: 0 }
              : cell,
          ),
        );

        setTimeout(() => {
          setActiveCells((prev) =>
            prev.filter((cell) => !(cell.row === row && cell.col === col)),
          );
        }, 500);
      }, fadeOutTime);
    };

    const scheduleNextStar = () => {
      const delay = Math.random() * 1500 + 500;
      const timer = setTimeout(() => {
        createStar();
        scheduleNextStar();
      }, delay);
      timers.push(timer);
    };

    scheduleNextStar();

    return () => {
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, [rows, dynamicCols, photos.length]);

  return (
    <div
      ref={ref}
      className={cn(
        "absolute inset-0 h-full w-full",
        "[--cell-border-color:var(--color-neutral-300)] [--cell-fill-color:var(--color-neutral-100)] [--cell-shadow-color:var(--color-neutral-500)]",
        "  ",
        className,
      )}
    >
      <div className="relative h-auto w-auto overflow-hidden">
        <div className="pointer-events-none absolute inset-0 z-[2] h-full w-full overflow-hidden" />
        <DivGrid
          key={`base-${rippleKey}`}
          className="mask-radial-from-20% mask-radial-at-top opacity-600"
          rows={rows}
          cols={dynamicCols}
          cellSize={cellSize}
          borderColor="var(--cell-border-color)"
          fillColor="var(--cell-fill-color)"
          clickedCell={clickedCell}
          activeCells={activeCells}
          onCellClick={(row, col) => {
            setClickedCell({ row, col });
            setRippleKey((k) => k + 1);
          }}
          interactive
        />
      </div>
    </div>
  );
};

type DivGridProps = {
  className?: string;
  rows: number;
  cols: number;
  cellSize: number;
  borderColor: string;
  fillColor: string;
  clickedCell: { row: number; col: number } | null;
  activeCells: ActiveCell[];
  onCellClick?: (row: number, col: number) => void;
  interactive?: boolean;
};

type CellStyle = React.CSSProperties & {
  ["--delay"]?: string;
  ["--duration"]?: string;
};

const DivGrid = ({
  className,
  rows = 7,
  cols = 30,
  cellSize = 56,
  borderColor = "#3f3f46",
  fillColor = "rgba(14,165,233,0.3)",
  clickedCell = null,
  activeCells = [],
  onCellClick = () => {},
  interactive = true,
}: DivGridProps) => {
  const cells = useMemo(
    () => Array.from({ length: rows * cols }, (_, idx) => idx),
    [rows, cols],
  );

  const gridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
    gridTemplateRows: `repeat(${rows}, ${cellSize}px)`,
    width: `calc(${cols} * ${cellSize}px)`,
    height: rows * cellSize,
  };

  return (
    <div
      className={cn("relative z-[3] w-[100vw] max-w-none", className)}
      style={gridStyle}
    >
      {cells.map((idx) => {
        const rowIdx = Math.floor(idx / cols);
        const colIdx = idx % cols;
        const distance = clickedCell
          ? Math.hypot(clickedCell.row - rowIdx, clickedCell.col - colIdx)
          : 0;
        const delay = clickedCell ? Math.max(0, distance * 55) : 0;
        const duration = 200 + distance * 80;

        const activeCell = activeCells.find(
          (cell) => cell.row === rowIdx && cell.col === colIdx,
        );

        const style: CellStyle = clickedCell
          ? {
              "--delay": `${delay}ms`,
              "--duration": `${duration}ms`,
            }
          : {};

        return (
          <div
            key={idx}
            className={cn(
              "cell relative border-[0.5px] opacity-40 transition-opacity duration-150 will-change-transform hover:opacity-80  overflow-hidden",
              clickedCell && "animate-cell-ripple [animation-fill-mode:none]",
              !interactive && "pointer-events-none",
            )}
            style={{
              backgroundColor: activeCell ? "transparent" : fillColor,
              borderColor: borderColor,
              ...style,
            }}
            onClick={
              interactive ? () => onCellClick?.(rowIdx, colIdx) : undefined
            }
          >
            {activeCell && (
              <div
                className="absolute inset-0 transition-opacity duration-500 ease-in-out"
                style={{ opacity: activeCell.opacity }}
              >
                <Image
                  src={activeCell.photoUrl}
                  alt="Pessoa desaparecida"
                  fill
                  className="object-cover"
                  sizes="42px"
                  unoptimized
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
