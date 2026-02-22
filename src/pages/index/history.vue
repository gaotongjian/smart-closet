<template>
  <view class="history-page">
    <view class="calendar-section">
      <view class="calendar-header">
        <text class="month-text">{{ currentMonth }}</text>
        <view class="month-nav">
          <text class="nav-btn" @click="prevMonth">&lt;</text>
          <text class="nav-btn" @click="nextMonth">&gt;</text>
        </view>
      </view>
      <view class="calendar-weekdays">
        <text v-for="day in weekdays" :key="day" class="weekday">{{ day }}</text>
      </view>
      <view class="calendar-days">
        <view
          v-for="day in calendarDays"
          :key="day.date"
          class="day-cell"
          :class="{ 'has-record': day.hasRecord, 'today': day.isToday }"
          @click="selectDate(day)"
        >
          <text class="day-text">{{ day.day }}</text>
        </view>
      </view>
    </view>

    <view class="records-section">
      <text class="section-title">{{ selectedDate }} 穿搭记录</text>
      <view v-if="selectedRecords.length > 0" class="records-list">
        <view v-for="record in selectedRecords" :key="record.id" class="record-card">
          <image class="record-image" :src="record.image" mode="aspectFill" />
          <view class="record-info">
            <text class="record-name">{{ record.name }}</text>
            <text class="record-time">{{ record.time }}</text>
          </view>
        </view>
      </view>
      <view v-else class="empty-state">
        <text class="empty-text">暂无记录</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'

const currentDate = ref(new Date())
const selectedDateRecord = ref(null)

const weekdays = ['日', '一', '二', '三', '四', '五', '六']

const currentMonth = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth() + 1
  return `${year}年${month}月`
})

const selectedDate = computed(() => {
  if (!selectedDateRecord.value) return '请选择日期'
  const date = new Date(selectedDateRecord.value)
  return `${date.getMonth() + 1}月${date.getDate()}日`
})

const calendarDays = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const days = []
  const today = new Date()

  // 添加空白天数
  for (let i = 0; i < firstDay.getDay(); i++) {
    days.push({ day: '', date: '', hasRecord: false })
  }

  // 添加实际天数
  for (let i = 1; i <= lastDay.getDate(); i++) {
    const date = new Date(year, month, i)
    const dateStr = date.toISOString().split('T')[0]
    const isToday = date.toDateString() === today.toDateString()

    days.push({
      day: i,
      date: dateStr,
      hasRecord: Math.random() > 0.7, // 模拟有记录
      isToday
    })
  }

  return days
})

const selectedRecords = ref([
  {
    id: '1',
    image: 'https://picsum.photos/200/300',
    name: '休闲搭配',
    time: '08:30'
  }
])

const prevMonth = () => {
  currentDate.value = new Date(
    currentDate.value.getFullYear(),
    currentDate.value.getMonth() - 1,
    1
  )
}

const nextMonth = () => {
  currentDate.value = new Date(
    currentDate.value.getFullYear(),
    currentDate.value.getMonth() + 1,
    1
  )
}

const selectDate = (day) => {
  if (!day.date) return
  selectedDateRecord.value = day.date
}
</script>

<style lang="scss" scoped>
.history-page {
  min-height: 100vh;
  background: $background-color;
}

.calendar-section {
  background: $white;
  padding: $spacing-base;
}

.calendar-header {
  @include flex-between;
  margin-bottom: $spacing-base;

  .month-text {
    font-size: $font-size-lg;
    font-weight: 600;
  }

  .month-nav {
    .nav-btn {
      display: inline-block;
      padding: 8rpx 24rpx;
      font-size: $font-size-lg;
      color: $primary-color;
    }
  }
}

.calendar-weekdays {
  display: flex;
  margin-bottom: $spacing-sm;

  .weekday {
    flex: 1;
    text-align: center;
    font-size: $font-size-sm;
    color: $text-secondary;
  }
}

.calendar-days {
  display: flex;
  flex-wrap: wrap;

  .day-cell {
    width: calc(100% / 7);
    height: 80rpx;
    @include flex-center;

    .day-text {
      font-size: $font-size-base;
      color: $text-color;
    }

    &.has-record {
      .day-text {
        background: $primary-color;
        color: $white;
        width: 56rpx;
        height: 56rpx;
        border-radius: 50%;
        @include flex-center;
      }
    }

    &.today {
      .day-text {
        border: 2rpx solid $primary-color;
        border-radius: 50%;
      }
    }
  }
}

.records-section {
  padding: $spacing-base;

  .section-title {
    font-size: $font-size-lg;
    font-weight: 600;
    display: block;
    margin-bottom: $spacing-base;
  }
}

.records-list {
  .record-card {
    display: flex;
    background: $white;
    border-radius: $border-radius-base;
    overflow: hidden;
    margin-bottom: $spacing-sm;

    .record-image {
      width: 160rpx;
      height: 160rpx;
    }

    .record-info {
      flex: 1;
      padding: $spacing-base;
      @include flex-column;
      justify-content: center;

      .record-name {
        font-size: $font-size-base;
        font-weight: 500;
        display: block;
        margin-bottom: 4rpx;
      }

      .record-time {
        font-size: $font-size-sm;
        color: $text-secondary;
      }
    }
  }
}

.empty-state {
  @include flex-center;
  padding: $spacing-xl;

  .empty-text {
    color: $text-placeholder;
  }
}
</style>
