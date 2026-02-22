import { describe, it, expect, beforeEach } from 'vitest'

describe('用户 Store', () => {
  let userStore

  beforeEach(async () => {
    const { useUserStore } = await import('../../src/stores/user.js')
    userStore = useUserStore()
  })

  it('should have initial state', () => {
    expect(userStore.userInfo.nickname).toBe('')
    expect(userStore.userInfo.avatar).toBe('')
    expect(userStore.isLoggedIn).toBe(false)
  })

  it('should set user info', () => {
    const userInfo = {
      id: 'user-123',
      nickname: '测试用户',
      avatar: 'https://example.com/avatar.jpg',
      bio: '这是一个测试用户'
    }

    userStore.setUserInfo(userInfo)

    expect(userStore.userInfo.nickname).toBe('测试用户')
    expect(userStore.userInfo.id).toBe('user-123')
    expect(userStore.isLoggedIn).toBe(true)
  })

  it('should update avatar', () => {
    userStore.updateAvatar('https://example.com/new-avatar.jpg')

    expect(userStore.userInfo.avatar).toBe('https://example.com/new-avatar.jpg')
  })

  it('should logout and clear user info', () => {
    userStore.setUserInfo({
      id: 'user-123',
      nickname: '测试用户'
    })

    userStore.logout()

    expect(userStore.userInfo.id).toBe('')
    expect(userStore.userInfo.nickname).toBe('')
    expect(userStore.isLoggedIn).toBe(false)
  })
})
