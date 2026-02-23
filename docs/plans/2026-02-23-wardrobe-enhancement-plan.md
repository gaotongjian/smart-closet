# 衣橱管理增强功能实现计划

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 完善衣橱管理功能，包括衣物详情编辑、智能标签系统、批量管理操作，并补全服务层和单元测试

**Architecture:** 采用混合模式架构，服务层抽象API接口，支持本地/云端切换。使用Pinia管理状态，vitest进行单元测试

**Tech Stack:** Vue3 + uni-app + Pinia + vitest

---

## Task 1: 创建标签服务层 (tagService.js)

**Files:**
- Create: `src/services/tagService.js`
- Test: `tests/unit/tagService.test.js`

**Step 1: 编写测试文件**

```javascript
// tests/unit/tagService.test.js
import { describe, it, expect } from 'vitest'
import {
  getColorTags,
  getSeasonTags,
  getOccasionTags,
  recommendTags
} from '@/services/tagService'

describe('tagService', () => {
  describe('getColorTags', () => {
    it('should return array of color tags', () => {
      const colors = getColorTags()
      expect(colors).toBeInstanceOf(Array)
      expect(colors.length).toBeGreaterThan(0)
      expect(colors[0]).toHaveProperty('id')
      expect(colors[0]).toHaveProperty('name')
      expect(colors[0]).toHaveProperty('hex')
    })
  })

  describe('getSeasonTags', () => {
    it('should return 4 seasons', () => {
      const seasons = getSeasonTags()
      expect(seasons.length).toBe(4)
    })
  })

  describe('getOccasionTags', () => {
    it('should return occasion tags', () => {
      const occasions = getOccasionTags()
      expect(occasions.length).toBeGreaterThan(0)
    })
  })

  describe('recommendTags', () => {
    it('should recommend based on category', () => {
      const recommendations = recommendTags('tops')
      expect(recommendations).toHaveProperty('seasons')
      expect(recommendations).toHaveProperty('occasions')
    })
  })
})
```

**Step 2: 运行测试验证失败**

Run: `npm test tests/unit/tagService.test.js`
Expected: FAIL - file not found

**Step 3: 实现 tagService.js**

```javascript
// src/services/tagService.js

// 颜色标签
export const getColorTags = () => {
  return [
    { id: 'black', name: '黑色', hex: '#000000' },
    { id: 'white', name: '白色', hex: '#FFFFFF' },
    { id: 'gray', name: '灰色', hex: '#808080' },
    { id: 'navy', name: '深蓝', hex: '#000080' },
    { id: 'blue', name: '蓝色', hex: '#4169E1' },
    { id: 'red', name: '红色', hex: '#DC143C' },
    { id: 'pink', name: '粉色', hex: '#FFB6C1' },
    { id: 'orange', name: '橙色', hex: '#FFA500' },
    { id: 'yellow', name: '黄色', hex: '#FFD700' },
    { id: 'green', name: '绿色', hex: '#228B22' },
    { id: 'purple', name: '紫色', hex: '#800080' },
    { id: 'brown', name: '棕色', hex: '#8B4513' }
  ]
}

// 季节标签
export const getSeasonTags = () => {
  return [
    { id: 'spring', name: '春季', icon: '🌸' },
    { id: 'summer', name: '夏季', icon: '☀️' },
    { id: 'autumn', name: '秋季', icon: '🍂' },
    { id: 'winter', name: '冬季', icon: '❄️' }
  ]
}

// 场合标签
export const getOccasionTags = () => {
  return [
    { id: 'casual', name: '休闲', icon: '🏠' },
    { id: 'work', name: '通勤', icon: '🏢' },
    { id: 'date', name: '约会', icon: '💕' },
    { id: 'sports', name: '运动', icon: '🏃' },
    { id: 'formal', name: '正式', icon: '👔' },
    { id: 'party', name: '派对', icon: '🎉' }
  ]
}

// 智能推荐标签
export const recommendTags = (category) => {
  // 基于分类的推荐规则
  const categoryRules = {
    tops: {
      seasons: ['spring', 'summer', 'autumn'],
      occasions: ['casual', 'work', 'date', 'formal']
    },
    bottoms: {
      seasons: ['spring', 'summer', 'autumn', 'winter'],
      occasions: ['casual', 'work', 'date', 'formal']
    },
    dresses: {
      seasons: ['spring', 'summer', 'autumn'],
      occasions: ['date', 'party', 'formal', 'work']
    },
    outerwear: {
      seasons: ['spring', 'autumn', 'winter'],
      occasions: ['casual', 'work']
    },
    shoes: {
      seasons: ['spring', 'summer', 'autumn', 'winter'],
      occasions: ['casual', 'work', 'sports', 'formal']
    },
    accessories: {
      seasons: ['spring', 'summer', 'autumn', 'winter'],
      occasions: ['casual', 'work', 'date', 'party']
    }
  }

  const rules = categoryRules[category] || {
    seasons: ['spring', 'summer', 'autumn', 'winter'],
    occasions: ['casual', 'work']
  }

  return {
    seasons: rules.seasons,
    occasions: rules.occasions
  }
}

export default {
  getColorTags,
  getSeasonTags,
  getOccasionTags,
  recommendTags
}
```

**Step 4: 运行测试验证通过**

Run: `npm test tests/unit/tagService.test.js`
Expected: PASS

**Step 5: 提交**

```bash
git add src/services/tagService.js tests/unit/tagService.test.js
git commit -m "feat: add tag service with smart recommendation"
```

---

## Task 2: 创建衣物服务层 (wardrobeService.js)

**Files:**
- Create: `src/services/wardrobeService.js`
- Test: `tests/unit/wardrobeService.test.js`

**Step 1: 编写测试文件**

```javascript
// tests/unit/wardrobeService.test.js
import { describe, it, expect, beforeEach } from 'vitest'
import {
  getItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
  batchDelete,
  batchUpdate
} from '@/services/wardrobeService'

describe('wardrobeService', () => {
  beforeEach(() => {
    // 清理存储
    uni.removeStorageSync('wardrobeItems')
  })

  describe('getItems', () => {
    it('should return empty array when no items', () => {
      const items = getItems()
      expect(items).toEqual([])
    })
  })

  describe('createItem', () => {
    it('should create item with id and timestamp', () => {
      const item = createItem({
        name: '测试衣物',
        category: 'tops',
        image: 'test.jpg'
      })

      expect(item).toHaveProperty('id')
      expect(item).toHaveProperty('createdAt')
      expect(item.name).toBe('测试衣物')
      expect(item.category).toBe('tops')
    })
  })

  describe('getItemById', () => {
    it('should return item by id', () => {
      const created = createItem({ name: '测试', category: 'tops', image: 'x.jpg' })
      const found = getItemById(created.id)
      expect(found.id).toBe(created.id)
    })
  })

  describe('updateItem', () => {
    it('should update item properties', () => {
      const created = createItem({ name: '旧名称', category: 'tops', image: 'x.jpg' })
      const updated = updateItem(created.id, { name: '新名称' })
      expect(updated.name).toBe('新名称')
    })
  })

  describe('deleteItem', () => {
    it('should remove item', () => {
      const created = createItem({ name: '测试', category: 'tops', image: 'x.jpg' })
      deleteItem(created.id)
      const found = getItemById(created.id)
      expect(found).toBeUndefined()
    })
  })

  describe('batchDelete', () => {
    it('should delete multiple items', () => {
      const item1 = createItem({ name: '1', category: 'tops', image: '1.jpg' })
      const item2 = createItem({ name: '2', category: 'tops', image: '2.jpg' })
      batchDelete([item1.id, item2.id])
      expect(getItems().length).toBe(0)
    })
  })

  describe('batchUpdate', () => {
    it('should update multiple items', () => {
      const item1 = createItem({ name: '1', category: 'tops', image: '1.jpg' })
      const item2 = createItem({ name: '2', category: 'tops', image: '2.jpg' })
      batchUpdate([item1.id, item2.id], { category: 'bottoms' })
      const items = getItems()
      expect(items.every(i => i.category === 'bottoms')).toBe(true)
    })
  })
})
```

**Step 2: 运行测试验证失败**

Run: `npm test tests/unit/wardrobeService.test.js`
Expected: FAIL - file not found

**Step 3: 实现 wardrobeService.js**

```javascript
// src/services/wardrobeService.js
import { useWardrobeStore } from '@/stores/wardrobe'

// 获取所有衣物
export const getItems = () => {
  const store = useWardrobeStore()
  store.loadItems()
  return store.items
}

// 根据ID获取衣物
export const getItemById = (id) => {
  const store = useWardrobeStore()
  store.loadItems()
  return store.getItemById(id)
}

// 创建衣物
export const createItem = (itemData) => {
  const store = useWardrobeStore()
  store.loadItems()
  return store.addItem(itemData)
}

// 更新衣物
export const updateItem = (id, updates) => {
  const store = useWardrobeStore()
  store.loadItems()
  store.updateItem(id, updates)
  return store.getItemById(id)
}

// 删除衣物
export const deleteItem = (id) => {
  const store = useWardrobeStore()
  store.loadItems()
  store.deleteItem(id)
}

// 批量删除
export const batchDelete = (ids) => {
  const store = useWardrobeStore()
  store.loadItems()
  ids.forEach(id => store.deleteItem(id))
}

// 批量更新
export const batchUpdate = (ids, updates) => {
  const store = useWardrobeStore()
  store.loadItems()
  ids.forEach(id => store.updateItem(id, updates))
}

export default {
  getItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
  batchDelete,
  batchUpdate
}
```

**Step 4: 运行测试验证通过**

Run: `npm test tests/unit/wardrobeService.test.js`
Expected: PASS

**Step 5: 提交**

```bash
git add src/services/wardrobeService.js tests/unit/wardrobeService.test.js
git commit -m "feat: add wardrobe service layer"
```

---

## Task 3: 增强添加衣物页面 (wardrobe/add.vue)

**Files:**
- Modify: `src/pages/wardrobe/add.vue`

**Step 1: 查看现有实现**

Run: Read `src/pages/wardrobe/add.vue`

**Step 2: 添加智能标签组件**

在模板中添加颜色选择器、季节多选、场合多选 UI

**Step 3: 集成 tagService**

```javascript
import { getColorTags, getSeasonTags, getOccasionTags, recommendTags } from '@/services/tagService'

// 在 script setup 中添加
const colorTags = ref(getColorTags())
const seasonTags = ref(getSeasonTags())
const occasionTags = ref(getOccasionTags())

// 根据选择的分类推荐标签
const handleCategoryChange = (categoryId) => {
  form.category = categoryId
  const recommendations = recommendTags(categoryId)
  // 自动选中推荐的季节和场合
  form.seasons = recommendations.seasons
  form.occasions = recommendations.occasions
}
```

**Step 4: 提交**

```bash
git add src/pages/wardrobe/add.vue
git commit -m "feat: enhance add page with smart tags"
```

---

## Task 4: 增强衣物详情页面 (wardrobe/detail.vue)

**Files:**
- Modify: `src/pages/wardrobe/detail.vue`

**Step 1: 查看现有实现**

Run: Read `src/pages/wardrobe/detail.vue`

**Step 2: 添加编辑功能**

- 支持编辑所有字段
- 支持删除衣物
- 支持返回列表

**Step 3: 提交**

```bash
git add src/pages/wardrobe/detail.vue
git commit -m "feat: enhance detail page with edit functionality"
```

---

## Task 5: 添加批量管理功能 (wardrobe.vue)

**Files:**
- Modify: `src/pages/wardrobe/wardrobe.vue`

**Step 1: 添加多选状态**

```javascript
const isBatchMode = ref(false)
const selectedItems = ref([])

// 长按进入多选模式
const enterBatchMode = (item) => {
  isBatchMode.value = true
  selectedItems.value = [item.id]
}

// 切换选中状态
const toggleSelect = (itemId) => {
  const index = selectedItems.value.indexOf(itemId)
  if (index > -1) {
    selectedItems.value.splice(index, 1)
  } else {
    selectedItems.value.push(itemId)
  }
  // 全部取消时退出多选模式
  if (selectedItems.value.length === 0) {
    isBatchMode.value = false
  }
}

// 批量删除
const batchDeleteSelected = () => {
  uni.showModal({
    title: '确认删除',
    content: `确定要删除选中的 ${selectedItems.value.length} 件衣物吗？`,
    success: (res) => {
      if (res.confirm) {
        batchDelete(selectedItems.value)
        exitBatchMode()
      }
    }
  })
}

// 批量移动分类
const batchMoveCategory = (category) => {
  batchUpdate(selectedItems.value, { category })
  exitBatchMode()
}
```

**Step 2: 添加批量操作工具栏 UI**

**Step 3: 提交**

```bash
git add src/pages/wardrobe/wardrobe.vue
git commit -m "feat: add batch management functionality"
```

---

## Task 6: 编写 Store 单元测试

**Files:**
- Test: `tests/unit/wardrobeStore.test.js`

**Step 1: 编写测试**

```javascript
import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useWardrobeStore } from '@/stores/wardrobe'

describe('wardrobeStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    uni.removeStorageSync('wardrobeItems')
  })

  it('should add item correctly', () => {
    const store = useWardrobeStore()
    const item = store.addItem({ name: 'Test', category: 'tops', image: 'x.jpg' })

    expect(store.items.length).toBe(1)
    expect(item.name).toBe('Test')
    expect(item).toHaveProperty('id')
    expect(item).toHaveProperty('createdAt')
  })

  it('should update item correctly', () => {
    const store = useWardrobeStore()
    const item = store.addItem({ name: 'Test', category: 'tops', image: 'x.jpg' })

    store.updateItem(item.id, { name: 'Updated' })

    expect(store.getItemById(item.id).name).toBe('Updated')
  })

  it('should delete item correctly', () => {
    const store = useWardrobeStore()
    const item = store.addItem({ name: 'Test', category: 'tops', image: 'x.jpg' })

    store.deleteItem(item.id)

    expect(store.items.length).toBe(0)
  })

  it('should filter by category', () => {
    const store = useWardrobeStore()
    store.addItem({ name: 'Top1', category: 'tops', image: '1.jpg' })
    store.addItem({ name: 'Bottom1', category: 'bottoms', image: '2.jpg' })

    const tops = store.getItemsByCategory('tops')

    expect(tops.length).toBe(1)
    expect(tops[0].category).toBe('tops')
  })

  it('should get random items', () => {
    const store = useWardrobeStore()
    store.addItem({ name: '1', category: 'tops', image: '1.jpg' })
    store.addItem({ name: '2', category: 'tops', image: '2.jpg' })
    store.addItem({ name: '3', category: 'tops', image: '3.jpg' })

    const random = store.getRandomItems(2)

    expect(random.length).toBe(2)
  })

  it('should compute stats correctly', () => {
    const store = useWardrobeStore()
    store.addItem({ name: '1', category: 'tops', image: '1.jpg' })
    store.addItem({ name: '2', category: 'tops', image: '2.jpg' })
    store.addItem({ name: '3', category: 'bottoms', image: '3.jpg' })

    expect(store.stats.total).toBe(3)
    expect(store.stats.byCategory.tops).toBe(2)
    expect(store.stats.byCategory.bottoms).toBe(1)
  })
})
```

**Step 2: 运行测试**

Run: `npm test tests/unit/wardrobeStore.test.js`
Expected: PASS

**Step 3: 提交**

```bash
git add tests/unit/wardrobeStore.test.js
git commit -m "test: add wardrobe store unit tests"
```

---

## Task 7: 运行所有测试并验证

**Step 1: 运行完整测试套件**

Run: `npm test`
Expected: All tests pass

**Step 2: 提交**

```bash
git add .
git commit -m "test: complete unit test suite"
```

---

## 执行选项

**Plan complete and saved to `docs/plans/2026-02-23-wardrobe-enhancement-plan.md`. Two execution options:**

**1. Subagent-Driven (this session)** - I dispatch fresh subagent per task, review between tasks, fast iteration

**2. Parallel Session (separate)** - Open new session with executing-plans, batch execution with checkpoints

**Which approach?**
