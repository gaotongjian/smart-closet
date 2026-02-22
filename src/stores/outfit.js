import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useOutfitStore = defineStore('outfit', () => {
  const outfits = ref([])

  const loadOutfits = () => {
    const stored = uni.getStorageSync('outfits')
    if (stored) {
      outfits.value = stored
    }
  }

  const saveOutfits = () => {
    uni.setStorageSync('outfits', outfits.value)
  }

  const addOutfit = (outfit) => {
    const newOutfit = {
      id: Date.now().toString(),
      ...outfit,
      createdAt: new Date().toISOString()
    }
    outfits.value.unshift(newOutfit)
    saveOutfits()
    return newOutfit
  }

  const updateOutfit = (id, updates) => {
    const index = outfits.value.findIndex(outfit => outfit.id === id)
    if (index !== -1) {
      outfits.value[index] = { ...outfits.value[index], ...updates }
      saveOutfits()
    }
  }

  const deleteOutfit = (id) => {
    outfits.value = outfits.value.filter(outfit => outfit.id !== id)
    saveOutfits()
  }

  const getOutfitById = (id) => {
    return outfits.value.find(outfit => outfit.id === id)
  }

  const getRandom = () => {
    if (outfits.value.length === 0) return null
    const randomIndex = Math.floor(Math.random() * outfits.value.length)
    return outfits.value[randomIndex]
  }

  const getRecommended = () => {
    // 智能推荐：优先推荐最近的搭配
    if (outfits.value.length === 0) return null
    // 随机返回一套搭配
    return getRandom()
  }

  return {
    outfits,
    loadOutfits,
    addOutfit,
    updateOutfit,
    deleteOutfit,
    getOutfitById,
    getRandom,
    getRecommended
  }
})
