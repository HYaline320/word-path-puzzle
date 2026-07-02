export interface DifficultyParams {
  boardSize: number;
  targetRowCount: number;
  minTargetLength: number;
  maxTargetLength: number;
  maxSteps: number;
  startAnyRow: boolean;
  charset: string[];
}

export interface GameConfig {
  boardSize: number;
  board: string[][];
  targets: string[][];
  maxSteps: number;
  startRowConstraint?: number;
}

export interface Move {
  row: number;
  col: number;
}

export type Restriction = 'row' | 'col';

export interface GameState {
  board: (string | null)[][];
  targets: string[][];
  targetProgress: number[];
  restriction: Restriction | null;
  restrictedIndex: number | null;
  answers: Move[];
  answerChars: string[];      
  stepsTaken: number;
  maxSteps: number;
  status: 'playing' | 'won' | 'lost';
  failReason?: string;
}