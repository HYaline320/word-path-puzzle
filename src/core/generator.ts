import type { DifficultyParams, GameConfig, Move } from './types';

function randomChar(charset: string[]): string {
  return charset[Math.floor(Math.random() * charset.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generatePath(n: number, len: number, startRow?: number): { path: Move[]; success: boolean } {
  const path: Move[] = [];
  const used: boolean[][] = Array.from({ length: n }, () => Array(n).fill(false));
  let restriction: 'row' | 'col' = 'row';
  let restrictedIndex: number;

  if (startRow !== undefined) {
    restrictedIndex = startRow;
  } else {
    restrictedIndex = randomInt(0, n - 1);
  }

  for (let step = 0; step < len; step++) {
    const candidates: [number, number][] = [];
    if (restriction === 'row') {
      for (let c = 0; c < n; c++) {
        if (!used[restrictedIndex][c]) candidates.push([restrictedIndex, c]);
      }
    } else {
      for (let r = 0; r < n; r++) {
        if (!used[r][restrictedIndex]) candidates.push([r, restrictedIndex]);
      }
    }
    if (candidates.length === 0) return { path: [], success: false };

    const [r, c] = candidates[Math.floor(Math.random() * candidates.length)];
    path.push({ row: r, col: c });
    used[r][c] = true;
    restriction = restriction === 'row' ? 'col' : 'row';
    restrictedIndex = restriction === 'row' ? r : c;
  }
  return { path, success: true };
}

export function generatePuzzle(params: DifficultyParams): { config: GameConfig } {
  const { boardSize: n, targetRowCount, minTargetLength, maxTargetLength, maxSteps, startAnyRow, charset } = params;

  // 1. 生成目标矩阵
  const targets: string[][] = [];
  let totalChars = 0;
  for (let i = 0; i < targetRowCount; i++) {
    const len = randomInt(minTargetLength, maxTargetLength);
    const row: string[] = [];
    for (let j = 0; j < len; j++) {
      row.push(randomChar(charset));
    }
    targets.push(row);
    totalChars += len;
  }

  // 2. 构造路径
  const pathLen = Math.min(maxSteps, totalChars + randomInt(0, maxSteps - totalChars));
  const startRow = startAnyRow ? undefined : 0;
  let pathResult = generatePath(n, pathLen, startRow);
  let attempts = 0;
  while (!pathResult.success && attempts < 100) {
    pathResult = generatePath(n, pathLen, startRow);
    attempts++;
  }
  if (!pathResult.success) {
    pathResult = generatePath(n, totalChars, startRow);
    if (!pathResult.success) throw new Error('无法生成有效路径');
  }
  const path = pathResult.path;

  // 3. 分配目标字符
  const rowIndices = new Array(targets.length).fill(0);
  const stepChars: (string | null)[] = new Array(path.length).fill(null);
  for (let step = 0; step < path.length; step++) {
    const currentChars = new Set<string>();
    const rowsToAdvance: number[] = [];
    for (let i = 0; i < targets.length; i++) {
      if (rowIndices[i] < targets[i].length) {
        currentChars.add(targets[i][rowIndices[i]]);
        rowsToAdvance.push(i);
      }
    }
    if (currentChars.size === 0) {
      stepChars[step] = randomChar(charset);
      continue;
    }
    const charsArr = Array.from(currentChars);
    const chosenChar = charsArr[Math.floor(Math.random() * charsArr.length)];
    stepChars[step] = chosenChar;
    for (const i of rowsToAdvance) {
      if (targets[i][rowIndices[i]] === chosenChar) {
        rowIndices[i]++;
      }
    }
  }

  const allDone = rowIndices.every((idx, i) => idx === targets[i].length);
  if (!allDone) return generatePuzzle(params);

  // 4. 构建 board
  const board: string[][] = Array.from({ length: n }, () => Array(n).fill(''));
  path.forEach((move, idx) => {
    board[move.row][move.col] = stepChars[idx]!;
  });
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      if (board[r][c] === '') {
        board[r][c] = randomChar(charset);
      }
    }
  }

  return {
    config: {
      boardSize: n,
      board,
      targets,
      maxSteps,
      startRowConstraint: startRow,
    },
  };
}