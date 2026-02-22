<template>
  <view class="detail-page">
    <image class="detail-image" :src="item?.image" mode="aspectFill" />
    <view class="detail-content">
      <text class="detail-name">{{ item?.name }}</text>
      <text class="detail-category">{{ item?.categoryName }}</text>
      <view class="detail-tags">
        <text v-for="tag in item?.tags" :key="tag" class="tag">{{ tag }}</text>
      </view>
      <view class="detail-actions">
        <button class="btn-edit" @click="editItem">编辑</button>
        <button class="btn-delete" @click="deleteItem">删除</button>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onLoad } from '@dcloudio/uni-app'
import { useWardrobeStore } from '@/stores/wardrobe'

const wardrobeStore = useWardrobeStore()
const item = ref(null)

onLoad((options) => {
  const id = options.id
  item.value = wardrobeStore.getItemById(id)
})

const editItem = () => {
  uni.navigateTo({
    url: `/pages/wardrobe/add?id=${item.value.id}`
  })
}

const deleteItem = () => {
  uni.showModal({
    title: '确认删除',
    content: '确定要删除这件衣物吗？',
    success: (res) => {
      if (res.confirm) {
        wardrobeStore.deleteItem(item.value.id)
        uni.navigateBack()
      }
    }
  })
}
</script>

<style lang="scss" scoped>
.detail-page {
  min-height: 100vh;
  background: $background-color;
}

.detail-image {
  width: 100%;
  height: 600rpx;
}

.detail-content {
  padding: $spacing-base;
}

.detail-name {
  font-size: $font-size-xl;
  font-weight: 600;
  display: block;
  margin-bottom: $spacing-xs;
}

.detail-category {
  font-size: $font-size-base;
  color: $text-secondary;
  display: block;
  margin-bottom: $spacing-base;
}

.detail-tags {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-sm;
  margin-bottom: $spacing-lg;

  .tag {
    padding: 8rpx 16rpx;
    background: #F0F2F5;
    color: $text-secondary;
    border-radius: 8rpx;
    font-size: $font-size-sm;
  }
}

.detail-actions {
  display: flex;
  gap: $spacing-base;

  .btn-edit, .btn-delete {
    flex: 1;
    height: 80rpx;
    border-radius: $border-radius-base;
    font-size: $font-size-base;
  }

  .btn-edit {
    background: $primary-color;
    color: $white;
  }

  .btn-delete {
    background: $white;
    color: $error-color;
    border: 2rpx solid $error-color;
  }
}
</style>
