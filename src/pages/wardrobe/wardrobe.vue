<template>
  <view class="wardrobe-page">
    <!-- 页面头部 -->
    <view class="page-header">
      <view class="header-title-wrap">
        <text class="header-title">我的衣橱</text>
        <view class="title-accent"></view>
      </view>
      <text class="header-subtitle">精选 {{ filteredItems.length }} 件单品</text>
    </view>

    <!-- 搜索栏 -->
    <view class="search-bar">
      <view class="search-input-wrap">
        <text class="search-icon">🔍</text>
        <input
          class="search-input"
          v-model="searchKeyword"
          placeholder="搜索你的衣物..."
          @confirm="handleSearch"
        />
        <view v-if="searchKeyword" class="search-clear" @click="searchKeyword = ''">✕</view>
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
          v-for="(item, index) in filteredItems"
          :key="item.id"
          class="grid-item"
          :style="{ animationDelay: `${index * 0.05}s` }"
          @click="viewDetail(item)"
        >
          <view class="item-image-wrap">
            <image class="item-image" :src="item.image" mode="aspectFill" />
            <view class="item-overlay"></view>
          </view>
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
        <view class="empty-illustration">
          <view class="empty-hanger"></view>
        </view>
        <text class="empty-text">衣橱空空如也</text>
        <text class="empty-hint">点击下方按钮添加第一件衣物</text>
      </view>

      <view v-if="isLoading" class="loading-more">
        <view class="loading-dot"></view>
        <view class="loading-dot"></view>
        <view class="loading-dot"></view>
      </view>
    </scroll-view>

    <!-- 悬浮添加按钮 -->
    <view class="fab" @click="showAddSheet">
      <view class="fab-inner">
        <text class="fab-icon">+</text>
      </view>
    </view>

    <!-- 添加方式选择弹窗 -->
    <view v-if="showAddModal" class="modal-mask" @click="showAddModal = false">
      <view class="modal-content" @click.stop>
        <view class="modal-header">
          <text class="modal-title">添加新衣物</text>
          <text class="modal-subtitle">选择图片来源</text>
        </view>
        <view class="modal-options">
          <view class="modal-option" @click="addByCamera">
            <view class="option-icon-wrap">
              <text class="option-icon">📷</text>
            </view>
            <text class="option-text">拍照</text>
            <text class="option-desc">即时拍摄</text>
          </view>
          <view class="modal-option" @click="addByAlbum">
            <view class="option-icon-wrap">
              <text class="option-icon">🖼️</text>
            </view>
            <text class="option-text">相册</text>
            <text class="option-desc">从相册选择</text>
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
  { id: 'bottoms', name: '裤装' },
  { id: 'dresses', name: '裙装' },
  { id: 'outerwear', name: '外套' },
  { id: 'shoes', name: '鞋履' },
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
  background: linear-gradient(180deg, #FAF8F5 0%, #F0EDE8 100%);
  padding-bottom: 120rpx;
}

.page-header {
  padding: $spacing-base;
  padding-top: $spacing-lg;
  background: linear-gradient(180deg, #FAF8F5, transparent);

  .header-title-wrap {
    position: relative;
    display: inline-block;
  }

  .header-title {
    font-size: $font-size-xxl;
    font-weight: 700;
    color: $secondary-color;
    letter-spacing: -0.02em;
  }

  .title-accent {
    width: 60rpx;
    height: 6rpx;
    background: linear-gradient(90deg, $primary-color, transparent);
    border-radius: 3rpx;
    margin-top: 8rpx;
  }

  .header-subtitle {
    font-size: $font-size-sm;
    color: $text-secondary;
    margin-top: $spacing-xs;
    display: block;
  }
}

.search-bar {
  padding: 0 $spacing-base;
  margin-bottom: $spacing-sm;
}

.search-input-wrap {
  display: flex;
  align-items: center;
  height: 80rpx;
  padding: 0 $spacing-base;
  background: $white;
  border-radius: $border-radius-xl;
  box-shadow: $box-shadow-light;
  border: 1rpx solid transparent;
  transition: all 0.3s ease;

  &:focus-within {
    border-color: $primary-color;
    box-shadow: $box-shadow-base;
  }

  .search-icon {
    margin-right: $spacing-sm;
    font-size: 32rpx;
    opacity: 0.6;
  }

  .search-input {
    flex: 1;
    font-size: $font-size-base;
    color: $text-color;
  }

  .search-clear {
    width: 40rpx;
    height: 40rpx;
    @include flex-center;
    color: $text-placeholder;
    font-size: 24rpx;
  }
}

.wardrobe-grid {
  height: calc(100vh - 380rpx);
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
  border-radius: $border-radius-lg;
  overflow: hidden;
  margin-bottom: $spacing-sm;
  box-shadow: $box-shadow-light;
  animation: fadeIn 0.4s ease-out backwards;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:active {
    transform: scale(0.98);
  }

  .item-image-wrap {
    position: relative;
    overflow: hidden;
  }

  .item-image {
    width: 100%;
    height: 300rpx;
    transition: transform 0.5s ease;
  }

  .item-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 60rpx;
    background: linear-gradient(transparent, rgba(0, 0, 0, 0.1));
  }

  .item-info {
    padding: $spacing-sm;

    .item-name {
      font-size: $font-size-base;
      font-weight: 600;
      color: $secondary-color;
      display: block;
      @include text-ellipsis(1);
      letter-spacing: -0.01em;
    }

    .item-category {
      font-size: $font-size-sm;
      color: $text-secondary;
      margin-top: 4rpx;
      display: block;
    }
  }

  .item-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6rpx;
    padding: 0 $spacing-sm $spacing-sm;

    .tag {
      padding: 4rpx 12rpx;
      background: linear-gradient(135deg, #F5F2EE, #EAE7E2);
      color: $text-secondary;
      border-radius: 12rpx;
      font-size: 20rpx;
      font-weight: 500;
    }
  }
}

.empty-state {
  @include flex-column;
  @include flex-center;
  padding: $spacing-xxl;

  .empty-illustration {
    width: 200rpx;
    height: 200rpx;
    margin-bottom: $spacing-lg;
    position: relative;

    .empty-hanger {
      width: 100rpx;
      height: 100rpx;
      border: 8rpx solid $primary-light;
      border-radius: 50%;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);

      &::after {
        content: '';
        position: absolute;
        width: 6rpx;
        height: 50rpx;
        background: $primary-color;
        bottom: -40rpx;
        left: 50%;
        transform: translateX(-50%);
      }
    }
  }

  .empty-text {
    font-size: $font-size-lg;
    color: $secondary-color;
    margin-bottom: $spacing-xs;
    font-weight: 600;
  }

  .empty-hint {
    font-size: $font-size-sm;
    color: $text-placeholder;
  }
}

.loading-more {
  @include flex-center;
  padding: $spacing-lg;
  gap: 8rpx;

  .loading-dot {
    width: 12rpx;
    height: 12rpx;
    background: $primary-color;
    border-radius: 50%;
    animation: pulse 1.4s infinite ease-in-out both;

    &:nth-child(1) { animation-delay: -0.32s; }
    &:nth-child(2) { animation-delay: -0.16s; }
  }
}

.fab {
  position: fixed;
  right: 40rpx;
  bottom: 160rpx;
  z-index: 100;

  .fab-inner {
    width: 112rpx;
    height: 112rpx;
    background: linear-gradient(135deg, $primary-color 0%, $primary-dark 100%);
    border-radius: 50%;
    @include flex-center;
    box-shadow: $box-shadow-glow;
    transition: transform 0.3s ease;

    &:active {
      transform: scale(0.9);
    }
  }

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
  background: rgba(45, 42, 38, 0.5);
  @include flex-center;
  z-index: 1000;
  animation: fadeIn 0.2s ease;
}

.modal-content {
  width: 600rpx;
  background: $white;
  border-radius: $border-radius-xl;
  overflow: hidden;
  animation: slideUp 0.3s ease;
}

.modal-header {
  padding: $spacing-lg;
  text-align: center;
  border-bottom: 1rpx solid $border-color;

  .modal-title {
    font-size: $font-size-lg;
    font-weight: 600;
    color: $secondary-color;
    display: block;
  }

  .modal-subtitle {
    font-size: $font-size-sm;
    color: $text-secondary;
    margin-top: 4rpx;
    display: block;
  }
}

.modal-options {
  display: flex;
  padding: $spacing-base;
  gap: $spacing-base;

  .modal-option {
    flex: 1;
    @include flex-column;
    @include flex-center;
    padding: $spacing-lg 0;
    background: #FAF8F5;
    border-radius: $border-radius-lg;
    transition: background 0.2s ease;

    &:active {
      background: #F0EDE8;
    }

    .option-icon-wrap {
      width: 100rpx;
      height: 100rpx;
      background: $white;
      border-radius: 50%;
      @include flex-center;
      margin-bottom: $spacing-sm;
      box-shadow: $box-shadow-light;
    }

    .option-icon {
      font-size: 48rpx;
    }

    .option-text {
      font-size: $font-size-base;
      font-weight: 600;
      color: $secondary-color;
    }

    .option-desc {
      font-size: $font-size-xs;
      color: $text-secondary;
      margin-top: 4rpx;
    }
  }
}

.modal-cancel {
  padding: $spacing-base;
  text-align: center;
  color: $text-secondary;
  border-top: 1rpx solid $border-color;
  font-size: $font-size-base;
  transition: background 0.2s ease;

  &:active {
    background: #FAF8F5;
  }
}
</style>
