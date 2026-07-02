import { describe, it, expect } from 'vitest';
import { createInitialState, applyMove } from '../rules';
import type { GameConfig } from '../types';

const testConfig: GameConfig = {
  boardSize: 3,
  board: [
    ['A', 'B', 'C'],
    ['D', 'E', 'F'],
    ['G', 'H', 'I'],
  ],
  targets: [['A', 'B'], ['D']],
  maxSteps: 5,
  startRowConstraint: 0,
};

describe('rules', () => {
  it('should allow first move on start row', () => {
    const state = createInitialState(testConfig);
    const stateReady = { ...state, restriction: 'row' as const, restrictedIndex: 0 };
    const result = applyMove(stateReady, { row: 0, col: 0 });
    expect(result).not.toHaveProperty('error');
  });

  it('should reject move on wrong row', () => {
    const stateReady = { ...createInitialState(testConfig), restriction: 'row' as const, restrictedIndex: 0 };
    const result = applyMove(stateReady, { row: 1, col: 0 });
    expect(result).toHaveProperty('error');
  });
});