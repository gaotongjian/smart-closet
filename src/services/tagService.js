// 标签服务层 - 提供颜色、季节、场合标签和智能推荐

// 颜色标签
export const getColorTags = () => {
  return [
    { id: 'black', name: '黑色', hex: '#000000' },
    { id: 'white', name: '白色', hex: '#FFFFFF' },
    { id: 'gray', name: '灰色', hex: '#808080' },
    { id: 'navy', name: '深蓝', hex: '#000080' },
    { id: 'blue', name: '蓝色', hex: '#4169E1' },
    { id: 'red', name: '红色', hex: '#DC143C' },
    { id: 'pink', name: '粉色', hex: '#FFB6C1' },
    { id: 'orange', name: '橙色', hex: '#FFA500' },
    { id: 'yellow', name: '黄色', hex: '#FFD700' },
    { id: 'green', name: '绿色', hex: '#228B22' },
    { id: 'purple', name: '紫色', hex: '#800080' },
    { id: 'brown', name: '棕色', hex: '#8B4513' }
  ]
}

// 季节标签
export const getSeasonTags = () => {
  return [
    { id: 'spring', name: '春季', icon: 'spring' },
    { id: 'summer', name: '夏季', icon: 'summer' },
    { id: 'autumn', name: '秋季', icon: 'autumn' },
    { id: 'winter', name: '冬季', icon: 'winter' }
  ]
}

// 场合标签
export const getOccasionTags = () => {
  return [
    { id: 'casual', name: '休闲', icon: 'casual' },
    { id: 'work', name: '通勤', icon: 'work' },
    { id: 'date', name: '约会', icon: 'date' },
    { id: 'sports', name: '运动', icon: 'sports' },
    { id: 'formal', name: '正式', icon: 'formal' },
    { id: 'party', name: '派对', icon: 'party' }
  ]
}

// 智能推荐标签
export const recommendTags = (category) => {
  // 基于分类的推荐规则
  const categoryRules = {
    tops: {
      seasons: ['spring', 'summer', 'autumn'],
      occasions: ['casual', 'work', 'date', 'formal']
    },
    bottoms: {
      seasons: ['spring', 'summer', 'autumn', 'winter'],
      occasions: ['casual', 'work', 'date', 'formal']
    },
    dresses: {
      seasons: ['spring', 'summer', 'autumn'],
      occasions: ['date', 'party', 'formal', 'work']
    },
    outerwear: {
      seasons: ['spring', 'autumn', 'winter'],
      occasions: ['casual', 'work']
    },
    shoes: {
      seasons: ['spring', 'summer', 'autumn', 'winter'],
      occasions: ['casual', 'work', 'sports', 'formal']
    },
    accessories: {
      seasons: ['spring', 'summer', 'autumn', 'winter'],
      occasions: ['casual', 'work', 'date', 'party']
    }
  }

  const rules = categoryRules[category] || {
    seasons: ['spring', 'summer', 'autumn', 'winter'],
    occasions: ['casual', 'work']
  }

  return {
    seasons: rules.seasons,
    occasions: rules.occasions
  }
}

export default {
  getColorTags,
  getSeasonTags,
  getOccasionTags,
  recommendTags
}
