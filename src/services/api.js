// API 服务层
const BASE_URL = 'https://api.example.com'

export const request = (options) => {
  return new Promise((resolve, reject) => {
    uni.request({
      url: BASE_URL + options.url,
      method: options.method || 'GET',
      data: options.data || {},
      header: options.header || {},
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data)
        } else {
          reject(res)
        }
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}

// 天气API（占位，实际需要申请真实API）
export const weatherApi = {
  getWeather: (city) => {
    // 占位实现
    return Promise.resolve({})
  }
}

// 衣物相关API
export const wardrobeApi = {
  getItems: () => request({ url: '/items' }),
  addItem: (data) => request({ url: '/items', method: 'POST', data }),
  updateItem: (id, data) => request({ url: `/items/${id}`, method: 'PUT', data }),
  deleteItem: (id) => request({ url: `/items/${id}`, method: 'DELETE' })
}

// 搭配相关API
export const outfitApi = {
  getOutfits: () => request({ url: '/outfits' }),
  addOutfit: (data) => request({ url: '/outfits', method: 'POST', data }),
  updateOutfit: (id, data) => request({ url: `/outfits/${id}`, method: 'PUT', data }),
  deleteOutfit: (id) => request({ url: `/outfits/${id}`, method: 'DELETE' })
}
