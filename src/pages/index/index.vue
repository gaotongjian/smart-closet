<template>
  <view class="index-page">
    <!-- 顶部装饰 -->
    <view class="page-decoration">
      <view class="decoration-circle decoration-circle-1"></view>
      <view class="decoration-circle decoration-circle-2"></view>
    </view>

    <!-- 天气组件 -->
    <WeatherWidget :weather="weather" :location="location" />

    <!-- 今日推荐 -->
    <view class="recommend-section">
      <view class="section-header">
        <view class="section-title-wrap">
          <text class="section-title">今日推荐</text>
          <view class="title-line"></view>
        </view>
        <text class="section-subtitle">根据天气与心情智能搭配</text>
      </view>

      <view v-if="recommendedOutfit" class="recommend-card" @click="viewDetail">
        <view class="card-image-wrap">
          <image class="recommend-image" :src="recommendedOutfit.image" mode="aspectFill" />
          <view class="card-shine"></view>
        </view>
        <view class="recommend-info">
          <text class="recommend-title">{{ recommendedOutfit.name }}</text>
          <text class="recommend-desc">{{ recommendedOutfit.description }}</text>
          <view class="recommend-tags">
            <text v-for="tag in recommendedOutfit.tags" :key="tag" class="tag">{{ tag }}</text>
          </view>
        </view>
      </view>

      <view v-else class="empty-state">
        <view class="empty-illustration">
          <view class="illustration-hanger"></view>
          <view class="illustration-line"></view>
        </view>
        <text class="empty-text">添加衣物，开启智能推荐</text>
        <button class="btn-add" @click="goToWardrobe">开始添加</button>
      </view>
    </view>

    <!-- 随机穿搭 -->
    <view class="random-section">
      <button class="btn-random" @click="randomOutfit">
        <text class="random-icon">✨</text>
        <text class="random-text">今日心情穿搭</text>
      </button>
    </view>

    <!-- 快捷操作 -->
    <view class="quick-actions">
      <view class="action-item" @click="logTodayWear">
        <view class="action-icon-wrap">
          <text class="action-icon">📝</text>
        </view>
        <text class="action-text">记录今日</text>
      </view>
      <view class="action-item" @click="goToHistory">
        <view class="action-icon-wrap">
          <text class="action-icon">📅</text>
        </view>
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
    uni.showToast({
      title: '发现一套好搭配',
      icon: 'none'
    })
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
  background: linear-gradient(180deg, #FAF8F5 0%, #F5F2EE 100%);
  padding: 0 0 120rpx 0;
  position: relative;
  overflow: hidden;
}

/* 页面装饰 */
.page-decoration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 400rpx;
  pointer-events: none;
  overflow: hidden;
}

.decoration-circle {
  position: absolute;
  border-radius: 50%;

  &-1 {
    width: 400rpx;
    height: 400rpx;
    background: linear-gradient(135deg, rgba(201, 168, 108, 0.15), rgba(201, 168, 108, 0.05));
    top: -150rpx;
    right: -100rpx;
  }

  &-2 {
    width: 200rpx;
    height: 200rpx;
    background: linear-gradient(135deg, rgba(139, 105, 20, 0.1), rgba(139, 105, 20, 0.02));
    top: 50rpx;
    left: -50rpx;
  }
}

.recommend-section {
  padding: $spacing-base;
  position: relative;
  z-index: 1;
}

.section-header {
  margin-bottom: $spacing-lg;
}

.section-title-wrap {
  position: relative;
  display: inline-block;
}

.section-title {
  font-size: $font-size-xxl;
  font-weight: 700;
  color: $secondary-color;
  display: block;
  letter-spacing: -0.02em;
}

.title-line {
  width: 80rpx;
  height: 6rpx;
  background: linear-gradient(90deg, $primary-color, $primary-light);
  border-radius: 3rpx;
  margin-top: 8rpx;
}

.section-subtitle {
  font-size: $font-size-sm;
  color: $text-secondary;
  margin-top: $spacing-xs;
  display: block;
}

.recommend-card {
  @include card-style;
  overflow: hidden;
  margin-top: $spacing-base;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:active {
    transform: scale(0.98);
  }

  .card-image-wrap {
    position: relative;
    overflow: hidden;
  }

  .recommend-image {
    width: 100%;
    height: 380rpx;
    border-radius: $border-radius-lg $border-radius-lg 0 0;
    transition: transform 0.5s ease;
  }

  .card-shine {
    position: absolute;
    top: 0;
    left: -100%;
    width: 50%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    transform: skewX(-20deg);
    animation: shine 3s infinite;
  }

  .recommend-info {
    padding: $spacing-base;
    background: $white;
  }

  .recommend-title {
    font-size: $font-size-lg;
    font-weight: 600;
    color: $secondary-color;
    display: block;
    margin-bottom: $spacing-xs;
    letter-spacing: -0.01em;
  }

  .recommend-desc {
    font-size: $font-size-sm;
    color: $text-secondary;
    display: block;
    margin-bottom: $spacing-sm;
    line-height: 1.5;
  }

  .recommend-tags {
    display: flex;
    flex-wrap: wrap;
    gap: $spacing-xs;

    .tag {
      padding: 6rpx 20rpx;
      background: linear-gradient(135deg, $primary-light, rgba(201, 168, 108, 0.2));
      color: $primary-dark;
      border-radius: 20rpx;
      font-size: $font-size-xs;
      font-weight: 500;
    }
  }
}

@keyframes shine {
  0% {
    left: -100%;
  }
  50%, 100% {
    left: 200%;
  }
}

.empty-state {
  @include card-style;
  @include flex-column;
  @include flex-center;
  padding: $spacing-xxl $spacing-base;
  margin-top: $spacing-base;
  background: linear-gradient(135deg, $white, #FAF8F5);

  .empty-illustration {
    width: 160rpx;
    height: 160rpx;
    margin-bottom: $spacing-lg;
    position: relative;

    .illustration-hanger {
      width: 80rpx;
      height: 80rpx;
      border: 6rpx solid $primary-light;
      border-radius: 50%;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }

    .illustration-line {
      width: 4rpx;
      height: 60rpx;
      background: $primary-color;
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
    }
  }

  .empty-text {
    color: $text-secondary;
    margin-bottom: $spacing-lg;
    font-size: $font-size-base;
  }

  .btn-add {
    background: linear-gradient(135deg, $primary-color 0%, $primary-dark 100%);
    color: $white;
    padding: 20rpx 56rpx;
    border-radius: $border-radius-xl;
    font-size: $font-size-base;
    font-weight: 500;
    box-shadow: $box-shadow-glow;
    border: none;
  }
}

.random-section {
  padding: 0 $spacing-base;
  margin-top: $spacing-lg;

  .btn-random {
    @include flex-center;
    width: 100%;
    height: 100rpx;
    background: linear-gradient(135deg, $secondary-color 0%, #4A4540 100%);
    color: $white;
    border-radius: $border-radius-xl;
    font-size: $font-size-base;
    font-weight: 500;
    box-shadow: $box-shadow-dark;
    border: none;

    .random-icon {
      font-size: 36rpx;
      margin-right: $spacing-sm;
    }

    .random-text {
      letter-spacing: 0.1em;
    }
  }
}

.quick-actions {
  display: flex;
  justify-content: center;
  padding: $spacing-lg $spacing-base;
  margin-top: $spacing-base;
  gap: $spacing-xl;

  .action-item {
    @include flex-column;
    @include flex-center;
    flex: 1;
    max-width: 240rpx;

    .action-icon-wrap {
      width: 100rpx;
      height: 100rpx;
      background: $white;
      border-radius: $border-radius-lg;
      @include flex-center;
      margin-bottom: $spacing-sm;
      box-shadow: $box-shadow-light;
      transition: transform 0.2s ease, box-shadow 0.2s ease;

      &:active {
        transform: scale(0.95);
        box-shadow: $box-shadow-base;
      }
    }

    .action-icon {
      font-size: 44rpx;
    }

    .action-text {
      font-size: $font-size-sm;
      color: $text-secondary;
      font-weight: 500;
    }
  }
}
</style>
