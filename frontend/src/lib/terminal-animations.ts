/**
 * src/lib/terminal-animations.ts
 * ------------------------------------------------------------
 * ASCII animations for the terminal (`matrix`, `donut`,
 * `train`, `clock`, `parrot`). Each returns frames rendered by
 * the shell on an interval. Pure functions — no DOM here.
 */

export type AnimationKind = "matrix" | "donut" | "train" | "clock" | "parrot";

export interface TerminalAnimation {
  /** Called each tick with the current frame's lines. */
  frame: (tick: number) => string[];
  intervalMs: number;
  /** Total ticks before the animation ends. */
  ticks: number;
  /** Line printed after the animation finishes. */
  outro: string;
}

const MATRIX_CHARS = "ｱｲｳｴｵｶｷｸｹｺﾊﾋﾌﾍﾎ0123456789ABCDEF#$%*+";

function matrixAnimation(cols: number, rows: number): TerminalAnimation {
  // Each column is a falling head position; trails render behind.
  const heads = Array.from({ length: cols }, () => Math.floor(Math.random() * rows * 2) - rows);
  const speeds = Array.from({ length: cols }, () => 1 + Math.floor(Math.random() * 2));
  return {
    intervalMs: 90,
    ticks: 45,
    outro: "The Matrix has you. (type 'mode terminal' for the full desktop)",
    frame: (tick) => {
      const grid: string[][] = Array.from({ length: rows }, () => Array(cols).fill(" "));
      for (let c = 0; c < cols; c++) {
        const head = (heads[c] + tick * speeds[c]) % (rows * 2);
        for (let trail = 0; trail < 6; trail++) {
          const r = head - trail;
          if (r >= 0 && r < rows) {
            grid[r][c] = MATRIX_CHARS[(c * 7 + r * 13 + tick) % MATRIX_CHARS.length];
          }
        }
      }
      return grid.map((row) => row.join(""));
    },
  };
}

function donutAnimation(): TerminalAnimation {
  // The classic donut.c, sized for a terminal window.
  const W = 56;
  const H = 22;
  return {
    intervalMs: 70,
    ticks: 60,
    outro: "donut.c — rendered live, no video involved.",
    frame: (tick) => {
      const A = tick * 0.09;
      const B = tick * 0.045;
      const b: string[] = Array(W * H).fill(" ");
      const z: number[] = Array(W * H).fill(0);
      const cA = Math.cos(A), sA = Math.sin(A);
      const cB = Math.cos(B), sB = Math.sin(B);
      for (let j = 0; j < 6.28; j += 0.09) {
        const ct = Math.cos(j), st = Math.sin(j);
        for (let i = 0; i < 6.28; i += 0.035) {
          const sp = Math.sin(i), cp = Math.cos(i);
          const h = ct + 2;
          const D = 1 / (sp * h * sA + st * cA + 5);
          const t = sp * h * cA - st * sA;
          const x = Math.floor(W / 2 + (W / 2.4) * D * (cp * h * cB - t * sB));
          const y = Math.floor(H / 2 + (H / 2.4) * 0.5 * D * (cp * h * sB + t * cB));
          const o = x + W * y;
          const N = Math.floor(
            8 * ((st * sA - sp * ct * cA) * cB - sp * ct * sA - st * cA - cp * ct * sB)
          );
          if (y >= 0 && y < H && x >= 0 && x < W && D > z[o]) {
            z[o] = D;
            b[o] = ".,-~:;=!*#$@"[Math.max(N, 0)];
          }
        }
      }
      const lines: string[] = [];
      for (let r = 0; r < H; r++) lines.push(b.slice(r * W, (r + 1) * W).join(""));
      return lines;
    },
  };
}

const TRAIN = [
  "      ====        ________                ___________",
  "  _D _|  |_______/        \\__I_I_____===__|_________|",
  "   |(_)---  |   H\\________/ |   |        =|___ ___|  ",
  "   /     |  |   H  |  |     |   |         ||_| |_||  ",
  "  |      |  |   H  |__--------------------| [___] |  ",
  "  | ________|___H__/__|_____/[][]~\\_______|       |  ",
  "  |/ |   |-----------I_____I [][] []  D   |=======|__",
  "__/ =| o |=-~~\\  /~~\\  /~~\\  /~~\\ ____Y___________|__",
  " |/-=|___|=    ||    ||    ||    |_____/~\\___/       ",
  "  \\_/      \\O=====O=====O=====O_/      \\_/           ",
];

function trainAnimation(width: number): TerminalAnimation {
  const trainWidth = TRAIN[0].length;
  const span = width + trainWidth;
  return {
    intervalMs: 60,
    ticks: Math.ceil(span / 3),
    outro: "sl: you have been visited by the Steam Locomotive.",
    frame: (tick) => {
      const offset = width - tick * 3;
      return TRAIN.map((line) => {
        if (offset >= 0) return " ".repeat(offset) + line;
        return line.slice(-offset).padEnd(width, " ").slice(0, width);
      });
    },
  };
}

const DIGITS: Record<string, string[]> = {
  "0": [" ██████ ", "██    ██", "██    ██", "██    ██", " ██████ "],
  "1": ["   ██   ", "  ███   ", "   ██   ", "   ██   ", " ██████ "],
  "2": [" ██████ ", "      ██", " ██████ ", "██      ", "████████"],
  "3": [" ██████ ", "      ██", "  █████ ", "      ██", " ██████ "],
  "4": ["██    ██", "██    ██", "████████", "      ██", "      ██"],
  "5": ["████████", "██      ", "███████ ", "      ██", "███████ "],
  "6": [" ██████ ", "██      ", "███████ ", "██    ██", " ██████ "],
  "7": ["████████", "     ██ ", "    ██  ", "   ██   ", "   ██   "],
  "8": [" ██████ ", "██    ██", " ██████ ", "██    ██", " ██████ "],
  "9": [" ██████ ", "██    ██", " ███████", "      ██", " ██████ "],
  ":": ["        ", "   ██   ", "        ", "   ██   ", "        "],
};

function clockAnimation(): TerminalAnimation {
  return {
    intervalMs: 1000,
    ticks: 8,
    outro: "Time flies. So should your resume — 'resume' opens it.",
    frame: () => {
      const now = new Date();
      const hh = String(now.getHours()).padStart(2, "0");
      const mm = String(now.getMinutes()).padStart(2, "0");
      const ss = String(now.getSeconds()).padStart(2, "0");
      const text = `${hh}:${mm}:${ss}`;
      const rows = ["", "", "", "", ""];
      for (const ch of text) {
        const glyph = DIGITS[ch];
        for (let r = 0; r < 5; r++) rows[r] += glyph[r] + " ";
      }
      return ["", ...rows, "", `        ${now.toDateString()}`];
    },
  };
}

const PARROT_FRAMES = [
  ["   .--.   ", "  ( o >   ", "  /  |    ", " /'--|    ", "   ^ ^    "],
  ["   .--.   ", "  < o )   ", "   |  \\   ", "   |--'\\  ", "    ^ ^   "],
  ["   .--.   ", "  ( o <   ", "   |  /   ", "   |-'/   ", "    ^ ^   "],
  ["   .--.   ", "  > o )   ", "  \\  |    ", " \\'--|    ", "   ^ ^    "],
];

function parrotAnimation(): TerminalAnimation {
  return {
    intervalMs: 160,
    ticks: 24,
    outro: "party parrot approves of this portfolio. 🦜",
    frame: (tick) => {
      const parrot = PARROT_FRAMES[tick % PARROT_FRAMES.length];
      const pad = " ".repeat(4 + Math.floor(3 * Math.abs(Math.sin(tick / 2))));
      return ["", ...parrot.map((l) => pad + l), "", "   PARTY PARROT MODE"];
    },
  };
}

export function createAnimation(
  kind: AnimationKind,
  width = 60,
  height = 16
): TerminalAnimation {
  switch (kind) {
    case "matrix":
      return matrixAnimation(Math.min(width, 70), Math.min(height, 18));
    case "donut":
      return donutAnimation();
    case "train":
      return trainAnimation(Math.min(width, 70));
    case "clock":
      return clockAnimation();
    case "parrot":
      return parrotAnimation();
  }
}
