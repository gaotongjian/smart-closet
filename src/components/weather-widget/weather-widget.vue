<template>
  <view class="weather-widget">
    <!-- 背景装饰 -->
    <view class="widget-bg">
      <view class="bg-blob bg-blob-1"></view>
      <view class="bg-blob bg-blob-2"></view>
    </view>

    <view class="weather-content">
      <view class="weather-main">
        <view class="weather-left">
          <view class="location-wrap">
            <text class="location-icon">📍</text>
            <text class="location">{{ location }}</text>
          </view>
          <view class="temperature-wrap">
            <text class="temperature">{{ weather?.temp || '--' }}</text>
            <text class="temperature-unit">°</text>
          </view>
          <text class="condition">{{ weather?.condition || '加载中' }}</text>
        </view>
        <view class="weather-right">
          <text class="weather-icon">{{ getWeatherIcon(weather?.conditionIcon) }}</text>
        </view>
      </view>

      <view class="weather-details">
        <view class="detail-item">
          <text class="detail-icon">💧</text>
          <text class="detail-label">湿度</text>
          <text class="detail-value">{{ weather?.humidity || '--' }}%</text>
        </view>
        <view class="detail-item">
          <text class="detail-icon">💨</text>
          <text class="detail-label">风速</text>
          <text class="detail-value">{{ weather?.windSpeed || '--' }}km/h</text>
        </view>
        <view class="detail-item">
          <text class="detail-icon">🌬️</text>
          <text class="detail-label">空气质量</text>
          <text class="detail-value aqi" :class="'aqi-' + (weather?.aqiLevel || '优')">{{ weather?.aqiLevel || '--' }}</text>
        </view>
      </view>

      <view class="weather-suggestion" v-if="weather?.dressSuggestion">
        <view class="suggestion-tag">💡 穿搭建议</view>
        <text class="suggestion-text">{{ weather.dressSuggestion }}</text>
      </view>
    </view>
  </view>
</template>

<script setup>
const props = defineProps({
  weather: {
    type: Object,
    default: () => null
  },
  location: {
    type: String,
    default: '北京'
  }
})

const getWeatherIcon = (condition) => {
  const iconMap = {
    sunny: '☀️',
    cloudy: '⛅',
    rain: '🌧️',
    thunder: '⛈️',
    snow: '❄️',
    fog: '🌫️'
  }
  return iconMap[condition] || '☀️'
}
</script>

<style lang="scss" scoped>
.weather-widget {
  position: relative;
  background: linear-gradient(135deg, $secondary-color 0%, #4A4540 100%);
  border-radius: 0 0 48rpx 48rpx;
  padding: $spacing-lg $spacing-base;
  padding-top: $spacing-xl;
  color: $white;
  overflow: hidden;
}

.widget-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;

  .bg-blob {
    position: absolute;
    border-radius: 50%;
    opacity: 0.1;

    &-1 {
      width: 200rpx;
      height: 200rpx;
      background: $primary-color;
      top: -50rpx;
      right: -30rpx;
    }

    &-2 {
      width: 120rpx;
      height: 120rpx;
      background: #fff;
      bottom: 20rpx;
      left: -30rpx;
    }
  }
}

.weather-content {
  position: relative;
  z-index: 1;
}

.weather-main {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: $spacing-base;
}

.weather-left {
  .location-wrap {
    display: flex;
    align-items: center;
    margin-bottom: $spacing-xs;

    .location-icon {
      font-size: 24rpx;
      margin-right: 4rpx;
    }

    .location {
      font-size: $font-size-lg;
      font-weight: 500;
    }
  }

  .temperature-wrap {
    display: flex;
    align-items: flex-start;
    line-height: 1;

    .temperature {
      font-size: 96rpx;
      font-weight: 200;
      letter-spacing: -0.04em;
    }

    .temperature-unit {
      font-size: 40rpx;
      font-weight: 300;
      margin-top: 8rpx;
    }
  }

  .condition {
    font-size: $font-size-base;
    opacity: 0.9;
    display: block;
    margin-top: $spacing-xs;
    font-weight: 400;
  }
}

.weather-right {
  .weather-icon {
    font-size: 120rpx;
    filter: drop-shadow(0 4rpx 8rpx rgba(0, 0, 0, 0.1));
  }
}

.weather-details {
  display: flex;
  justify-content: space-between;
  padding: $spacing-sm 0;
  background: rgba(255, 255, 255, 0.08);
  border-radius: $border-radius-base;
  margin-bottom: $spacing-sm;
}

.detail-item {
  @include flex-column;
  @include flex-center;
  flex: 1;
  padding: $spacing-xs 0;

  .detail-icon {
    font-size: 28rpx;
    margin-bottom: 4rpx;
  }

  .detail-label {
    font-size: 20rpx;
    opacity: 0.7;
    margin-bottom: 2rpx;
  }

  .detail-value {
    font-size: $font-size-sm;
    font-weight: 500;

    &.aqi {
      padding: 2rpx 10rpx;
      border-radius: 10rpx;
      font-size: 20rpx;
    }

    &.aqi-优 {
      background: rgba(123, 158, 107, 0.4);
    }

    &.aqi-良 {
      background: rgba(212, 165, 116, 0.4);
    }
  }
}

.weather-suggestion {
  background: rgba(255, 255, 255, 0.08);
  border-radius: $border-radius-base;
  padding: $spacing-sm;

  .suggestion-tag {
    font-size: $font-size-xs;
    opacity: 0.8;
    margin-bottom: 4rpx;
  }

  .suggestion-text {
    font-size: $font-size-sm;
    opacity: 0.95;
    line-height: 1.5;
  }
}
</style>
