import { createPinia, setActivePinia } from 'pinia'

// 创建 Pinia 实例
const pinia = createPinia()
setActivePinia(pinia)

// 模拟 uni API
global.uni = {
  getStorageSync: () => null,
  setStorageSync: () => {},
  removeStorageSync: () => {},
  getLocation: (options) => {
    if (options?.success) {
      options.success({ latitude: 39.9, longitude: 116.4 })
    }
  }
}
