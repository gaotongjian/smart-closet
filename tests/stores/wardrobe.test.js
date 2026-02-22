import { describe, it, expect, beforeEach } from 'vitest'

describe('衣橱 Store', () => {
  let wardrobeStore

  beforeEach(async () => {
    const { useWardrobeStore } = await import('../../src/stores/wardrobe.js')
    wardrobeStore = useWardrobeStore()
    // 重置状态
    wardrobeStore.items.length = 0
  })

  it('should have initial empty state', () => {
    expect(Array.isArray(wardrobeStore.items)).toBe(true)
    expect(wardrobeStore.items.length).toBe(0)
  })

  it('should add new item', () => {
    const newItem = {
      id: '1',
      name: '白色T恤',
      category: 'tops',
      categoryName: '上衣',
      image: 'https://example.com/t-shirt.jpg',
      tags: ['休闲', '纯棉'],
      brand: '优衣库',
      color: '白色'
    }

    wardrobeStore.addItem(newItem)

    expect(wardrobeStore.items.length).toBe(1)
    expect(wardrobeStore.items[0].name).toBe('白色T恤')
    expect(wardrobeStore.items[0].category).toBe('tops')
  })

  it('should get item by id', () => {
    const newItem = {
      id: 'test-123',
      name: '蓝色牛仔裤',
      category: 'bottoms',
      image: 'https://example.com/jeans.jpg'
    }

    wardrobeStore.addItem(newItem)
    const found = wardrobeStore.getItemById('test-123')

    expect(found).not.toBeNull()
    expect(found.name).toBe('蓝色牛仔裤')
  })

  it('should update item', () => {
    wardrobeStore.addItem({
      id: 'update-test',
      name: '旧名称',
      category: 'tops'
    })

    wardrobeStore.updateItem('update-test', { name: '新名称' })

    const updated = wardrobeStore.getItemById('update-test')
    expect(updated.name).toBe('新名称')
  })

  it('should delete item', () => {
    wardrobeStore.addItem({
      id: 'delete-test',
      name: '要删除的衣物'
    })

    expect(wardrobeStore.items.length).toBe(1)

    wardrobeStore.deleteItem('delete-test')

    expect(wardrobeStore.items.length).toBe(0)
  })

  it('should filter items by category', () => {
    wardrobeStore.addItem({ id: '1', category: 'tops', name: 'T恤' })
    wardrobeStore.addItem({ id: '2', category: 'bottoms', name: '裤子' })
    wardrobeStore.addItem({ id: '3', category: 'tops', name: '衬衫' })

    const tops = wardrobeStore.getItemsByCategory('tops')

    expect(tops.length).toBe(2)
    expect(tops.every(item => item.category === 'tops')).toBe(true)
  })
})
