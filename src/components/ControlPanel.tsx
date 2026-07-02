import styles from './ControlPanel.module.css';

interface ControlPanelProps {
  onHint: () => void;
  onReset: () => void;
  onNewGame: () => void;
  status: string;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ onHint, onReset, onNewGame, status }) => {
  return (
    <div className={styles.panel}>
      <button onClick={onHint} disabled={status !== 'playing'}>提示</button>
      <button onClick={onReset}>重试本局</button>
      <button onClick={onNewGame}>新游戏</button>
    </div>
  );
};

export default ControlPanel;