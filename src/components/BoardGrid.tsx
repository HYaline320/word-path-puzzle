import type { GameState } from '../core/types';
import styles from './BoardGrid.module.css';

interface BoardGridProps {
  state: GameState;
  onCellClick: (row: number, col: number) => void;
  highlightCells?: Set<string>;
  lowlightCells?: Set<string>;
  onCellHover?: (row: number, col: number) => void;
  onCellLeave?: () => void;
  hoveredCell?: string | null;
}

const BoardGrid: React.FC<BoardGridProps> = ({
  state,
  onCellClick,
  highlightCells,
  lowlightCells,
  onCellHover,
  onCellLeave,
  hoveredCell,
}) => {
  const size = state.board.length;

  return (
    <div className={styles.grid} style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}>
      {state.board.map((row, r) =>
        row.map((cell, c) => {
          const key = `${r}-${c}`;
          const isSelected = cell === null;
          const isHighlight = highlightCells?.has(key);
          const isLowlight = lowlightCells?.has(key);
          const isHovered = hoveredCell === key;

          let className = styles.cell;
          if (isSelected) className += ' ' + styles.selected;
          else if (isHighlight) className += ' ' + styles.highlight;
          else if (isLowlight) className += ' ' + styles.lowlight;
          if (isHovered) className += ' ' + styles.hovered;

          return (
            <div
              key={key}
              className={className}
              onClick={() => !isSelected && onCellClick(r, c)}
              onMouseEnter={() => onCellHover?.(r, c)}
              onMouseLeave={() => onCellLeave?.()}
            >
              {cell}
            </div>
          );
        })
      )}
    </div>
  );
};

export default BoardGrid;