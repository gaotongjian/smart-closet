# CLAUDE.md

本文件为 Claude Code (claude.ai/code) 在本项目中工作时提供指导。

## 项目概览

SmartCloset（智简衣橱）- 基于 uni-app 的衣橱管理小程序，支持 H5 端。

## 命令

```bash
# 开发
npm run dev:h5        # 启动 H5 开发服务器（端口 3000）
npm run dev:mp-weixin # 启动微信小程序开发服务器

# 构建
npm run build:h5        # 构建 H5 版本
npm run build:mp-weixin # 构建微信小程序

# 测试
npm test           # 运行所有测试（vitest）
npm run test:watch # 监听模式运行测试
```

## 架构

### 技术栈
- **框架**: uni-app + Vue 3（Composition API）
- **状态管理**: Pinia
- **样式**: SCSS 全局变量
- **测试**: vitest + jsdom
- **构建**: Vite

### 目录结构

```
src/
├── pages/           # 页面组件
│   ├── index/      # 首页（今日穿搭）
│   ├── wardrobe/  # 衣橱管理
│   ├── outfits/   # 搭配管理
│   └── profile/   # 个人中心
├── components/     # 公共组件
│   ├── weather-widget/
│   └── category-filter/
├── stores/         # Pinia 状态管理
│   ├── wardrobe.js   # 衣橱数据与操作
│   ├── outfit.js     # 搭配数据与操作
│   ├── weather.js    # 天气数据（Mock API）
│   └── user.js       # 用户数据
├── services/      # 业务逻辑层
│   ├── api.js        # 基础 API 客户端
│   ├── upload.js     # 图片上传
│   ├── tagService.js # 智能标签推荐
│   └── wardrobeService.js # 衣橱 CRUD 操作
└── uni.scss       # 全局 SCSS 变量与混合宏
```

### 关键模式

**Vue Composition API**: 使用 `<script setup>`，其中 `ref`、`computed` 从 `vue` 导入。uni-app 生命周期钩子（`onLoad`）从 `@dcloudio/uni-app` 导入。

**SCSS 变量**: 所有样式变量在 `src/uni.scss` 中定义。通过 vite.config.js 全局注入 - 无需在组件中手动导入。

**Pinia Stores**: 每个领域在 `src/stores/` 中有对应的 store。使用 Composition API 语法编写。

**数据流**: 页面 → Services → Stores → LocalStorage（uni.getStorageSync）

## 开发工作流

### Ralph Loop（AI 配对编程）

Ralph Loop 实现了一种基于连续 AI 循环的迭代开发方法论。

**核心概念：**
```bash
while :; do
  cat PROMPT.md | claude-code --continue
done
```

相同的提示词会被重复发送给 Claude。每次迭代都能看到文件中之前的改动和 git 历史。

**可用命令：**
```bash
/ralph-loop "<任务>" --max-iterations 20           # 启动 Ralph Loop，设置最大迭代次数
/ralph-loop "<任务>" --completion-promise "完成"   # 循环直到检测到承诺语句
/cancel-ralph                                        # 取消活跃的循环
/ralph-loop help                                     # 显示帮助
```

**工作原理：**
1. 使用 `/ralph-loop "任务描述" --completion-promise "完成"` 启动
2. Claude 执行任务
3. 当尝试退出时，stop hook 会拦截
4. 相同的提示词再次发送 - Claude 能看到之前的工作
5. 持续迭代直到检测到 `<promise>完成</promise>`

**完成信号：**
要结束 Ralph Loop，输出：
```
<promise>任务完成</promise>
```

**Ralph Loop 工作流：**
```
1. /ralph-loop "添加用户资料功能" --completion-promise "完成"
2. 先写测试（TDD 模式）
3. 实现功能
4. 运行测试验证
5. 功能完成后输出 <promise>完成</promise>
```

**适用场景：**
- ✅ 目标明确的任务，有清晰的完成标准
- ✅ 需要迭代和打磨的任务
- ✅ 支持自纠正的迭代开发
- ❌ 需要人工判断或设计决策的任务
- ❌ 一次性操作

### Git Worktree（并行开发）

用于在隔离环境中开发功能，不影响主代码库：

```bash
# 为功能开发创建新的 worktree
git worktree add ../smart-closet-feature -b feature/your-feature-name

# 列出所有 worktree
git worktree list

# 合并后移除 worktree
git worktree remove ../smart-closet-feature
```

**Worktree 工作流：**
1. 创建 worktree：`git worktree add ../smart-closet-feature -b feature/xxx`
2. 进入目录：`cd ../smart-closet-feature`
3. 隔离开发测试
4. 提交更改
5. 合并或 PR 回 main
6. 清理：`git worktree remove ../smart-closet-feature`

**Skill 调用模式：**
```
1. Brainstorming → Writing Plans → Executing Plans → Finishing
2. 每个任务：TDD → 实现 → 代码审查 → 提交
```

## 重要说明

- 应用使用本地存储（`uni.getStorageSync`）持久化数据，暂无真实后端
- 天气数据使用 `stores/weather.js` 中的 Mock API
- 测试文件在 `tests/` 目录，结构与 `src/` 对应
- SASS 除法警告（`/`）是已知问题，不影响功能
