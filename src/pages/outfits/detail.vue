<template>
  <view class="detail-page">
    <image class="detail-image" :src="outfit?.image" mode="aspectFill" />
    <view class="detail-content">
      <text class="detail-name">{{ outfit?.name }}</text>
      <text class="detail-desc">{{ outfit?.description }}</text>
      <view class="detail-tags">
        <text v-for="tag in outfit?.tags" :key="tag" class="tag">{{ tag }}</text>
      </view>
      <view class="detail-items" v-if="outfit?.items?.length">
        <text class="items-title">包含衣物</text>
        <view class="items-list">
          <view v-for="item in outfit.items" :key="item.id" class="item-card">
            <image class="item-image" :src="item.image" mode="aspectFill" />
            <text class="item-name">{{ item.name }}</text>
          </view>
        </view>
      </view>
      <view class="detail-actions">
        <button class="btn-wear" @click="logWear">记录穿搭</button>
        <button class="btn-edit" @click="editOutfit">编辑</button>
        <button class="btn-delete" @click="deleteOutfit">删除</button>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onLoad } from '@dcloudio/uni-app'
import { useOutfitStore } from '@/stores/outfit'

const outfitStore = useOutfitStore()
const outfit = ref(null)

onLoad((options) => {
  const id = options.id
  outfit.value = outfitStore.getOutfitById(id)
})

const logWear = () => {
  uni.showToast({ title: '已记录今日穿搭', icon: 'success' })
}

const editOutfit = () => {
  uni.navigateTo({
    url: `/pages/outfits/create?id=${outfit.value.id}`
  })
}

const deleteOutfit = () => {
  uni.showModal({
    title: '确认删除',
    content: '确定要删除这个搭配吗？',
    success: (res) => {
      if (res.confirm) {
        outfitStore.deleteOutfit(outfit.value.id)
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
  padding-bottom: 200rpx;
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

.detail-desc {
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

.detail-items {
  margin-bottom: $spacing-lg;

  .items-title {
    font-size: $font-size-base;
    font-weight: 500;
    display: block;
    margin-bottom: $spacing-sm;
  }

  .items-list {
    display: flex;
    gap: $spacing-sm;
    overflow-x: scroll;
  }

  .item-card {
    flex-shrink: 0;
    width: 160rpx;

    .item-image {
      width: 160rpx;
      height: 160rpx;
      border-radius: $border-radius-base;
      margin-bottom: 4rpx;
    }

    .item-name {
      font-size: $font-size-xs;
      color: $text-secondary;
      display: block;
      @include text-ellipsis(1);
    }
  }
}

.detail-actions {
  display: flex;
  gap: $spacing-base;

  .btn-wear, .btn-edit, .btn-delete {
    flex: 1;
    height: 80rpx;
    border-radius: $border-radius-base;
    font-size: $font-size-base;
  }

  .btn-wear {
    background: $secondary-color;
    color: $white;
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
