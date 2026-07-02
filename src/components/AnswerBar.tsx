import type { GameState } from '../core/types';
import styles from './AnswerBar.module.css';

interface AnswerBarProps {
  state: GameState;
}

const AnswerBar: React.FC<AnswerBarProps> = ({ state }) => {
  const max = state.maxSteps;
  const current = state.answerChars.length;
  const progressPercent = Math.min((current / max) * 100, 100);

  return (
    <div className={styles.container}>
      <div className={styles.bar}>
        {state.answerChars.map((ch, i) => (
          <span key={i} className={styles.char}>{ch}</span>
        ))}
      </div>
      <div className={styles.progressInfo}>
        <div className={styles.progressBarBg}>
          <div
            className={styles.progressBarFill}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <span className={styles.stepsText}>{current} / {max} 步</span>
      </div>
    </div>
  );
};

export default AnswerBar;