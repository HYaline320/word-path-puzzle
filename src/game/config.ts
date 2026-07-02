import type { DifficultyParams } from '../core/types';

export const DIFFICULTY_PRESETS: Record<string, DifficultyParams> = {
  easy: {
    boardSize: 5,
    targetRowCount: 3,
    minTargetLength: 2,
    maxTargetLength: 3,
    maxSteps: 6,
    startAnyRow: false,
    charset: 'ABCDEFGH'.split(''),
  },
  medium: {
    boardSize: 6,
    targetRowCount: 4,
    minTargetLength: 2,
    maxTargetLength: 4,
    maxSteps: 8,
    startAnyRow: false,
    charset: 'ABCDEFGHIJKLM'.split(''),
  },
  hard: {
    boardSize: 7,
    targetRowCount: 4,
    minTargetLength: 3,
    maxTargetLength: 5,
    maxSteps: 10,
    startAnyRow: true,
    charset: 'ABCDEFGHIJKLMNOP'.split(''),
  },
};