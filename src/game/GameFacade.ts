import { createInitialState, applyMove } from '../core/rules';
import { generatePuzzle } from '../core/generator';
import { getHint } from '../core/solver';
import type { GameConfig, GameState, DifficultyParams, Move } from '../core/types';

export class GameFacade {
  state: GameState;
  config: GameConfig;

  constructor(config: GameConfig) {
    this.config = config;
    this.state = createInitialState(config);
  }

  selectCell(row: number, col: number) {
    const result = applyMove(this.state, { row, col });
    if ('error' in result) {
      return result.error;
    }
    this.state = result;
    return null;
  }

  getHintMove(): Move | null {
    return getHint(this.config, this.state);
  }

  reset() {
    this.state = createInitialState(this.config);
  }

  static generateNew(difficulty: DifficultyParams): GameFacade {
    const puzzle = generatePuzzle(difficulty);
    return new GameFacade(puzzle.config);
  }
}