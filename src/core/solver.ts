import type { GameConfig, GameState, Move } from './types';
import { createInitialState, applyMove } from './rules';

function cloneState(state: GameState): GameState {
  return {
    ...state,
    board: state.board.map(row => [...row]),
    targetProgress: [...state.targetProgress],
    answers: [...state.answers],
    answerChars: [...state.answerChars],
  };
}

function heuristic(state: GameState): number {
  return state.targets.reduce((acc, t, i) => acc + (t.length - state.targetProgress[i]), 0);
}

export function solve(config: GameConfig): Move[] | null {
  const initialState = createInitialState(config);
  const startRows = config.startRowConstraint !== undefined
    ? [config.startRowConstraint]
    : Array.from({ length: config.boardSize }, (_, i) => i);

  for (const startRow of startRows) {
    const state = cloneState(initialState);
    state.restriction = 'row';
    state.restrictedIndex = startRow;

    const result = dfs(state);
    if (result) return result;
  }
  return null;

  function dfs(state: GameState): Move[] | null {
    if (state.status === 'won') return [];
    if (state.status === 'lost') return null;

    const remainingSteps = state.maxSteps - state.stepsTaken;
    if (heuristic(state) > remainingSteps) return null;

    const candidates: Move[] = [];
    if (state.restriction === 'row') {
      for (let c = 0; c < state.board.length; c++) {
        if (state.board[state.restrictedIndex!][c] !== null) {
          candidates.push({ row: state.restrictedIndex!, col: c });
        }
      }
    } else {
      for (let r = 0; r < state.board.length; r++) {
        if (state.board[r][state.restrictedIndex!] !== null) {
          candidates.push({ row: r, col: state.restrictedIndex! });
        }
      }
    }

    candidates.sort((a, b) => {
      const charA = state.board[a.row][a.col]!;
      const charB = state.board[b.row][b.col]!;
      const matchA = state.targets.reduce(
        (count, t, i) => count + (state.targetProgress[i] < t.length && t[state.targetProgress[i]] === charA ? 1 : 0), 0);
      const matchB = state.targets.reduce(
        (count, t, i) => count + (state.targetProgress[i] < t.length && t[state.targetProgress[i]] === charB ? 1 : 0), 0);
      return matchB - matchA;
    });

    for (const move of candidates) {
      const result = applyMove(state, move);
      if ('error' in result) continue;
      const nextState = result as GameState;
      const path = dfs(nextState);
      if (path) return [move, ...path];
    }
    return null;
  }
}

export function getHint(config: GameConfig, currentState?: GameState): Move | null {
  const solution = solve(config);
  if (!solution || solution.length === 0) return null;
  if (!currentState || currentState.answers.length === 0) return solution[0];
  const stepsTaken = currentState.answers.length;
  if (stepsTaken < solution.length) return solution[stepsTaken];
  return null;
}