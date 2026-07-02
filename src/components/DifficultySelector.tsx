import React from 'react';
import styles from './DifficultySelector.module.css';

interface DifficultySelectorProps {
  current: string;
  onSelect: (diff: string) => void;
}

const DIFFICULTIES = ['easy', 'medium', 'hard'];

const DifficultySelector: React.FC<DifficultySelectorProps> = ({ current, onSelect }) => {
  return (
    <div className={styles.container}>
      {DIFFICULTIES.map(d => (
        <button
          key={d}
          className={d === current ? styles.active : ''}
          onClick={() => onSelect(d)}
        >
          {d}
        </button>
      ))}
    </div>
  );
};

export default DifficultySelector;