<template>
  <view class="profile-page">
    <!-- 背景装饰 -->
    <view class="page-bg">
      <view class="bg-gradient"></view>
      <view class="bg-circle bg-circle-1"></view>
      <view class="bg-circle bg-circle-2"></view>
    </view>

    <!-- 用户信息 -->
    <view class="profile-header">
      <view class="avatar-wrap">
        <image class="avatar" :src="userInfo.avatar || '/static/default-avatar.png'" mode="aspectFill" />
        <view class="avatar-edit" @click="editAvatar">
          <text class="edit-icon">✎</text>
        </view>
      </view>
      <text class="username">{{ userInfo.nickname || '点击设置昵称' }}</text>
      <text class="user-desc">{{ userInfo.bio || '记录你的穿搭生活' }}</text>
    </view>

    <!-- 统计数据 -->
    <view class="stats-card">
      <view class="stat-item">
        <text class="stat-value">{{ stats.itemCount }}</text>
        <text class="stat-label">衣物</text>
      </view>
      <view class="stat-divider"></view>
      <view class="stat-item">
        <text class="stat-value">{{ stats.outfitCount }}</text>
        <text class="stat-label">搭配</text>
      </view>
      <view class="stat-divider"></view>
      <view class="stat-item">
        <text class="stat-value">{{ stats.wearCount }}</text>
        <text class="stat-label">穿搭</text>
      </view>
    </view>

    <!-- 功能菜单 -->
    <view class="menu-section">
      <view class="menu-title">
        <text class="title-text">我的数据</text>
        <view class="title-line"></view>
      </view>
      <view class="menu-list">
        <view class="menu-item" @click="goToPage('/pages/profile/wear-log')">
          <view class="menu-icon-wrap">
            <text class="menu-icon">📅</text>
          </view>
          <text class="menu-text">穿着记录</text>
          <text class="menu-arrow">→</text>
        </view>
        <view class="menu-item" @click="goToPage('/pages/profile/statistics')">
          <view class="menu-icon-wrap">
            <text class="menu-icon">📊</text>
          </view>
          <text class="menu-text">穿着统计</text>
          <text class="menu-arrow">→</text>
        </view>
        <view class="menu-item" @click="goToPage('/pages/profile/favorites')">
          <view class="menu-icon-wrap">
            <text class="menu-icon">♡</text>
          </view>
          <text class="menu-text">我的收藏</text>
          <text class="menu-arrow">→</text>
        </view>
      </view>
    </view>

    <view class="menu-section">
      <view class="menu-title">
        <text class="title-text">设置</text>
        <view class="title-line"></view>
      </view>
      <view class="menu-list">
        <view class="menu-item" @click="goToPage('/pages/profile/edit')">
          <view class="menu-icon-wrap">
            <text class="menu-icon">⚙</text>
          </view>
          <text class="menu-text">编辑资料</text>
          <text class="menu-arrow">→</text>
        </view>
        <view class="menu-item" @click="goToPage('/pages/profile/notification')">
          <view class="menu-icon-wrap">
            <text class="menu-icon">🔔</text>
          </view>
          <text class="menu-text">通知设置</text>
          <text class="menu-arrow">→</text>
        </view>
        <view class="menu-item" @click="goToPage('/pages/profile/about')">
          <view class="menu-icon-wrap">
            <text class="menu-icon">ℹ</text>
          </view>
          <text class="menu-text">关于智简衣橱</text>
          <text class="menu-arrow">→</text>
        </view>
      </view>
    </view>

    <view class="menu-section">
      <view class="menu-title">
        <text class="title-text">数据管理</text>
        <view class="title-line"></view>
      </view>
      <view class="menu-list">
        <view class="menu-item" @click="exportData">
          <view class="menu-icon-wrap">
            <text class="menu-icon">📤</text>
          </view>
          <text class="menu-text">导出数据</text>
          <text class="menu-arrow">→</text>
        </view>
        <view class="menu-item" @click="importData">
          <view class="menu-icon-wrap">
            <text class="menu-icon">📥</text>
          </view>
          <text class="menu-text">导入数据</text>
          <text class="menu-arrow">→</text>
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
  background: linear-gradient(180deg, #FAF8F5 0%, #F0EDE8 100%);
  padding-bottom: 120rpx;
  position: relative;
  overflow: hidden;
}

.page-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 500rpx;
  pointer-events: none;

  .bg-gradient {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 100%;
    background: linear-gradient(135deg, rgba(201, 168, 108, 0.15) 0%, transparent 60%);
  }

  .bg-circle {
    position: absolute;
    border-radius: 50%;

    &-1 {
      width: 300rpx;
      height: 300rpx;
      background: linear-gradient(135deg, rgba(201, 168, 108, 0.1), rgba(201, 168, 108, 0.02));
      top: -100rpx;
      right: -50rpx;
    }

    &-2 {
      width: 200rpx;
      height: 200rpx;
      background: linear-gradient(135deg, rgba(45, 42, 38, 0.05), transparent);
      top: 100rpx;
      left: -80rpx;
    }
  }
}

.profile-header {
  @include flex-column;
  @include flex-center;
  padding: $spacing-xxl 0 $spacing-lg;
  position: relative;
  z-index: 1;

  .avatar-wrap {
    position: relative;
    margin-bottom: $spacing-base;

    .avatar {
      width: 180rpx;
      height: 180rpx;
      border-radius: 50%;
      border: 6rpx solid $white;
      box-shadow: $box-shadow-base;
    }

    .avatar-edit {
      position: absolute;
      bottom: 8rpx;
      right: 8rpx;
      width: 56rpx;
      height: 56rpx;
      background: linear-gradient(135deg, $primary-color, $primary-dark);
      border-radius: 50%;
      @include flex-center;
      box-shadow: $box-shadow-light;

      .edit-icon {
        font-size: 24rpx;
        color: $white;
      }
    }
  }

  .username {
    font-size: $font-size-xl;
    font-weight: 700;
    color: $secondary-color;
    margin-bottom: $spacing-xs;
    letter-spacing: -0.01em;
  }

  .user-desc {
    font-size: $font-size-sm;
    color: $text-secondary;
  }
}

.stats-card {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 $spacing-base;
  padding: $spacing-lg 0;
  background: $white;
  border-radius: $border-radius-xl;
  box-shadow: $box-shadow-base;
  margin-top: -20rpx;
  position: relative;
  z-index: 2;

  .stat-item {
    @include flex-column;
    @include flex-center;
    flex: 1;
    padding: $spacing-sm 0;

    .stat-value {
      font-size: 44rpx;
      font-weight: 700;
      color: $secondary-color;
      margin-bottom: 4rpx;
      letter-spacing: -0.02em;
    }

    .stat-label {
      font-size: $font-size-sm;
      color: $text-secondary;
    }
  }

  .stat-divider {
    width: 1rpx;
    height: 60rpx;
    background: linear-gradient(180deg, transparent, $border-color, transparent);
  }
}

.menu-section {
  margin-top: $spacing-lg;
  padding: 0 $spacing-base;
  position: relative;
  z-index: 1;

  .menu-title {
    margin-bottom: $spacing-sm;
    padding-left: $spacing-xs;

    .title-text {
      font-size: $font-size-sm;
      color: $text-secondary;
      font-weight: 600;
      letter-spacing: 0.05em;
    }

    .title-line {
      width: 40rpx;
      height: 4rpx;
      background: $primary-color;
      border-radius: 2rpx;
      margin-top: 6rpx;
    }
  }

  .menu-list {
    background: $white;
    border-radius: $border-radius-xl;
    overflow: hidden;
    box-shadow: $box-shadow-light;
  }

  .menu-item {
    display: flex;
    align-items: center;
    padding: $spacing-base;
    border-bottom: 1rpx solid rgba(232, 229, 224, 0.5);
    transition: background 0.2s ease;

    &:last-child {
      border-bottom: none;
    }

    &:active {
      background: #FAF8F5;
    }

    .menu-icon-wrap {
      width: 72rpx;
      height: 72rpx;
      background: linear-gradient(135deg, #FAF8F5, #F5F2EE);
      border-radius: $border-radius-base;
      @include flex-center;
      margin-right: $spacing-sm;
    }

    .menu-icon {
      font-size: 32rpx;
    }

    .menu-text {
      flex: 1;
      font-size: $font-size-base;
      color: $secondary-color;
      font-weight: 500;
    }

    .menu-arrow {
      color: $text-placeholder;
      font-size: $font-size-sm;
    }
  }
}
</style>
