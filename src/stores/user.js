import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const userInfo = ref({
    id: '',
    nickname: '',
    avatar: '',
    bio: '',
    createdAt: ''
  })

  const isLoggedIn = ref(false)

  const setUserInfo = (info) => {
    userInfo.value = { ...userInfo.value, ...info }
    isLoggedIn.value = true
    // 保存到本地存储
    uni.setStorageSync('userInfo', userInfo.value)
  }

  const updateAvatar = (avatarPath) => {
    userInfo.value.avatar = avatarPath
    uni.setStorageSync('userInfo', userInfo.value)
  }

  const initUserInfo = () => {
    const stored = uni.getStorageSync('userInfo')
    if (stored) {
      userInfo.value = stored
      isLoggedIn.value = true
    }
  }

  const logout = () => {
    userInfo.value = {
      id: '',
      nickname: '',
      avatar: '',
      bio: '',
      createdAt: ''
    }
    isLoggedIn.value = false
    uni.removeStorageSync('userInfo')
  }

  return {
    userInfo,
    isLoggedIn,
    setUserInfo,
    updateAvatar,
    initUserInfo,
    logout
  }
})
