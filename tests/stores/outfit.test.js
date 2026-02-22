import { describe, it, expect, beforeEach } from 'vitest'

describe('搭配 Store', () => {
  let outfitStore

  beforeEach(async () => {
    const { useOutfitStore } = await import('../../src/stores/outfit.js')
    outfitStore = useOutfitStore()
    // 重置状态
    outfitStore.outfits.length = 0
  })

  it('should have initial empty state', () => {
    expect(Array.isArray(outfitStore.outfits)).toBe(true)
    expect(outfitStore.outfits.length).toBe(0)
  })

  it('should add new outfit', () => {
    const newOutfit = {
      id: '1',
      name: '休闲搭配',
      description: '周末出游穿搭',
      image: 'https://example.com/outfit.jpg',
      tags: ['休闲', '日常'],
      items: []
    }

    outfitStore.addOutfit(newOutfit)

    expect(outfitStore.outfits.length).toBe(1)
    expect(outfitStore.outfits[0].name).toBe('休闲搭配')
  })

  it('should get outfit by id', () => {
    outfitStore.addOutfit({
      id: 'outfit-123',
      name: '商务穿搭',
      image: 'https://example.com/business.jpg'
    })

    const found = outfitStore.getOutfitById('outfit-123')

    expect(found).not.toBeNull()
    expect(found.name).toBe('商务穿搭')
  })

  it('should update outfit', () => {
    outfitStore.addOutfit({
      id: 'update-outfit',
      name: '旧搭配',
      description: '旧描述'
    })

    outfitStore.updateOutfit('update-outfit', {
      name: '新搭配',
      description: '新描述'
    })

    const updated = outfitStore.getOutfitById('update-outfit')
    expect(updated.name).toBe('新搭配')
    expect(updated.description).toBe('新描述')
  })

  it('should delete outfit', () => {
    outfitStore.addOutfit({
      id: 'delete-outfit',
      name: '要删除的搭配'
    })

    expect(outfitStore.outfits.length).toBe(1)

    outfitStore.deleteOutfit('delete-outfit')

    expect(outfitStore.outfits.length).toBe(0)
  })

  it('should get random outfit', () => {
    outfitStore.addOutfit({ id: '1', name: '搭配1' })
    outfitStore.addOutfit({ id: '2', name: '搭配2' })
    outfitStore.addOutfit({ id: '3', name: '搭配3' })

    const random = outfitStore.getRandom()

    expect(random).not.toBeNull()
    expect(['搭配1', '搭配2', '搭配3']).toContain(random.name)
  })

  it('should return null for random when empty', () => {
    const random = outfitStore.getRandom()
    expect(random).toBeNull()
  })
})
