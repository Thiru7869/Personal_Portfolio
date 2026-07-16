"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { RotateCcw } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

/**
 * Game2048 — dependency-free 2048 with a developer skin: tiles are
 * byte sizes (2B → 4B → … → 1KB → 2KB), because doubling is what
 * bytes do. Arrow keys / WASD on desktop, swipe on touch. Best
 * score persists to localStorage. Works inline, in a dialog, or as
 * a Terminal-mode window. Movement is transform-only CSS; the
 * global reduced-motion rules make it instant for those users.
 */

const SIZE = 4;
const BEST_KEY = "thiru-2048-best";

interface Tile {
  id: number;
  value: number;
  row: number;
  col: number;
  /** Just spawned — pops in. */
  isNew?: boolean;
  /** Just merged — pulses. */
  bump?: boolean;
}

type Dir = "up" | "down" | "left" | "right";

let nextId = 1;

function emptyCells(tiles: Tile[]): { row: number; col: number }[] {
  const taken = new Set(tiles.map((t) => `${t.row},${t.col}`));
  const cells: { row: number; col: number }[] = [];
  for (let r = 0; r < SIZE; r++)
    for (let c = 0; c < SIZE; c++)
      if (!taken.has(`${r},${c}`)) cells.push({ row: r, col: c });
  return cells;
}

function spawnTile(tiles: Tile[]): Tile[] {
  const cells = emptyCells(tiles);
  if (cells.length === 0) return tiles;
  const cell = cells[Math.floor(Math.random() * cells.length)];
  return [
    ...tiles,
    {
      id: nextId++,
      value: Math.random() < 0.9 ? 2 : 4,
      row: cell.row,
      col: cell.col,
      isNew: true,
    },
  ];
}

function newGame(): Tile[] {
  return spawnTile(spawnTile([]));
}

/** Slide + merge every line toward `dir`. Classic rules: each tile
 *  merges at most once per move. */
function move(tiles: Tile[], dir: Dir): { tiles: Tile[]; gained: number; moved: boolean } {
  const horizontal = dir === "left" || dir === "right";
  const reverse = dir === "right" || dir === "down";
  const out: Tile[] = [];
  let gained = 0;
  let moved = false;

  for (let lineIdx = 0; lineIdx < SIZE; lineIdx++) {
    const line = tiles
      .filter((t) => (horizontal ? t.row : t.col) === lineIdx)
      .sort((a, b) => (horizontal ? a.col - b.col : a.row - b.row));
    if (reverse) line.reverse();

    let pos = 0;
    let prev: Tile | null = null;
    for (const t of line) {
      if (prev && prev.value === t.value && !prev.bump) {
        // Merge into the previously placed tile.
        prev.value *= 2;
        prev.bump = true;
        gained += prev.value;
        moved = true;
        continue;
      }
      const coord = reverse ? SIZE - 1 - pos : pos;
      const placed: Tile = {
        id: t.id,
        value: t.value,
        row: horizontal ? lineIdx : coord,
        col: horizontal ? coord : lineIdx,
      };
      if (placed.row !== t.row || placed.col !== t.col) moved = true;
      out.push(placed);
      prev = placed;
      pos++;
    }
  }

  return { tiles: out, gained, moved };
}

function hasMoves(tiles: Tile[]): boolean {
  if (emptyCells(tiles).length > 0) return true;
  const grid = new Map(tiles.map((t) => [`${t.row},${t.col}`, t.value]));
  for (const t of tiles) {
    if (grid.get(`${t.row + 1},${t.col}`) === t.value) return true;
    if (grid.get(`${t.row},${t.col + 1}`) === t.value) return true;
  }
  return false;
}

/** Developer skin: 2 → "2B", 1024 → "1KB", 2048 → "2KB". */
function byteLabel(value: number): string {
  return value >= 1024 ? `${value / 1024}KB` : `${value}B`;
}

const TILE_STYLE: Record<number, string> = {
  2: "bg-surface text-ink",
  4: "bg-line/70 text-ink",
  8: "bg-brand/25 text-ink",
  16: "bg-brand/40 text-ink",
  32: "bg-brand/60 text-bg",
  64: "bg-brand/80 text-bg",
  128: "bg-brand text-bg",
  256: "bg-brand2/60 text-bg",
  512: "bg-brand2/80 text-bg",
  1024: "bg-brand2 text-bg",
  2048: "bg-gradient-to-br from-brand to-brand2 text-bg shadow-glow",
};

export function Game2048({ className = "" }: { className?: string }) {
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [over, setOver] = useState(false);
  const [won, setWon] = useState(false);
  /** The win banner celebrates once — "Keep going" must not re-summon it. */
  const celebratedRef = useRef(false);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const boardRef = useRef<HTMLDivElement>(null);

  // Client-only init (random board would break SSR hydration).
  useEffect(() => {
    setTiles(newGame());
    try {
      setBest(Number(localStorage.getItem(BEST_KEY)) || 0);
    } catch {
      // storage unavailable
    }
    trackEvent({ type: "game_played" });
  }, []);

  const restart = useCallback(() => {
    setTiles(newGame());
    setScore(0);
    setOver(false);
    setWon(false);
    celebratedRef.current = false;
  }, []);

  const doMove = useCallback(
    (dir: Dir) => {
      if (over) return;
      setTiles((current) => {
        const result = move(current, dir);
        if (!result.moved) return current;
        const withSpawn = spawnTile(result.tiles);
        if (result.gained > 0) {
          setScore((s) => {
            const next = s + result.gained;
            setBest((b) => {
              const nb = Math.max(b, next);
              try {
                localStorage.setItem(BEST_KEY, String(nb));
              } catch {
                // ignore
              }
              return nb;
            });
            return next;
          });
        }
        if (!celebratedRef.current && withSpawn.some((t) => t.value >= 2048)) {
          celebratedRef.current = true;
          setWon(true);
        }
        if (!hasMoves(withSpawn)) setOver(true);
        return withSpawn;
      });
    },
    [over]
  );

  function onKeyDown(e: React.KeyboardEvent) {
    const dir: Dir | null =
      e.key === "ArrowUp" || e.key === "w"
        ? "up"
        : e.key === "ArrowDown" || e.key === "s"
          ? "down"
          : e.key === "ArrowLeft" || e.key === "a"
            ? "left"
            : e.key === "ArrowRight" || e.key === "d"
              ? "right"
              : null;
    if (!dir) return;
    e.preventDefault();
    doMove(dir);
  }

  function onTouchStart(e: React.TouchEvent) {
    const t = e.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY };
  }

  function onTouchEnd(e: React.TouchEvent) {
    const start = touchStart.current;
    touchStart.current = null;
    if (!start) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 24) return;
    doMove(
      Math.abs(dx) > Math.abs(dy)
        ? dx > 0
          ? "right"
          : "left"
        : dy > 0
          ? "down"
          : "up"
    );
  }

  return (
    <div className={cn("mx-auto w-full max-w-sm select-none", className)}>
      {/* Scoreboard */}
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex gap-2">
          <div className="rounded-lg border border-line/80 bg-surface/70 px-3 py-1.5 text-center">
            <p className="font-mono text-[9px] uppercase tracking-widest text-mute">score</p>
            <p className="font-mono text-sm font-bold text-ink">{score}</p>
          </div>
          <div className="rounded-lg border border-line/80 bg-surface/70 px-3 py-1.5 text-center">
            <p className="font-mono text-[9px] uppercase tracking-widest text-mute">best</p>
            <p className="font-mono text-sm font-bold text-brand">{best}</p>
          </div>
        </div>
        <button type="button" onClick={restart} className="btn-ghost !px-3 !py-2 text-xs">
          <RotateCcw size={13} aria-hidden="true" />
          Restart
        </button>
      </div>

      {/* Board */}
      <div
        ref={boardRef}
        role="application"
        aria-label="2048 — combine byte tiles to reach 2 kilobytes. Use arrow keys or swipe."
        tabIndex={0}
        onKeyDown={onKeyDown}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        style={{ touchAction: "none" }}
        className="relative aspect-square w-full rounded-2xl border border-line/80 bg-surface/60 p-1.5 outline-none focus-visible:ring-2 focus-visible:ring-brand/60"
      >
        {/* Grid wells */}
        <div className="grid h-full w-full grid-cols-4 grid-rows-4 gap-1.5" aria-hidden="true">
          {Array.from({ length: SIZE * SIZE }).map((_, i) => (
            <div key={i} className="rounded-lg bg-line/25" />
          ))}
        </div>

        {/* Tiles */}
        <div className="absolute inset-1.5" aria-hidden="true">
          {tiles.map((tile) => (
            <div
              key={tile.id}
              className="absolute left-0 top-0 h-1/4 w-1/4 transition-transform duration-150 ease-out"
              style={{ transform: `translate(${tile.col * 100}%, ${tile.row * 100}%)` }}
            >
              <div
                className={cn(
                  "absolute inset-[3px] flex items-center justify-center rounded-lg font-mono font-bold",
                  tile.value >= 1024 ? "text-sm" : "text-base",
                  TILE_STYLE[tile.value] ?? "bg-ink text-bg",
                  tile.isNew && "animate-morse-reveal",
                  tile.bump && "animate-morse-reveal"
                )}
              >
                {byteLabel(tile.value)}
              </div>
            </div>
          ))}
        </div>

        {/* End states */}
        {(over || won) && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 rounded-2xl bg-bg/85 p-4 text-center backdrop-blur-sm">
            <p className="font-display text-xl font-bold">
              {over ? "Stack overflow — no moves left." : "2KB reached. Legendary."}
            </p>
            <div className="flex gap-2">
              <button type="button" onClick={restart} className="btn-primary !py-2 text-xs">
                <RotateCcw size={13} aria-hidden="true" /> Play again
              </button>
              {won && !over && (
                <button
                  type="button"
                  onClick={() => setWon(false)}
                  className="btn-ghost !py-2 text-xs"
                >
                  Keep going
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      <p className="mt-2.5 text-center font-mono text-[11px] text-mute">
        arrows / wasd / swipe · merge bytes until 2KB
      </p>
    </div>
  );
}
