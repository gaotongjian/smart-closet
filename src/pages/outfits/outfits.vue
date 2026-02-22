<template>
  <view class="outfits-page">
    <!-- 页面标题 -->
    <view class="page-header">
      <text class="page-title">搭配灵感</text>
      <text class="page-subtitle">记录你的穿搭美学</text>
    </view>

    <!-- 搭配列表 -->
    <scroll-view
      class="outfits-list"
      scroll-y
      @scrolltolower="loadMore"
    >
      <view class="outfit-cards">
        <view
          v-for="outfit in outfits"
          :key="outfit.id"
          class="outfit-card"
          @click="viewDetail(outfit)"
        >
          <image class="outfit-image" :src="outfit.image" mode="aspectFill" />
          <view class="outfit-overlay">
            <view class="outfit-info">
              <text class="outfit-name">{{ outfit.name }}</text>
              <text class="outfit-desc">{{ outfit.description }}</text>
              <view class="outfit-tags">
                <text v-for="tag in outfit.tags" :key="tag" class="tag">{{ tag }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>

      <view v-if="outfits.length === 0" class="empty-state">
        <text class="empty-icon">👗</text>
        <text class="empty-text">还没有搭配</text>
        <text class="empty-hint">创建你的第一个搭配吧</text>
      </view>

      <view v-if="isLoading" class="loading-more">
        <text>加载中...</text>
      </view>
    </scroll-view>

    <!-- 创建按钮 -->
    <view class="create-btn" @click="goToCreate">
      <text class="create-icon">+</text>
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
  background: $background-color;
  padding-bottom: 120rpx;
}

.page-header {
  padding: $spacing-base;
  background: linear-gradient(135deg, #FFF5F5 0%, #FFF 100%);

  .page-title {
    font-size: 40rpx;
    font-weight: 700;
    color: $text-color;
    display: block;
  }

  .page-subtitle {
    font-size: $font-size-sm;
    color: $text-secondary;
    margin-top: $spacing-xs;
    display: block;
  }
}

.outfits-list {
  height: calc(100vh - 200rpx);
  padding: $spacing-base;
}

.outfit-cards {
  display: flex;
  flex-direction: column;
  gap: $spacing-base;
}

.outfit-card {
  position: relative;
  width: 100%;
  height: 480rpx;
  border-radius: $border-radius-lg;
  overflow: hidden;
  box-shadow: $box-shadow-base;

  .outfit-image {
    width: 100%;
    height: 100%;
  }

  .outfit-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: $spacing-base;
    background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));

    .outfit-info {
      .outfit-name {
        font-size: $font-size-lg;
        font-weight: 600;
        color: $white;
        display: block;
        margin-bottom: 4rpx;
      }

      .outfit-desc {
        font-size: $font-size-sm;
        color: rgba(255, 255, 255, 0.8);
        display: block;
        margin-bottom: $spacing-sm;
        @include text-ellipsis(1);
      }

      .outfit-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 8rpx;

        .tag {
          padding: 4rpx 16rpx;
          background: rgba(255, 255, 255, 0.2);
          color: $white;
          border-radius: 20rpx;
          font-size: $font-size-xs;
        }
      }
    }
  }
}

.empty-state {
  @include flex-column;
  @include flex-center;
  padding: $spacing-xl * 2;

  .empty-icon {
    font-size: 120rpx;
    margin-bottom: $spacing-base;
  }

  .empty-text {
    font-size: $font-size-lg;
    color: $text-color;
    margin-bottom: $spacing-xs;
  }

  .empty-hint {
    font-size: $font-size-sm;
    color: $text-placeholder;
  }
}

.loading-more {
  @include flex-center;
  padding: $spacing-base;
  color: $text-secondary;
}

.create-btn {
  position: fixed;
  right: 32rpx;
  bottom: 160rpx;
  width: 112rpx;
  height: 112rpx;
  background: linear-gradient(135deg, $secondary-color 0%, #FFB899 100%);
  border-radius: 50%;
  @include flex-center;
  box-shadow: 0 8rpx 24rpx rgba(255, 159, 127, 0.4);

  .create-icon {
    font-size: 56rpx;
    color: $white;
    font-weight: 300;
  }
}
</style>
