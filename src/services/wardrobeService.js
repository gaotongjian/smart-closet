// 衣物服务层 - 提供衣物CRUD操作和批量管理
import { useWardrobeStore } from '../stores/wardrobe'

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
