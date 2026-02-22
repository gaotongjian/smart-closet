<template>
  <scroll-view class="category-filter" scroll-x enhanced :show-scrollbar="false">
    <view class="filter-list">
      <view
        v-for="category in categories"
        :key="category.id"
        class="filter-item"
        :class="{ active: activeCategory === category.id }"
        @click="handleClick(category.id)"
      >
        <text class="filter-text">{{ category.name }}</text>
      </view>
    </view>
  </scroll-view>
</template>

<script setup>
const props = defineProps({
  categories: {
    type: Array,
    default: () => []
  },
  activeCategory: {
    type: String,
    default: 'all'
  }
})

const emit = defineEmits(['change'])

const handleClick = (categoryId) => {
  emit('change', categoryId)
}
</script>

<style lang="scss" scoped>
.category-filter {
  background: $white;
  padding: $spacing-sm 0;
}

.filter-list {
  display: flex;
  padding: 0 $spacing-base;
  gap: $spacing-sm;
}

.filter-item {
  flex-shrink: 0;
  padding: 12rpx 24rpx;
  background: #F0F2F5;
  border-radius: 32rpx;
  transition: all 0.3s ease;

  .filter-text {
    font-size: $font-size-sm;
    color: $text-secondary;
    white-space: nowrap;
  }

  &.active {
    background: $primary-color;

    .filter-text {
      color: $white;
      font-weight: 500;
    }
  }
}
</style>
