# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SmartCloset (智简衣橱) - A uni-app based wardrobe management mini-program with H5 support.

## Commands

```bash
# Development
npm run dev:h5        # Start H5 dev server (port 3000)
npm run dev:mp-weixin # Start WeChat mini-program dev server

# Build
npm run build:h5        # Build H5 version
npm run build:mp-weixin # Build WeChat mini-program

# Testing
npm test           # Run all tests (vitest)
npm run test:watch # Run tests in watch mode
```

## Architecture

### Tech Stack
- **Framework**: uni-app with Vue 3 (Composition API)
- **State Management**: Pinia
- **Styling**: SCSS with global variables
- **Testing**: vitest with jsdom
- **Build**: Vite

### Directory Structure

```
src/
├── pages/           # Page components
│   ├── index/      # Home page (今日穿搭)
│   ├── wardrobe/  # Wardrobe management (衣橱)
│   ├── outfits/   # Outfit management (搭配)
│   └── profile/   # User profile (我的)
├── components/     # Reusable components
│   ├── weather-widget/
│   └── category-filter/
├── stores/         # Pinia state stores
│   ├── wardrobe.js   # Wardrobe data & operations
│   ├── outfit.js     # Outfit data & operations
│   ├── weather.js    # Weather data with mock API
│   └── user.js       # User profile data
├── services/      # Business logic layer
│   ├── api.js        # Base API client
│   ├── upload.js     # Image upload
│   ├── tagService.js # Smart tag recommendations
│   └── wardrobeService.js # Wardrobe CRUD operations
└── uni.scss       # Global SCSS variables & mixins
```

### Key Patterns

**Vue Composition API**: Use `<script setup>` with `ref`, `computed` from `vue`. For uni-app lifecycle hooks (`onLoad`), import from `@dcloudio/uni-app`.

**SCSS Variables**: All style variables are in `src/uni.scss`. These are globally injected via vite.config.js - no need to import manually in components.

**Pinia Stores**: Each domain has a store in `src/stores/`. Use `defineStore` with Composition API syntax.

**Data Flow**: Pages → Services → Stores → LocalStorage (uni.getStorageSync)

## Development Workflow

### Ralph Loop (AI Pair Programming)

Ralph Loop implements the Ralph Wiggum technique - an iterative development methodology based on continuous AI loops.

**Core Concept:**
```bash
while :; do
  cat PROMPT.md | claude-code --continue
done
```

The same prompt is fed to Claude repeatedly. Each iteration sees previous work in files and git history.

**Available Commands:**
```bash
/ralph-loop "<TASK>" --max-iterations 20           # Start Ralph Loop with max iterations
/ralph-loop "<TASK>" --completion-promise "DONE"   # Loop until promise detected
/cancel-ralph                                        # Cancel active loop
/ralph-loop help                                     # Show help
```

**How It Works:**
1. Start with `/ralph-loop "Your task description" --completion-promise "COMPLETE"`
2. Claude works on the task
3. When you try to exit, stop hook intercepts
4. Same prompt fed back - Claude sees its previous work
5. Continues iteratively until `<promise>COMPLETE</promise>` detected

**Completion Signal:**
To end a Ralph loop, output:
```
<promise>TASK COMPLETE</promise>
```

**Ralph Loop Workflow in This Project:**
```
1. /ralph-loop "Add user profile feature" --completion-promise "DONE"
2. Write tests first (TDD)
3. Implement feature
4. Run tests to verify
5. Output <promise>DONE</promise> when complete
```

**When to Use Ralph:**
- ✅ Well-defined tasks with clear success criteria
- ✅ Tasks requiring iteration and refinement
- ✅ Iterative development with self-correction
- ❌ Tasks requiring human judgment or design decisions
- ❌ One-shot operations

### Git Worktree (Parallel Development)

For isolated feature development without affecting main codebase:

```bash
# Create a new worktree for feature development
git worktree add ../smart-closet-feature -b feature/your-feature-name

# List all worktrees
git worktree list

# Remove a worktree after merge
git worktree remove ../smart-closet-feature
```

**Worktree Workflow**:
1. Create worktree: `git worktree add ../smart-closet-feature -b feature/xxx`
2. Navigate to worktree: `cd ../smart-closet-feature`
3. Develop and test in isolation
4. Commit changes
5. Merge or PR back to main
6. Remove worktree: `git worktree remove ../smart-closet-feature`

**Skill Invocation Pattern**:
```
1. Brainstorming → Writing Plans → Executing Plans → Finishing
2. For each task: TDD → Implementation → Code Review → Commit
```

## Important Notes

- The app uses local storage (`uni.getStorageSync`) for persistence - no real backend yet
- Weather data uses mock API in `stores/weather.js`
- Tests are in `tests/` directory with the same structure as `src/`
- SASS deprecation warnings about `/` division are known - they don't affect functionality
