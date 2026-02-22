<template>
  <view class="wardrobe-page">
    <!-- 搜索栏 -->
    <view class="search-bar">
      <view class="search-input-wrap">
        <text class="search-icon">🔍</text>
        <input
          class="search-input"
          v-model="searchKeyword"
          placeholder="搜索衣物..."
          @confirm="handleSearch"
        />
      </view>
    </view>

    <!-- 分类筛选 -->
    <CategoryFilter
      :categories="categories"
      :activeCategory="activeCategory"
      @change="handleCategoryChange"
    />

    <!-- 衣物列表 -->
    <scroll-view
      class="wardrobe-grid"
      scroll-y
      @scrolltolower="loadMore"
    >
      <view class="grid">
        <view
          v-for="item in filteredItems"
          :key="item.id"
          class="grid-item"
          @click="viewDetail(item)"
        >
          <image class="item-image" :src="item.image" mode="aspectFill" />
          <view class="item-info">
            <text class="item-name">{{ item.name }}</text>
            <text class="item-category">{{ item.categoryName }}</text>
          </view>
          <view class="item-tags" v-if="item.tags && item.tags.length">
            <text v-for="tag in item.tags.slice(0, 2)" :key="tag" class="tag">{{ tag }}</text>
          </view>
        </view>
      </view>

      <view v-if="filteredItems.length === 0" class="empty-state">
        <text class="empty-icon">👔</text>
        <text class="empty-text">还没有衣物</text>
        <text class="empty-hint">点击下方按钮添加第一件衣物</text>
      </view>

      <view v-if="isLoading" class="loading-more">
        <text>加载中...</text>
      </view>
    </scroll-view>

    <!-- 悬浮添加按钮 -->
    <view class="fab" @click="showAddSheet">
      <text class="fab-icon">+</text>
    </view>

    <!-- 添加方式选择弹窗 -->
    <view v-if="showAddModal" class="modal-mask" @click="showAddModal = false">
      <view class="modal-content" @click.stop>
        <view class="modal-title">添加衣物</view>
        <view class="modal-options">
          <view class="modal-option" @click="addByCamera">
            <text class="option-icon">📷</text>
            <text class="option-text">拍照</text>
          </view>
          <view class="modal-option" @click="addByAlbum">
            <text class="option-icon">🖼️</text>
            <text class="option-text">相册</text>
          </view>
        </view>
        <view class="modal-cancel" @click="showAddModal = false">取消</view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import CategoryFilter from '@/components/category-filter/category-filter.vue'
import { useWardrobeStore } from '@/stores/wardrobe'

const wardrobeStore = useWardrobeStore()

const searchKeyword = ref('')
const activeCategory = ref('all')
const showAddModal = ref(false)
const isLoading = ref(false)

const categories = ref([
  { id: 'all', name: '全部' },
  { id: 'tops', name: '上衣' },
  { id: 'bottoms', name: '裤子' },
  { id: 'dresses', name: '裙子' },
  { id: 'outerwear', name: '外套' },
  { id: 'shoes', name: '鞋子' },
  { id: 'accessories', name: '配饰' }
])

const filteredItems = computed(() => {
  let items = wardrobeStore.items

  // 分类筛选
  if (activeCategory.value !== 'all') {
    items = items.filter(item => item.category === activeCategory.value)
  }

  // 搜索筛选
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    items = items.filter(item =>
      item.name.toLowerCase().includes(keyword) ||
      item.categoryName?.toLowerCase().includes(keyword)
    )
  }

  return items
})

onMounted(() => {
  wardrobeStore.loadItems()
})

const handleCategoryChange = (categoryId) => {
  activeCategory.value = categoryId
}

const handleSearch = () => {
  // 搜索逻辑已在computed中处理
}

const viewDetail = (item) => {
  uni.navigateTo({
    url: `/pages/wardrobe/detail?id=${item.id}`
  })
}

const showAddSheet = () => {
  showAddModal.value = true
}

const addByCamera = () => {
  showAddModal.value = false
  uni.chooseImage({
    count: 1,
    sourceType: ['camera'],
    success: (res) => {
      goToAddPage(res.tempFilePaths[0])
    }
  })
}

const addByAlbum = () => {
  showAddModal.value = false
  uni.chooseImage({
    count: 1,
    sourceType: ['album'],
    success: (res) => {
      goToAddPage(res.tempFilePaths[0])
    }
  })
}

const goToAddPage = (imagePath) => {
  uni.navigateTo({
    url: `/pages/wardrobe/add?image=${encodeURIComponent(imagePath)}`
  })
}

const loadMore = () => {
  // 分页加载逻辑
}
</script>

<style lang="scss" scoped>
.wardrobe-page {
  min-height: 100vh;
  background: $background-color;
  padding-bottom: 120rpx;
}

.search-bar {
  padding: $spacing-base;
  background: $white;
}

.search-input-wrap {
  display: flex;
  align-items: center;
  height: 72rpx;
  padding: 0 $spacing-base;
  background: #F0F2F5;
  border-radius: 36rpx;

  .search-icon {
    margin-right: $spacing-sm;
    font-size: 32rpx;
  }

  .search-input {
    flex: 1;
    font-size: $font-size-base;
    color: $text-color;
  }
}

.wardrobe-grid {
  height: calc(100vh - 280rpx);
  padding: 0 $spacing-base;
}

.grid {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-sm;
}

.grid-item {
  width: calc(50% - #{$spacing-sm / 2});
  background: $white;
  border-radius: $border-radius-base;
  overflow: hidden;
  margin-bottom: $spacing-sm;
  box-shadow: $box-shadow-light;

  .item-image {
    width: 100%;
    height: 320rpx;
  }

  .item-info {
    padding: $spacing-sm;

    .item-name {
      font-size: $font-size-base;
      font-weight: 500;
      color: $text-color;
      display: block;
      @include text-ellipsis(1);
    }

    .item-category {
      font-size: $font-size-sm;
      color: $text-secondary;
    }
  }

  .item-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 4rpx;
    padding: 0 $spacing-sm $spacing-sm;

    .tag {
      padding: 2rpx 8rpx;
      background: #F0F2F5;
      color: $text-secondary;
      border-radius: 8rpx;
      font-size: 20rpx;
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

.fab {
  position: fixed;
  right: 32rpx;
  bottom: 160rpx;
  width: 112rpx;
  height: 112rpx;
  background: linear-gradient(135deg, $primary-color 0%, #7B9EFF 100%);
  border-radius: 50%;
  @include flex-center;
  box-shadow: 0 8rpx 24rpx rgba(91, 127, 255, 0.4);

  .fab-icon {
    font-size: 56rpx;
    color: $white;
    font-weight: 300;
  }
}

.modal-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  @include flex-center;
  z-index: 1000;
}

.modal-content {
  width: 560rpx;
  background: $white;
  border-radius: $border-radius-lg;
  overflow: hidden;
}

.modal-title {
  padding: $spacing-base;
  text-align: center;
  font-size: $font-size-lg;
  font-weight: 600;
  border-bottom: 1rpx solid $border-color;
}

.modal-options {
  display: flex;
  padding: $spacing-base;

  .modal-option {
    flex: 1;
    @include flex-column;
    @include flex-center;
    padding: $spacing-lg 0;

    .option-icon {
      font-size: 64rpx;
      margin-bottom: $spacing-sm;
    }

    .option-text {
      font-size: $font-size-base;
      color: $text-color;
    }
  }
}

.modal-cancel {
  padding: $spacing-base;
  text-align: center;
  color: $text-secondary;
  border-top: 1rpx solid $border-color;
}
</style>
