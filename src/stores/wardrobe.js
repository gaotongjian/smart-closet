import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useWardrobeStore = defineStore('wardrobe', () => {
  const items = ref([])

  // 分类映射
  const categoryMap = {
    tops: '上衣',
    bottoms: '裤子',
    dresses: '裙子',
    outerwear: '外套',
    shoes: '鞋子',
    accessories: '配饰'
  }

  const loadItems = () => {
    const stored = uni.getStorageSync('wardrobeItems')
    if (stored) {
      items.value = stored
    }
  }

  const saveItems = () => {
    uni.setStorageSync('wardrobeItems', items.value)
  }

  const addItem = (item) => {
    const newItem = {
      id: Date.now().toString(),
      ...item,
      categoryName: categoryMap[item.category] || item.category,
      createdAt: new Date().toISOString()
    }
    items.value.unshift(newItem)
    saveItems()
    return newItem
  }

  const updateItem = (id, updates) => {
    const index = items.value.findIndex(item => item.id === id)
    if (index !== -1) {
      items.value[index] = { ...items.value[index], ...updates }
      saveItems()
    }
  }

  const deleteItem = (id) => {
    items.value = items.value.filter(item => item.id !== id)
    saveItems()
  }

  const getItemById = (id) => {
    return items.value.find(item => item.id === id)
  }

  const getItemsByCategory = (category) => {
    if (category === 'all') return items.value
    return items.value.filter(item => item.category === category)
  }

  const getRandomItems = (count = 3) => {
    const shuffled = [...items.value].sort(() => 0.5 - Math.random())
    return shuffled.slice(0, count)
  }

  // 计算统计数据
  const stats = computed(() => {
    return {
      total: items.value.length,
      byCategory: Object.keys(categoryMap).reduce((acc, key) => {
        acc[key] = items.value.filter(item => item.category === key).length
        return acc
      }, {})
    }
  })

  return {
    items,
    loadItems,
    addItem,
    updateItem,
    deleteItem,
    getItemById,
    getItemsByCategory,
    getRandomItems,
    stats,
    categoryMap
  }
})
