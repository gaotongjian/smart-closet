<template>
  <view class="detail-page">
    <image class="detail-image" :src="item?.image" mode="aspectFill" />

    <view class="detail-content">
      <text class="detail-name">{{ item?.name }}</text>
      <text class="detail-category">{{ item?.categoryName }}</text>

      <!-- 颜色 -->
      <view v-if="item?.colorName" class="detail-row">
        <text class="detail-label">颜色</text>
        <view class="color-display">
          <view
            class="color-dot"
            :style="{ backgroundColor: getColorHex(item?.color) }"
          ></view>
          <text class="color-name">{{ item?.colorName }}</text>
        </view>
      </view>

      <!-- 季节 -->
      <view v-if="item?.seasons?.length" class="detail-row">
        <text class="detail-label">季节</text>
        <view class="tag-list">
          <text v-for="season in getSeasonNames(item?.seasons)" :key="season" class="tag">
            {{ season }}
          </text>
        </view>
      </view>

      <!-- 场合 -->
      <view v-if="item?.occasions?.length" class="detail-row">
        <text class="detail-label">场合</text>
        <view class="tag-list">
          <text v-for="occasion in getOccasionNames(item?.occasions)" :key="occasion" class="tag">
            {{ occasion }}
          </text>
        </view>
      </view>

      <!-- 品牌 -->
      <view v-if="item?.brand" class="detail-row">
        <text class="detail-label">品牌</text>
        <text class="detail-value">{{ item?.brand }}</text>
      </view>

      <!-- 备注 -->
      <view v-if="item?.remark" class="detail-row">
        <text class="detail-label">备注</text>
        <text class="detail-value remark">{{ item?.remark }}</text>
      </view>

      <!-- 添加时间 -->
      <view class="detail-row">
        <text class="detail-label">添加时间</text>
        <text class="detail-value">{{ formatDate(item?.createdAt) }}</text>
      </view>

      <view class="detail-actions">
        <button class="btn-edit" @click="editItem">编辑</button>
        <button class="btn-delete" @click="deleteItem">删除</button>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from '@dcloudio/uni-app'
import { useWardrobeStore } from '@/stores/wardrobe'
import { getColorTags, getSeasonTags, getOccasionTags } from '@/services/tagService'

const wardrobeStore = useWardrobeStore()
const item = ref(null)

const colorTags = getColorTags()
const seasonTags = getSeasonTags()
const occasionTags = getOccasionTags()

onMounted(() => {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  const options = currentPage.options || (uni.$t && uni.$t.options) || {}
  const id = options.id

  if (id) {
    item.value = wardrobeStore.getItemById(id)
  }
})

const getColorHex = (colorId) => {
  if (!colorId) return '#CCCCCC'
  const color = colorTags.find(c => c.id === colorId)
  return color?.hex || '#CCCCCC'
}

const getSeasonNames = (seasonIds) => {
  if (!seasonIds) return []
  return seasonIds.map(id => {
    const season = seasonTags.find(s => s.id === id)
    return season?.name || id
  })
}

const getOccasionNames = (occasionIds) => {
  if (!occasionIds) return []
  return occasionIds.map(id => {
    const occasion = occasionTags.find(o => o.id === id)
    return occasion?.name || id
  })
}

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

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
        uni.showToast({ title: '删除成功', icon: 'success' })
        setTimeout(() => {
          uni.navigateBack()
        }, 1000)
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
  font-size: $font-size-xxl;
  font-weight: 600;
  display: block;
  margin-bottom: $spacing-xs;
  color: $secondary-color;
}

.detail-category {
  font-size: $font-size-base;
  color: $text-secondary;
  display: block;
  margin-bottom: $spacing-lg;
}

.detail-row {
  margin-bottom: $spacing-base;

  .detail-label {
    font-size: $font-size-sm;
    color: $text-placeholder;
    display: block;
    margin-bottom: $spacing-xs;
  }

  .detail-value {
    font-size: $font-size-base;
    color: $text-color;

    &.remark {
      color: $text-secondary;
      line-height: 1.6;
    }
  }
}

.color-display {
  display: flex;
  align-items: center;
  gap: $spacing-sm;

  .color-dot {
    width: 32rpx;
    height: 32rpx;
    border-radius: 50%;
    border: 1rpx solid rgba(0, 0, 0, 0.1);
  }

  .color-name {
    font-size: $font-size-base;
    color: $text-color;
  }
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-sm;

  .tag {
    padding: 8rpx 20rpx;
    background: linear-gradient(135deg, $primary-light, rgba(201, 168, 108, 0.2));
    color: $primary-dark;
    border-radius: $border-radius-lg;
    font-size: $font-size-sm;
  }
}

.detail-actions {
  display: flex;
  gap: $spacing-base;
  margin-top: $spacing-xl;

  .btn-edit, .btn-delete {
    flex: 1;
    height: 88rpx;
    border-radius: $border-radius-lg;
    font-size: $font-size-base;
  }

  .btn-edit {
    background: linear-gradient(135deg, $primary-color 0%, $primary-dark 100%);
    color: $white;
  }

  .btn-delete {
    background: $white;
    color: $error-color;
    border: 2rpx solid $error-color;
  }
}
</style>
