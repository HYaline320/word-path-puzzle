import { useState } from 'react';
import type { DifficultyParams } from '../core/types';
import { DIFFICULTY_PRESETS } from '../game/config';
import styles from './Settings.module.css';

interface SettingsProps {
  onApply: (params: DifficultyParams) => void;
  onClose: () => void;
}

const PRESET_KEYS = Object.keys(DIFFICULTY_PRESETS);

const Settings: React.FC<SettingsProps> = ({ onApply, onClose }) => {
  const [selectedPreset, setSelectedPreset] = useState<string>('easy');
  const [custom, setCustom] = useState<DifficultyParams>({ ...DIFFICULTY_PRESETS.easy });

  const applyPreset = (key: string) => {
    setSelectedPreset(key);
    setCustom({ ...DIFFICULTY_PRESETS[key] });
  };

  const updateCustom = (field: keyof DifficultyParams, value: any) => {
    setCustom(prev => ({ ...prev, [field]: value }));
  };

  const handleApply = () => {
    onApply(custom);
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.panel}>
        <h3>游戏设置</h3>
        <div className={styles.presets}>
          <label>难度预设：</label>
          <div className={styles.presetButtons}>
            {PRESET_KEYS.map(key => (
              <button
                key={key}
                className={selectedPreset === key ? styles.activePreset : ''}
                onClick={() => applyPreset(key)}
              >
                {key}
              </button>
            ))}
          </div>
        </div>
        <div className={styles.fields}>
          <label>
            矩阵大小 (n×n)：<input type="number" value={custom.boardSize} onChange={e => updateCustom('boardSize', +e.target.value)} min={3} max={9} />
          </label>
          <label>
            目标行数：<input type="number" value={custom.targetRowCount} onChange={e => updateCustom('targetRowCount', +e.target.value)} min={1} max={6} />
          </label>
          <label>
            最小目标长度：<input type="number" value={custom.minTargetLength} onChange={e => updateCustom('minTargetLength', +e.target.value)} min={1} max={9} />
          </label>
          <label>
            最大目标长度：<input type="number" value={custom.maxTargetLength} onChange={e => updateCustom('maxTargetLength', +e.target.value)} min={1} max={9} />
          </label>
          <label>
            最大步数：<input type="number" value={custom.maxSteps} onChange={e => updateCustom('maxSteps', +e.target.value)} min={1} max={20} />
          </label>
          <label className={styles.checkbox}>
            <input type="checkbox" checked={custom.startAnyRow} onChange={e => updateCustom('startAnyRow', e.target.checked)} />
            允许任意行开始
          </label>
        </div>
        <div className={styles.actions}>
          <button onClick={handleApply}>开始新游戏</button>
          <button onClick={onClose}>取消</button>
        </div>
      </div>
    </div>
  );
};

export default Settings;