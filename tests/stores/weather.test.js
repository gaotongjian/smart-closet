import { describe, it, expect, beforeEach } from 'vitest'

describe('天气 Store', () => {
  let weatherStore

  beforeEach(async () => {
    const { useWeatherStore } = await import('../../src/stores/weather.js')
    weatherStore = useWeatherStore()
  })

  it('should have initial state', () => {
    expect(weatherStore.weather).toBeNull()
    expect(weatherStore.location).toBe('北京')
    expect(weatherStore.isLoading).toBe(false)
  })

  it('should fetch weather data', async () => {
    await weatherStore.fetchWeather('北京')

    expect(weatherStore.weather).not.toBeNull()
    expect(weatherStore.weather.city).toBe('北京')
    expect(weatherStore.weather.temp).toBeDefined()
    expect(weatherStore.weather.condition).toBeDefined()
  })

  it('should cache weather data', async () => {
    await weatherStore.fetchWeather('北京')

    expect(weatherStore.lastUpdate).not.toBeNull()
  })

  it('should get outfit suggestion based on weather', async () => {
    await weatherStore.fetchWeather('北京')

    const suggestion = weatherStore.getOutfitSuggestion
    expect(suggestion).not.toBeNull()
    expect(suggestion.type).toBeDefined()
    expect(Array.isArray(suggestion.items)).toBe(true)
  })
})
