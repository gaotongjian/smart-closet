<template>
  <view class="weather-widget">
    <view class="weather-main">
      <view class="weather-left">
        <text class="location">{{ location }}</text>
        <text class="temperature">{{ weather?.temp || '--' }}°</text>
        <text class="condition">{{ weather?.condition || '加载中' }}</text>
      </view>
      <view class="weather-right">
        <text class="weather-icon">{{ getWeatherIcon(weather?.conditionIcon) }}</text>
      </view>
    </view>
    <view class="weather-details">
      <view class="detail-item">
        <text class="detail-label">湿度</text>
        <text class="detail-value">{{ weather?.humidity || '--' }}%</text>
      </view>
      <view class="detail-item">
        <text class="detail-label">风速</text>
        <text class="detail-value">{{ weather?.windSpeed || '--' }}km/h</text>
      </view>
      <view class="detail-item">
        <text class="detail-label">空气质量</text>
        <text class="detail-value aqi" :class="'aqi-' + (weather?.aqiLevel || '优')">{{ weather?.aqiLevel || '--' }}</text>
      </view>
    </view>
    <view class="weather-suggestion" v-if="weather?.dressSuggestion">
      <text class="suggestion-label">穿搭建议</text>
      <text class="suggestion-text">{{ weather.dressSuggestion }}</text>
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
  background: linear-gradient(135deg, #5B9FFF 0%, #7EB3FF 100%);
  border-radius: 0 0 40rpx 40rpx;
  padding: $spacing-lg $spacing-base;
  color: $white;
}

.weather-main {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: $spacing-base;
}

.weather-left {
  .location {
    font-size: $font-size-lg;
    font-weight: 500;
    display: block;
    margin-bottom: $spacing-xs;
  }

  .temperature {
    font-size: 80rpx;
    font-weight: 300;
    display: block;
    line-height: 1;
  }

  .condition {
    font-size: $font-size-base;
    opacity: 0.9;
    display: block;
    margin-top: $spacing-xs;
  }
}

.weather-right {
  .weather-icon {
    font-size: 120rpx;
  }
}

.weather-details {
  display: flex;
  justify-content: space-between;
  padding: $spacing-sm 0;
  border-top: 1rpx solid rgba(255, 255, 255, 0.2);
  border-bottom: 1rpx solid rgba(255, 255, 255, 0.2);
  margin-bottom: $spacing-sm;
}

.detail-item {
  @include flex-column;
  @include flex-center;
  flex: 1;

  .detail-label {
    font-size: $font-size-xs;
    opacity: 0.8;
    margin-bottom: 4rpx;
  }

  .detail-value {
    font-size: $font-size-base;
    font-weight: 500;

    &.aqi {
      padding: 2rpx 12rpx;
      border-radius: 12rpx;
      font-size: $font-size-xs;
    }

    &.aqi-优 {
      background: rgba(82, 196, 26, 0.3);
    }

    &.aqi-良 {
      background: rgba(250, 173, 20, 0.3);
    }
  }
}

.weather-suggestion {
  .suggestion-label {
    font-size: $font-size-sm;
    opacity: 0.8;
    display: block;
    margin-bottom: 4rpx;
  }

  .suggestion-text {
    font-size: $font-size-base;
    opacity: 0.95;
  }
}
</style>
