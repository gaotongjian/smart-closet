<template>
  <view class="outfits-page">
    <!-- 页面头部 -->
    <view class="page-header">
      <view class="header-content">
        <view class="header-text">
          <view class="header-title-wrap">
            <text class="header-title">搭配灵感</text>
            <view class="title-line"></view>
          </view>
          <text class="header-subtitle">记录你的穿搭美学</text>
        </view>
        <view class="header-decoration">
          <view class="deco-circle"></view>
        </view>
      </view>
    </view>

    <!-- 搭配列表 -->
    <scroll-view
      class="outfits-list"
      scroll-y
      @scrolltolower="loadMore"
    >
      <view class="outfit-cards">
        <view
          v-for="(outfit, index) in outfits"
          :key="outfit.id"
          class="outfit-card"
          :style="{ animationDelay: `${index * 0.1}s` }"
          @click="viewDetail(outfit)"
        >
          <view class="card-image-container">
            <image class="outfit-image" :src="outfit.image" mode="aspectFill" />
            <view class="card-gradient"></view>
          </view>
          <view class="outfit-overlay">
            <view class="outfit-info">
              <text class="outfit-name">{{ outfit.name }}</text>
              <text class="outfit-desc">{{ outfit.description }}</text>
              <view class="outfit-tags" v-if="outfit.tags && outfit.tags.length">
                <text v-for="tag in outfit.tags" :key="tag" class="tag">{{ tag }}</text>
              </view>
            </view>
            <view class="outfit-action">
              <text class="action-icon">→</text>
            </view>
          </view>
        </view>
      </view>

      <view v-if="outfits.length === 0" class="empty-state">
        <view class="empty-illustration">
          <view class="illustration-frame">
            <view class="frame-corner frame-tl"></view>
            <view class="frame-corner frame-tr"></view>
            <view class="frame-corner frame-bl"></view>
            <view class="frame-corner frame-br"></view>
          </view>
        </view>
        <text class="empty-text">还没有搭配</text>
        <text class="empty-hint">创建你的第一个穿搭灵感</text>
      </view>

      <view v-if="isLoading" class="loading-more">
        <view class="loading-dots">
          <view class="loading-dot"></view>
          <view class="loading-dot"></view>
          <view class="loading-dot"></view>
        </view>
      </view>
    </scroll-view>

    <!-- 创建按钮 -->
    <view class="create-btn" @click="goToCreate">
      <view class="create-btn-inner">
        <text class="create-icon">+</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useOutfitStore } from '@/stores/outfit'

const outfitStore = useOutfitStore()

const isLoading = ref(false)

const outfits = computed(() => outfitStore.outfits)

onMounted(() => {
  outfitStore.loadOutfits()
})

const viewDetail = (outfit) => {
  uni.navigateTo({
    url: `/pages/outfits/detail?id=${outfit.id}`
  })
}

const goToCreate = () => {
  uni.navigateTo({
    url: '/pages/outfits/create'
  })
}

const loadMore = () => {
  // 分页加载逻辑
}
</script>

<style lang="scss" scoped>
.outfits-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #FAF8F5 0%, #F0EDE8 100%);
  padding-bottom: 120rpx;
}

.page-header {
  padding: $spacing-base;
  padding-top: $spacing-lg;
  background: linear-gradient(180deg, #FAF8F5, transparent);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.header-title-wrap {
  position: relative;
  display: inline-block;
}

.header-title {
  font-size: $font-size-xxl;
  font-weight: 700;
  color: $secondary-color;
  display: block;
  letter-spacing: -0.02em;
}

.title-line {
  width: 100rpx;
  height: 6rpx;
  background: linear-gradient(90deg, $primary-color, $primary-light);
  border-radius: 3rpx;
  margin-top: 8rpx;
}

.header-subtitle {
  font-size: $font-size-sm;
  color: $text-secondary;
  margin-top: $spacing-xs;
  display: block;
}

.header-decoration {
  .deco-circle {
    width: 100rpx;
    height: 100rpx;
    border: 4rpx solid $primary-light;
    border-radius: 50%;
    position: relative;

    &::after {
      content: '';
      position: absolute;
      width: 40rpx;
      height: 40rpx;
      background: $primary-color;
      border-radius: 50%;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      opacity: 0.3;
    }
  }
}

.outfits-list {
  height: calc(100vh - 240rpx);
  padding: $spacing-base;
}

.outfit-cards {
  display: flex;
  flex-direction: column;
  gap: $spacing-lg;
}

.outfit-card {
  position: relative;
  width: 100%;
  height: 440rpx;
  border-radius: $border-radius-xl;
  overflow: hidden;
  box-shadow: $box-shadow-base;
  animation: slideUp 0.5s ease-out backwards;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:active {
    transform: scale(0.98);
  }

  .card-image-container {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }

  .outfit-image {
    width: 100%;
    height: 100%;
    transition: transform 0.6s ease;
  }

  .card-gradient {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 240rpx;
    background: linear-gradient(transparent, rgba(45, 42, 38, 0.8));
  }

  .outfit-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: $spacing-base;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;

    .outfit-info {
      flex: 1;
      padding-right: $spacing-base;

      .outfit-name {
        font-size: $font-size-lg;
        font-weight: 600;
        color: $white;
        display: block;
        margin-bottom: 6rpx;
        letter-spacing: -0.01em;
      }

      .outfit-desc {
        font-size: $font-size-sm;
        color: rgba(255, 255, 255, 0.8);
        display: block;
        margin-bottom: $spacing-sm;
        @include text-ellipsis(1);
        line-height: 1.4;
      }

      .outfit-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 8rpx;

        .tag {
          padding: 6rpx 16rpx;
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(8rpx);
          color: $white;
          border-radius: 16rpx;
          font-size: $font-size-xs;
          font-weight: 500;
          border: 1rpx solid rgba(255, 255, 255, 0.2);
        }
      }
    }

    .outfit-action {
      width: 64rpx;
      height: 64rpx;
      background: rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(8rpx);
      border-radius: 50%;
      @include flex-center;
      flex-shrink: 0;

      .action-icon {
        color: $white;
        font-size: 32rpx;
      }
    }
  }
}

.empty-state {
  @include flex-column;
  @include flex-center;
  padding: $spacing-xxl;

  .empty-illustration {
    width: 200rpx;
    height: 200rpx;
    margin-bottom: $spacing-lg;
    position: relative;

    .illustration-frame {
      width: 100%;
      height: 100%;
      position: relative;

      .frame-corner {
        position: absolute;
        width: 40rpx;
        height: 40rpx;
        border: 4rpx solid $primary-color;

        &.frame-tl {
          top: 0;
          left: 0;
          border-right: none;
          border-bottom: none;
        }
        &.frame-tr {
          top: 0;
          right: 0;
          border-left: none;
          border-bottom: none;
        }
        &.frame-bl {
          bottom: 0;
          left: 0;
          border-right: none;
          border-top: none;
        }
        &.frame-br {
          bottom: 0;
          right: 0;
          border-left: none;
          border-top: none;
        }
      }
    }
  }

  .empty-text {
    font-size: $font-size-lg;
    color: $secondary-color;
    margin-bottom: $spacing-xs;
    font-weight: 600;
  }

  .empty-hint {
    font-size: $font-size-sm;
    color: $text-placeholder;
  }
}

.loading-more {
  @include flex-center;
  padding: $spacing-lg;

  .loading-dots {
    display: flex;
    gap: 8rpx;

    .loading-dot {
      width: 12rpx;
      height: 12rpx;
      background: $primary-color;
      border-radius: 50%;
      animation: pulse 1.4s infinite ease-in-out both;

      &:nth-child(1) { animation-delay: -0.32s; }
      &:nth-child(2) { animation-delay: -0.16s; }
    }
  }
}

.create-btn {
  position: fixed;
  right: 40rpx;
  bottom: 160rpx;
  z-index: 100;

  .create-btn-inner {
    width: 112rpx;
    height: 112rpx;
    background: linear-gradient(135deg, $secondary-color 0%, #4A4540 100%);
    border-radius: 50%;
    @include flex-center;
    box-shadow: $box-shadow-dark;
    transition: transform 0.3s ease;

    &:active {
      transform: scale(0.9);
    }
  }

  .create-icon {
    font-size: 56rpx;
    color: $white;
    font-weight: 300;
  }
}
</style>
