<template>
  <view class="profile-page">
    <!-- 用户信息 -->
    <view class="profile-header">
      <view class="avatar-wrap">
        <image class="avatar" :src="userInfo.avatar || '/static/default-avatar.png'" mode="aspectFill" />
        <view class="avatar-edit" @click="editAvatar">
          <text>编辑</text>
        </view>
      </view>
      <text class="username">{{ userInfo.nickname || '未设置昵称' }}</text>
      <text class="user-desc">{{ userInfo.bio || '点击编辑资料' }}</text>
    </view>

    <!-- 统计数据 -->
    <view class="stats-card">
      <view class="stat-item">
        <text class="stat-value">{{ stats.itemCount }}</text>
        <text class="stat-label">衣物数量</text>
      </view>
      <view class="stat-divider"></view>
      <view class="stat-item">
        <text class="stat-value">{{ stats.outfitCount }}</text>
        <text class="stat-label">搭配数量</text>
      </view>
      <view class="stat-divider"></view>
      <view class="stat-item">
        <text class="stat-value">{{ stats.wearCount }}</text>
        <text class="stat-label">穿衣次数</text>
      </view>
    </view>

    <!-- 功能菜单 -->
    <view class="menu-section">
      <view class="menu-title">我的数据</view>
      <view class="menu-list">
        <view class="menu-item" @click="goToPage('/pages/profile/wear-log')">
          <text class="menu-icon">📅</text>
          <text class="menu-text">穿着记录</text>
          <text class="menu-arrow">></text>
        </view>
        <view class="menu-item" @click="goToPage('/pages/profile/statistics')">
          <text class="menu-icon">📊</text>
          <text class="menu-text">穿着统计</text>
          <text class="menu-arrow">></text>
        </view>
        <view class="menu-item" @click="goToPage('/pages/profile/favorites')">
          <text class="menu-icon">❤️</text>
          <text class="menu-text">我的收藏</text>
          <text class="menu-arrow">></text>
        </view>
      </view>
    </view>

    <view class="menu-section">
      <view class="menu-title">设置</view>
      <view class="menu-list">
        <view class="menu-item" @click="goToPage('/pages/profile/edit')">
          <text class="menu-icon">⚙️</text>
          <text class="menu-text">编辑资料</text>
          <text class="menu-arrow">></text>
        </view>
        <view class="menu-item" @click="goToPage('/pages/profile/notification')">
          <text class="menu-icon">🔔</text>
          <text class="menu-text">通知设置</text>
          <text class="menu-arrow">></text>
        </view>
        <view class="menu-item" @click="goToPage('/pages/profile/about')">
          <text class="menu-icon">ℹ️</text>
          <text class="menu-text">关于智简衣橱</text>
          <text class="menu-arrow">></text>
        </view>
      </view>
    </view>

    <view class="menu-section">
      <view class="menu-title">数据管理</view>
      <view class="menu-list">
        <view class="menu-item" @click="exportData">
          <text class="menu-icon">📤</text>
          <text class="menu-text">导出数据</text>
          <text class="menu-arrow">></text>
        </view>
        <view class="menu-item" @click="importData">
          <text class="menu-icon">📥</text>
          <text class="menu-text">导入数据</text>
          <text class="menu-arrow">></text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { useWardrobeStore } from '@/stores/wardrobe'
import { useOutfitStore } from '@/stores/outfit'

const userStore = useUserStore()
const wardrobeStore = useWardrobeStore()
const outfitStore = useOutfitStore()

const userInfo = ref({
  avatar: '',
  nickname: '',
  bio: ''
})

const stats = ref({
  itemCount: 0,
  outfitCount: 0,
  wearCount: 0
})

onMounted(() => {
  userInfo.value = userStore.userInfo
  stats.value = {
    itemCount: wardrobeStore.items.length,
    outfitCount: outfitStore.outfits.length,
    wearCount: 0 // 待从数据库获取
  }
})

const editAvatar = () => {
  uni.chooseImage({
    count: 1,
    sourceType: ['album', 'camera'],
    success: (res) => {
      userStore.updateAvatar(res.tempFilePaths[0])
      userInfo.value.avatar = res.tempFilePaths[0]
    }
  })
}

const goToPage = (url) => {
  uni.navigateTo({ url })
}

const exportData = () => {
  uni.showLoading({ title: '导出中...' })
  setTimeout(() => {
    uni.hideLoading()
    uni.showToast({ title: '导出成功', icon: 'success' })
  }, 1000)
}

const importData = () => {
  uni.showLoading({ title: '导入中...' })
  setTimeout(() => {
    uni.hideLoading()
    uni.showToast({ title: '导入成功', icon: 'success' })
  }, 1000)
}
</script>

<style lang="scss" scoped>
.profile-page {
  min-height: 100vh;
  background: $background-color;
  padding-bottom: 120rpx;
}

.profile-header {
  @include flex-column;
  @include flex-center;
  padding: $spacing-xl 0;
  background: linear-gradient(135deg, #E8F4FF 0%, #FFF 100%);

  .avatar-wrap {
    position: relative;
    margin-bottom: $spacing-base;

    .avatar {
      width: 160rpx;
      height: 160rpx;
      border-radius: 50%;
      border: 6rpx solid $white;
      box-shadow: $box-shadow-base;
    }

    .avatar-edit {
      position: absolute;
      bottom: 0;
      right: 0;
      width: 56rpx;
      height: 56rpx;
      background: $primary-color;
      border-radius: 50%;
      @include flex-center;
      font-size: 20rpx;
      color: $white;
    }
  }

  .username {
    font-size: $font-size-xl;
    font-weight: 600;
    color: $text-color;
    margin-bottom: $spacing-xs;
  }

  .user-desc {
    font-size: $font-size-sm;
    color: $text-secondary;
  }
}

.stats-card {
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin: 0 $spacing-base;
  padding: $spacing-lg 0;
  background: $white;
  border-radius: $border-radius-base;
  box-shadow: $box-shadow-light;
  margin-top: -40rpx;

  .stat-item {
    @include flex-column;
    @include flex-center;
    flex: 1;

    .stat-value {
      font-size: 40rpx;
      font-weight: 700;
      color: $primary-color;
      margin-bottom: 4rpx;
    }

    .stat-label {
      font-size: $font-size-sm;
      color: $text-secondary;
    }
  }

  .stat-divider {
    width: 1rpx;
    height: 60rpx;
    background: $border-color;
  }
}

.menu-section {
  margin-top: $spacing-base;
  padding: 0 $spacing-base;

  .menu-title {
    font-size: $font-size-sm;
    color: $text-secondary;
    margin-bottom: $spacing-sm;
    padding-left: $spacing-xs;
  }

  .menu-list {
    background: $white;
    border-radius: $border-radius-base;
    overflow: hidden;
  }

  .menu-item {
    display: flex;
    align-items: center;
    padding: $spacing-base;
    border-bottom: 1rpx solid $border-color;

    &:last-child {
      border-bottom: none;
    }

    .menu-icon {
      font-size: 40rpx;
      margin-right: $spacing-sm;
    }

    .menu-text {
      flex: 1;
      font-size: $font-size-base;
      color: $text-color;
    }

    .menu-arrow {
      color: $text-placeholder;
      font-size: $font-size-sm;
    }
  }
}
</style>
