import { useState } from 'react';
import styles from './GameInstructions.module.css';

const GameInstructions: React.FC = () => {
  const [show, setShow] = useState(false);

  return (
    <div className={styles.container}>
      <button className={styles.toggle} onClick={() => setShow(!show)}>
        {show ? '收起玩法' : '显示玩法'}
      </button>
      {show && (
        <div className={styles.content}>
          <h4>游戏规则</h4>
          <ol>
            <li>从棋盘第一行（或任意行，根据设置）选择一个字符开始。</li>
            <li>之后交替在<strong>上一次选择的列</strong>或<strong>行</strong>中继续选择字符，每个格子只能使用一次。</li>
            <li>每次选择的字符会同时匹配右侧所有目标行<strong>当前待匹配字符</strong>，若相同则匹配进度+1。</li>
            <li>目标行全部字符匹配完毕即获胜；若某行剩余字符数大于剩余步数，则提前失败。</li>
            <li>最终步数不能超过设定的最大值（见答案数组下方进度条）。</li>
          </ol>
          <p><em>提示：善用悬停预览下一步可走区域，合理规划路径！</em></p>
        </div>
      )}
    </div>
  );
};

export default GameInstructions;