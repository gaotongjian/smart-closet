# PROGRESS.md

This file documents the lessons learned, mistakes made, and solutions found during SmartCloset development.

---

## Mistakes & Solutions

### 1. SASS Variables Not Loading

**Problem:**
```
Undefined variable $font-size-xxl
```

**Root Cause:**
- SASS variables in `src/uni.scss` were not globally available to Vue components
- Manually importing in each component was tedious and error-prone

**Solution:**
```javascript
// vite.config.js
css: {
  preprocessorOptions: {
    scss: {
      additionalData: `@import "@/uni.scss";`
    }
  }
}
```

**Additional Fix:**
- Removed manual import of `uni.scss` from `App.vue` to avoid double-loading error

---

### 2. uni-app Lifecycle Hook Import Error

**Problem:**
```
SyntaxError: The requested module does not provide an export named 'computed'
```

**Root Cause:**
Incorrect import statements - trying to import Vue composition API from `@dcloudio/uni-app`:

```javascript
// ❌ WRONG
import { ref, computed, onLoad } from '@dcloudio/uni-app'

// ✅ CORRECT
import { ref, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
```

**Rule:**
- Vue core: `ref`, `computed`, `onMounted`, `watch`, etc. → import from `vue`
- uni-app lifecycle: `onLoad`, `onShow`, `onHide`, etc. → import from `@dcloudio/uni-app`

---

### 3. Browser MCP "连接服务器超时" False Alarm

**Problem:**
Page showed "连接服务器超时，点击屏幕重试" overlay

**Root Cause:**
This was actually caused by the import error (#2) - the page couldn't load due to JavaScript errors, not a real server issue.

**Solution:**
Fix the import errors, then the page loads normally.

---

### 4. Git Push Network Issues

**Problem:**
```
fatal: unable to access 'https://github.com/...': Failed to connect to github.com port 443
```

**Solution:**
Use proxy:
```bash
HTTP_PROXY=http://192.168.1.104:7890 HTTPS_PROXY=http://192.168.1.104:7890 git push origin main
```

---

## Development Workflow Summary

### Ralph Loop Usage
1. Start: `/ralph-loop "TASK" --completion-promise "DONE"`
2. Work iteratively
3. End: output `<promise>DONE</promise>`

### Git Worktree for Features
```bash
git worktree add ../smart-closet-feature -b feature/xxx
cd ../smart-closet-feature
# develop...
# commit...
git worktree remove ../smart-closet-feature
```

### TDD Workflow
1. Write failing test
2. Run test to verify failure
3. Implement minimal code
4. Run test to verify pass
5. Commit

---

## Key Takeaways

1. **Import errors show as runtime errors** - In uni-app, incorrect imports often manifest as runtime errors, not build errors. Always check imports first when facing mysterious runtime issues.

2. **uni-app ≠ vue** - While uni-app uses Vue, some imports are framework-specific. Remember the import split: `vue` vs `@dcloudio/uni-app`.

3. **Global SASS via vite config** - Never manually import SCSS variables in each component. Use `additionalData` in vite.config.js.

4. **Test first, then implement** - TDD saves time by catching issues early.

5. **Verify with actual browser** - Use Browser MCP to verify page rendering, not just console logs.

---

## File Created

- `CLAUDE.md` - Project guide for future Claude sessions
- `docs/plans/` - Design and implementation plans

---

## Test Results

```
✓ tests/stores/wardrobe.test.js (6 tests)
✓ tests/stores/tagService.test.js (9 tests)
✓ tests/stores/outfit.test.js (7 tests)
✓ tests/stores/user.test.js (4 tests)
✓ tests/stores/wardrobeService.test.js (10 tests)
✓ tests/stores/weather.test.js (4 tests)

Test Files: 6 passed
Tests: 40 passed
```

---

## Features Implemented

- ✅ Wardrobe management (衣橱)
- ✅ Smart tags (颜色、季节、场合)
- ✅ Batch operations (批量删除、移动分类)
- ✅ Service layer (tagService, wardrobeService)
- ✅ Unit tests (40 tests)
- ✅ H5 dev server
