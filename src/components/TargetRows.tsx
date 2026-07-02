import type { GameState } from '../core/types';
import styles from './TargetRows.module.css';

interface TargetRowsProps {
  state: GameState;
}

const TargetRows: React.FC<TargetRowsProps> = ({ state }) => {
  // 计算每行已匹配字符数，取最大值
  const maxMatched = Math.max(...state.targetProgress, 0);

  return (
    <div className={styles.container}>
      {state.targets.map((row, i) => {
        const progress = state.targetProgress[i];
        const matched = row.slice(0, progress);
        const remaining = row.slice(progress);
        // 需要插入的占位空白数量，使得剩余字符从 maxMatched 列之后开始
        const spacerCount = maxMatched - progress;

        return (
          <div key={i} className={styles.row}>
            {/* 已匹配字符 */}
            {matched.map((ch, j) => (
              <span key={`m-${j}`} className={styles.matched}>{ch}</span>
            ))}
            {/* 占位空白 */}
            {Array.from({ length: spacerCount }).map((_, idx) => (
              <span key={`sp-${idx}`} className={styles.spacer} />
            ))}
            {/* 未匹配字符 */}
            {remaining.map((ch, j) => (
              <span key={`r-${j}`} className={styles.remainingChar}>{ch}</span>
            ))}
          </div>
        );
      })}
    </div>
  );
};

export default TargetRows;