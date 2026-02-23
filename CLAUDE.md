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

## Important Notes

- The app uses local storage (`uni.getStorageSync`) for persistence - no real backend yet
- Weather data uses mock API in `stores/weather.js`
- Tests are in `tests/` directory with the same structure as `src/`
- SASS deprecation warnings about `/` division are known - they don't affect functionality
