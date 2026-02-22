import { describe, it, expect, beforeEach } from 'vitest'
import { useWardrobeStore } from '../../src/stores/wardrobe'
import {
  getItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
  batchDelete,
  batchUpdate
} from '../../src/services/wardrobeService'

describe('wardrobeService', () => {
  beforeEach(() => {
    // 清理存储
    uni.removeStorageSync('wardrobeItems')
    // 清空store
    const store = useWardrobeStore()
    store.items.length = 0
  })

  describe('getItems', () => {
    it('should return empty array when no items', () => {
      const items = getItems()
      expect(items).toEqual([])
    })

    it('should return items after creation', () => {
      createItem({ name: '测试', category: 'tops', image: 'x.jpg' })
      const items = getItems()
      expect(items.length).toBe(1)
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

    it('should return undefined for non-existent id', () => {
      const found = getItemById('non-existent')
      expect(found).toBeUndefined()
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

    it('should handle empty array', () => {
      batchDelete([])
      expect(getItems().length).toBe(0)
    })
  })

  describe('batchUpdate', () => {
    it('should update multiple items', async () => {
      const item1 = createItem({ name: '1', category: 'tops', image: '1.jpg' })
      await new Promise(r => setTimeout(r, 10)) // 确保ID不同
      const item2 = createItem({ name: '2', category: 'tops', image: '2.jpg' })
      const ids = [item1.id, item2.id]

      batchUpdate(ids, { category: 'bottoms' })

      // 直接从store获取验证
      const store = useWardrobeStore()
      store.loadItems()
      const items = store.items

      expect(items.length).toBe(2)
      expect(items.every(i => i.category === 'bottoms')).toBe(true)
    })
  })
})
