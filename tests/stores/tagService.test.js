import { describe, it, expect } from 'vitest'
import {
  getColorTags,
  getSeasonTags,
  getOccasionTags,
  recommendTags
} from '../../src/services/tagService'

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

    it('should have 12 color options', () => {
      const colors = getColorTags()
      expect(colors.length).toBe(12)
    })
  })

  describe('getSeasonTags', () => {
    it('should return 4 seasons', () => {
      const seasons = getSeasonTags()
      expect(seasons.length).toBe(4)
    })

    it('should have spring, summer, autumn, winter', () => {
      const seasons = getSeasonTags()
      const ids = seasons.map(s => s.id)
      expect(ids).toContain('spring')
      expect(ids).toContain('summer')
      expect(ids).toContain('autumn')
      expect(ids).toContain('winter')
    })
  })

  describe('getOccasionTags', () => {
    it('should return occasion tags', () => {
      const occasions = getOccasionTags()
      expect(occasions.length).toBeGreaterThan(0)
    })

    it('should have common occasions', () => {
      const occasions = getOccasionTags()
      const ids = occasions.map(o => o.id)
      expect(ids).toContain('casual')
      expect(ids).toContain('work')
      expect(ids).toContain('date')
    })
  })

  describe('recommendTags', () => {
    it('should recommend based on category tops', () => {
      const recommendations = recommendTags('tops')
      expect(recommendations).toHaveProperty('seasons')
      expect(recommendations).toHaveProperty('occasions')
      expect(recommendations.seasons).toContain('spring')
      expect(recommendations.occasions).toContain('casual')
    })

    it('should recommend based on category dresses', () => {
      const recommendations = recommendTags('dresses')
      expect(recommendations.occasions).toContain('date')
      expect(recommendations.occasions).toContain('party')
    })

    it('should return default for unknown category', () => {
      const recommendations = recommendTags('unknown')
      expect(recommendations.seasons).toContain('spring')
      expect(recommendations.occasions).toContain('casual')
    })
  })
})
