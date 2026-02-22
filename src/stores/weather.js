import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useWeatherStore = defineStore('weather', () => {
  const weather = ref(null)
  const location = ref('北京')
  const isLoading = ref(false)
  const lastUpdate = ref(null)

  // 模拟天气数据（实际项目中需要接入真实API）
  const mockWeatherData = {
    '北京': {
      city: '北京',
      temp: 22,
      tempMin: 18,
      tempMax: 26,
      condition: '晴',
      conditionIcon: 'sunny',
      humidity: 45,
      windSpeed: 12,
      windDir: '东北风',
      aqi: 42,
      aqiLevel: '优',
      suggestion: '今日天气晴朗，适合外出。',
      dressSuggestion: '建议穿轻便服装，早晚温差较大，可带薄外套。'
    },
    '上海': {
      city: '上海',
      temp: 25,
      tempMin: 21,
      tempMax: 28,
      condition: '多云',
      conditionIcon: 'cloudy',
      humidity: 65,
      windSpeed: 15,
      windDir: '东南风',
      aqi: 58,
      aqiLevel: '良',
      suggestion: '天气闷热，注意防暑。',
      dressSuggestion: '建议穿轻薄透气的衣物。'
    },
    '广州': {
      city: '广州',
      temp: 28,
      tempMin: 24,
      tempMax: 32,
      condition: '雷阵雨',
      conditionIcon: 'thunder',
      humidity: 78,
      windSpeed: 8,
      windDir: '南风',
      aqi: 35,
      aqiLevel: '优',
      suggestion: '有雷阵雨，外出记得带伞。',
      dressSuggestion: '建议穿凉快衣物，建议带雨具。'
    }
  }

  const fetchWeather = async (city = location.value) => {
    isLoading.value = true

    try {
      // 模拟API延迟
      await new Promise(resolve => setTimeout(resolve, 500))

      // 使用模拟数据（实际项目中替换为真实API调用）
      const data = mockWeatherData[city] || mockWeatherData['北京']

      weather.value = data
      location.value = city
      lastUpdate.value = new Date().toISOString()

      // 缓存天气数据
      uni.setStorageSync('cachedWeather', {
        weather: data,
        location: city,
        timestamp: Date.now()
      })
    } catch (error) {
      console.error('获取天气失败:', error)
      // 尝试使用缓存
      const cached = uni.getStorageSync('cachedWeather')
      if (cached) {
        weather.value = cached.weather
        location.value = cached.location
      }
    } finally {
      isLoading.value = false
    }
  }

  const getWeatherByLocation = () => {
    uni.getLocation({
      type: 'gcj02',
      success: (res) => {
        // 实际项目中需要通过坐标获取城市名称
        // 这里简单模拟
        fetchWeather('北京')
      },
      fail: () => {
        // 获取定位失败时使用默认城市
        fetchWeather('北京')
      }
    })
  }

  // 根据天气推荐穿搭
  const getOutfitSuggestion = computed(() => {
    if (!weather.value) return null

    const { condition, temp } = weather.value

    let suggestion = {
      type: 'casual',
      items: []
    }

    if (temp >= 28) {
      suggestion = {
        type: 'summer',
        items: ['轻薄上衣', '短裤/短裙', '凉鞋']
      }
    } else if (temp >= 18 && temp < 28) {
      suggestion = {
        type: 'spring',
        items: ['长袖T恤', '牛仔裤/休闲裤', '运动鞋']
      }
    } else if (temp >= 10 && temp < 18) {
      suggestion = {
        type: 'autumn',
        items: ['薄外套', '长裤', '平底鞋']
      }
    } else {
      suggestion = {
        type: 'winter',
        items: ['羽绒服', '保暖裤', '靴子']
      }
    }

    // 特殊天气
    if (condition.includes('雨')) {
      suggestion.items.push('雨伞')
    }
    if (condition.includes('雪')) {
      suggestion.items.push('防水靴')
    }

    return suggestion
  })

  return {
    weather,
    location,
    isLoading,
    lastUpdate,
    fetchWeather,
    getWeatherByLocation,
    getOutfitSuggestion
  }
})
