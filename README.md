# Word Path Puzzle

受鸣潮活动游戏启发。

一个结合路径规划与多行序列匹配的益智解谜游戏。玩家在一个 n×n 字符矩阵中，按照“行→列→行→列”交替规则选择字符，同时匹配右侧多行目标序列，在限定步数内完成全部匹配即为胜利。

## 游戏规则

1. 从棋盘指定行（默认第一行）选择一个字符开始。
2. 之后交替在**上一次选择的列**或**行**的剩余格子中继续选择，每个格子只能使用一次。
3. 每次选择的字符会同时与所有目标行**当前待匹配字符**比较，若相同则匹配进度 +1。
4. 所有目标行全部匹配完毕即获胜；若某行剩余未匹配字符数 > 剩余步数，则提前失败。
5. 总步数不能超过设定的最大值。

## 功能特性

- **可定制难度**：可调整棋盘大小、目标行数及长度、最大步数、是否允许任意行开局，内置易/中/难三档预设。
- **智能提示**：内置求解器，可给出当前最优下一步（以高亮展示）。
- **交互辅助**：
  - 当前可选行列高亮（绿色）
  - 鼠标悬停时预览下一步的候选区域（浅绿色）
  - 已选格子不可再用（灰色）
  - 目标字符对齐显示，已匹配字符变色
- **步数限制可视化**：答案数组下方显示进度条和已用/上限步数。
- **重试与新局**：支持重试本局或通过设置面板生成全新谜题。
- **Docker 一键部署**

## 技术栈

- **前端框架**：React 18 + TypeScript
- **构建工具**：Vite
- **样式方案**：CSS Modules
- **核心逻辑**：纯 TypeScript（规则引擎、有解生成器、DFS 求解器）
- **测试**：Vitest + React Testing Library
- **部署**：Docker + Nginx

## 项目结构

word-path-puzzle/
├── public/ # 静态资源
├── src/
│ ├── core/ # 纯逻辑，无框架依赖
│ │ ├── types.ts # 核心类型定义
│ │ ├── rules.ts # 规则引擎（状态创建、动作应用）
│ │ ├── generator.ts # 保证有解的谜题生成器
│ │ ├── solver.ts # 求解器（完整解 & 提示）
│ │ └── tests/ # 单元测试
│ ├── game/ # 游戏门面与 React Hook
│ │ ├── GameFacade.ts
│ │ ├── useGame.ts
│ │ └── config.ts # 难度预设
│ ├── components/ # React UI 组件
│ │ ├── BoardGrid.tsx # 棋盘网格
│ │ ├── TargetRows.tsx # 目标行显示
│ │ ├── AnswerBar.tsx # 答案数组与步数进度
│ │ ├── ControlPanel.tsx # 控制按钮
│ │ ├── Settings.tsx # 难度设置面板
│ │ ├── GameInstructions.tsx # 玩法说明
│ │ └── *.module.css # 各自样式
│ ├── App.tsx # 主界面布局
│ ├── App.module.css
│ ├── main.tsx
│ └── index.css
├── Dockerfile
├── docker-compose.yml
├── nginx.conf
└── README.md


## 快速开始

### 本地开发

```bash
# 克隆仓库
git clone <your-repo-url>
cd word-path-puzzle

# 安装依赖
npm install

# 启动开发服务器
npm run dev