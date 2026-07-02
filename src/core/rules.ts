import type { GameConfig, GameState, Move } from './types';

export function createInitialState(config: GameConfig): GameState {
  const board = config.board.map(row => [...row]);
  return {
    board,
    targets: config.targets,
    targetProgress: new Array(config.targets.length).fill(0),
    restriction: null,
    restrictedIndex: null,
    answers: [],
    answerChars: [],                // 新增
    stepsTaken: 0,
    maxSteps: config.maxSteps,
    status: 'playing',
  };
}

export function applyMove(state: GameState, move: Move): GameState | { error: string } {
  if (state.status !== 'playing') {
    return { error: '游戏已结束' };
  }

  // 首次移动前 restriction 为 null，视为可任意行，这里不限制
  if (state.restriction !== null) {
    if (state.restriction === 'row' && move.row !== state.restrictedIndex) {
      return { error: '必须选择指定行上的格子' };
    }
    if (state.restriction === 'col' && move.col !== state.restrictedIndex) {
      return { error: '必须选择指定列上的格子' };
    }
  }

  if (state.board[move.row][move.col] === null) {
    return { error: '该格子已被选择' };
  }

  const newBoard = state.board.map(row => [...row]);
  const char = newBoard[move.row][move.col]!;
  newBoard[move.row][move.col] = null;

  const newProgress = [...state.targetProgress];
  for (let i = 0; i < state.targets.length; i++) {
    if (newProgress[i] < state.targets[i].length) {
      if (state.targets[i][newProgress[i]] === char) {
        newProgress[i]++;
      }
    }
  }

  const newAnswers = [...state.answers, move];
  const newAnswerChars = [...state.answerChars, char];   // 新增
  const newStepsTaken = state.stepsTaken + 1;
  const newRestriction: 'row' | 'col' = state.restriction === 'row' ? 'col' : 'row';
  const newRestrictedIndex = state.restriction === 'row' ? move.col : move.row;

  let status: GameState['status'] = 'playing';
  let failReason: string | undefined;
  const allMatched = state.targets.every((t, i) => newProgress[i] === t.length);
  if (allMatched) {
    status = 'won';
  } else if (newStepsTaken >= state.maxSteps) {
    status = 'lost';
    failReason = '步数已用完';
  } else {
    const remainingSteps = state.maxSteps - newStepsTaken;
    for (let i = 0; i < state.targets.length; i++) {
      const remainChars = state.targets[i].length - newProgress[i];
      if (remainChars > remainingSteps) {
        status = 'lost';
        failReason = `无法完成：目标行 ${i} 剩余 ${remainChars} 字符，但只剩 ${remainingSteps} 步`;
        break;
      }
    }
  }

  return {
    board: newBoard,
    targets: state.targets,
    targetProgress: newProgress,
    restriction: newRestriction,
    restrictedIndex: newRestrictedIndex,
    answers: newAnswers,
    answerChars: newAnswerChars,
    stepsTaken: newStepsTaken,
    maxSteps: state.maxSteps,
    status,
    failReason,
  };
}