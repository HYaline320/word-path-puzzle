import { useState, useCallback, useRef } from 'react';
import { GameFacade } from './GameFacade';
import type { GameState } from '../core/types';
import type { DifficultyParams } from '../core/types';

export function useGame(initialParams: DifficultyParams) {
  const facadeRef = useRef<GameFacade>(GameFacade.generateNew(initialParams));
  const [state, setState] = useState<GameState>(facadeRef.current.state);

  const selectCell = useCallback((row: number, col: number) => {
    const error = facadeRef.current.selectCell(row, col);
    setState({ ...facadeRef.current.state });
    return error;
  }, []);

  const hint = useCallback(() => {
    return facadeRef.current.getHintMove();
  }, []);

  const reset = useCallback(() => {
    facadeRef.current.reset();
    setState({ ...facadeRef.current.state });
  }, []);

  const newGame = useCallback((params: DifficultyParams) => {
    facadeRef.current = GameFacade.generateNew(params);
    setState({ ...facadeRef.current.state });
  }, []);

  return { state, selectCell, hint, reset, newGame };
}