import { useMemo, useState } from 'react';
import { useGame } from './game/useGame';
import BoardGrid from './components/BoardGrid';
import TargetRows from './components/TargetRows';
import AnswerBar from './components/AnswerBar';
import ControlPanel from './components/ControlPanel';
import Settings from './components/Settings';
import GameInstructions from './components/GameInstructions';
import type { Restriction, DifficultyParams } from './core/types';
import { DIFFICULTY_PRESETS } from './game/config';
import styles from './App.module.css';

function App() {
  const [params, setParams] = useState<DifficultyParams>(DIFFICULTY_PRESETS.easy);
  const { state, selectCell, hint, reset, newGame } = useGame(params);
  const [showSettings, setShowSettings] = useState(false);
  const [hoveredCell, setHoveredCell] = useState<string | null>(null);

  const handleApplySettings = (newParams: DifficultyParams) => {
    setParams(newParams);
    newGame(newParams);
    setShowSettings(false);
  };

  const handleNewGame = () => {
    setShowSettings(true);
  };

  const highlightCells = useMemo(() => {
    const set = new Set<string>();
    if (state.status !== 'playing' || state.restriction === null) return set;
    const { restriction, restrictedIndex, board } = state;
    if (restriction === 'row') {
      for (let c = 0; c < board.length; c++) {
        if (board[restrictedIndex!][c] !== null) set.add(`${restrictedIndex}-${c}`);
      }
    } else {
      for (let r = 0; r < board.length; r++) {
        if (board[r][restrictedIndex!] !== null) set.add(`${r}-${restrictedIndex}`);
      }
    }
    return set;
  }, [state]);

  const lowlightCells = useMemo(() => {
    const set = new Set<string>();
    if (!hoveredCell || !highlightCells.has(hoveredCell)) return set;
    const [r, c] = hoveredCell.split('-').map(Number);
    const { restriction, board } = state;
    const nextRestriction: Restriction = restriction === 'row' ? 'col' : 'row';
    const nextIndex = restriction === 'row' ? c : r;
    if (nextRestriction === 'row') {
      for (let col = 0; col < board.length; col++) {
        if (board[nextIndex][col] !== null && !highlightCells.has(`${nextIndex}-${col}`)) {
          set.add(`${nextIndex}-${col}`);
        }
      }
    } else {
      for (let row = 0; row < board.length; row++) {
        if (board[row][nextIndex] !== null && !highlightCells.has(`${row}-${nextIndex}`)) {
          set.add(`${row}-${nextIndex}`);
        }
      }
    }
    return set;
  }, [hoveredCell, highlightCells, state]);

  const handleHint = () => {
    const move = hint();
    if (move) {
      // 将提示坐标存入临时状态，让 BoardGrid 高亮（或闪烁）
      setHoveredCell(`${move.row}-${move.col}`);
      // 3秒后清除提示高亮
      setTimeout(() => setHoveredCell(null), 3000);
    } else {
      alert('无可用提示');
    }
  };

  return (
    <div className={styles.app}>
      <h1 className={styles.title}>Word Path Puzzle</h1>

      <GameInstructions />

      <div className={styles.gameLayout}>
        {/* 左侧棋盘 */}
        <div className={styles.boardSection}>
          <BoardGrid
            state={state}
            onCellClick={(r, c) => {
              const err = selectCell(r, c);
              if (err) alert(err);
            }}
            highlightCells={highlightCells}
            lowlightCells={lowlightCells}
            onCellHover={(r, c) => setHoveredCell(`${r}-${c}`)}
            onCellLeave={() => setHoveredCell(null)}
            hoveredCell={hoveredCell}
          />
        </div>

        {/* 右侧面板 */}
        <div className={styles.rightPanel}>
          <div className={styles.targetSection}>
            <h3>目标字符</h3>
            <TargetRows state={state} />
          </div>
          <div className={styles.answerSection}>
            <h3>答案数组</h3>
            <AnswerBar state={state} />
          </div>
          <div className={styles.controls}>
            <ControlPanel
              onHint={handleHint}
              onReset={reset}
              onNewGame={handleNewGame}
              status={state.status}
            />
          </div>
          {state.status !== 'playing' && (
            <div className={styles.statusMessage}>
              {state.status === 'won' ? '🎉 恭喜通关！' : `❌ 失败：${state.failReason}`}
            </div>
          )}
        </div>
      </div>

      {showSettings && (
        <Settings
          onApply={handleApplySettings}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
}

export default App;