<template>
  <view class="index-page">
    <!-- 天气组件 -->
    <WeatherWidget :weather="weather" :location="location" />

    <!-- 今日推荐 -->
    <view class="recommend-section">
      <view class="section-header">
        <text class="section-title">今日推荐</text>
        <text class="section-subtitle">根据天气智能推荐</text>
      </view>

      <view v-if="recommendedOutfit" class="recommend-card" @click="viewDetail">
        <image class="recommend-image" :src="recommendedOutfit.image" mode="aspectFill" />
        <view class="recommend-info">
          <text class="recommend-title">{{ recommendedOutfit.name }}</text>
          <text class="recommend-desc">{{ recommendedOutfit.description }}</text>
          <view class="recommend-tags">
            <text v-for="tag in recommendedOutfit.tags" :key="tag" class="tag">{{ tag }}</text>
          </view>
        </view>
      </view>

      <view v-else class="empty-state">
        <text class="empty-text">添加衣物后开启智能推荐</text>
        <button class="btn-add" @click="goToWardrobe">去添加</button>
      </view>
    </view>

    <!-- 随机穿搭 -->
    <view class="random-section">
      <button class="btn-random" @click="randomOutfit">
        <text>🎲 随机穿搭</text>
      </button>
    </view>

    <!-- 快捷操作 -->
    <view class="quick-actions">
      <view class="action-item" @click="logTodayWear">
        <text class="action-icon">📝</text>
        <text class="action-text">记录今日穿搭</text>
      </view>
      <view class="action-item" @click="goToHistory">
        <text class="action-icon">📅</text>
        <text class="action-text">历史穿搭</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import WeatherWidget from '@/components/weather-widget/weather-widget.vue'
import { useWeatherStore } from '@/stores/weather'
import { useOutfitStore } from '@/stores/outfit'

const weatherStore = useWeatherStore()
const outfitStore = useOutfitStore()

const weather = ref(null)
const location = ref('北京')
const recommendedOutfit = ref(null)

onMounted(async () => {
  // 初始化天气数据
  await weatherStore.fetchWeather(location.value)
  weather.value = weatherStore.weather

  // 获取推荐穿搭
  recommendedOutfit.value = outfitStore.getRecommended()
})

const viewDetail = () => {
  uni.navigateTo({
    url: '/pages/outfits/detail?id=' + recommendedOutfit.value?.id
  })
}

const goToWardrobe = () => {
  uni.switchTab({
    url: '/pages/wardrobe/wardrobe'
  })
}

const randomOutfit = () => {
  const random = outfitStore.getRandom()
  if (random) {
    recommendedOutfit.value = random
  } else {
    uni.showToast({
      title: '暂无搭配',
      icon: 'none'
    })
  }
}

const logTodayWear = () => {
  uni.navigateTo({
    url: '/pages/outfits/create'
  })
}

const goToHistory = () => {
  uni.navigateTo({
    url: '/pages/index/history'
  })
}
</script>

<style lang="scss" scoped>
.index-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #E8F4FF 0%, #F5F5F5 100%);
  padding: 0 0 120rpx 0;
}

.recommend-section {
  padding: $spacing-base;
}

.section-header {
  margin-bottom: $spacing-base;
}

.section-title {
  font-size: $font-size-lg;
  font-weight: 600;
  color: $text-color;
  display: block;
}

.section-subtitle {
  font-size: $font-size-sm;
  color: $text-secondary;
}

.recommend-card {
  @include card-style;
  overflow: hidden;
  margin-top: $spacing-base;

  .recommend-image {
    width: 100%;
    height: 400rpx;
    border-radius: $border-radius-base $border-radius-base 0 0;
  }

  .recommend-info {
    padding: $spacing-base;
  }

  .recommend-title {
    font-size: $font-size-lg;
    font-weight: 600;
    color: $text-color;
    display: block;
    margin-bottom: $spacing-xs;
  }

  .recommend-desc {
    font-size: $font-size-sm;
    color: $text-secondary;
    display: block;
    margin-bottom: $spacing-sm;
  }

  .recommend-tags {
    display: flex;
    flex-wrap: wrap;
    gap: $spacing-xs;

    .tag {
      padding: 4rpx 16rpx;
      background: #EEF2FF;
      color: $primary-color;
      border-radius: 20rpx;
      font-size: $font-size-xs;
    }
  }
}

.empty-state {
  @include card-style;
  @include flex-column;
  @include flex-center;
  padding: $spacing-xl;
  margin-top: $spacing-base;

  .empty-text {
    color: $text-placeholder;
    margin-bottom: $spacing-base;
  }

  .btn-add {
    background: $primary-color;
    color: $white;
    padding: 16rpx 48rpx;
    border-radius: $border-radius-lg;
    font-size: $font-size-base;
  }
}

.random-section {
  padding: 0 $spacing-base;
  margin-top: $spacing-base;

  .btn-random {
    @include flex-center;
    width: 100%;
    height: 96rpx;
    background: linear-gradient(135deg, $primary-color 0%, #7B9EFF 100%);
    color: $white;
    border-radius: $border-radius-lg;
    font-size: $font-size-lg;
    font-weight: 500;
    box-shadow: 0 8rpx 24rpx rgba(91, 127, 255, 0.3);
  }
}

.quick-actions {
  display: flex;
  justify-content: space-around;
  padding: $spacing-lg $spacing-base;
  margin-top: $spacing-base;

  .action-item {
    @include flex-column;
    @include flex-center;

    .action-icon {
      font-size: 48rpx;
      margin-bottom: $spacing-xs;
    }

    .action-text {
      font-size: $font-size-sm;
      color: $text-secondary;
    }
  }
}
</style>
