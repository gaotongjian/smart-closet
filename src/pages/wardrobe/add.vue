<template>
  <view class="add-page">
    <view class="image-section" @click="chooseImage">
      <image v-if="form.image" class="preview-image" :src="form.image" mode="aspectFill" />
      <view v-else class="image-placeholder">
        <text class="placeholder-icon">+</text>
        <text class="placeholder-text">添加图片</text>
      </view>
    </view>

    <view class="form-section">
      <view class="form-item">
        <text class="form-label">名称</text>
        <input class="form-input" v-model="form.name" placeholder="请输入衣物名称" />
      </view>

      <view class="form-item">
        <text class="form-label">分类</text>
        <picker :range="categories" range-key="name" @change="onCategoryChange">
          <view class="picker-value">
            {{ selectedCategory?.name || '请选择分类' }}
          </view>
        </picker>
      </view>

      <!-- 颜色选择 -->
      <view class="form-item">
        <text class="form-label">颜色</text>
        <view class="color-tags">
          <view
            v-for="color in colorTags"
            :key="color.id"
            class="color-tag"
            :class="{ active: form.color === color.id }"
            :style="{ backgroundColor: color.hex }"
            @click="selectColor(color.id)"
          >
            <text v-if="form.color === color.id" class="color-check">✓</text>
          </view>
        </view>
      </view>

      <!-- 季节多选 -->
      <view class="form-item">
        <text class="form-label">季节（可多选）</text>
        <view class="tag-group">
          <view
            v-for="season in seasonTags"
            :key="season.id"
            class="tag-option"
            :class="{ active: form.seasons?.includes(season.id) }"
            @click="toggleSeason(season.id)"
          >
            {{ season.name }}
          </view>
        </view>
      </view>

      <!-- 场合多选 -->
      <view class="form-item">
        <text class="form-label">场合（可多选）</text>
        <view class="tag-group">
          <view
            v-for="occasion in occasionTags"
            :key="occasion.id"
            class="tag-option"
            :class="{ active: form.occasions?.includes(occasion.id) }"
            @click="toggleOccasion(occasion.id)"
          >
            {{ occasion.name }}
          </view>
        </view>
      </view>

      <view class="form-item">
        <text class="form-label">品牌</text>
        <input class="form-input" v-model="form.brand" placeholder="请输入品牌（选填）" />
      </view>

      <view class="form-item">
        <text class="form-label">备注</text>
        <textarea class="form-textarea" v-model="form.remark" placeholder="添加备注（选填）" />
      </view>
    </view>

    <view class="submit-section">
      <button class="btn-submit" @click="submitForm">保存</button>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onLoad } from '@dcloudio/uni-app'
import { useWardrobeStore } from '@/stores/wardrobe'
import { getColorTags, getSeasonTags, getOccasionTags, recommendTags } from '@/services/tagService'

const wardrobeStore = useWardrobeStore()

const form = ref({
  image: '',
  name: '',
  category: '',
  color: '',
  seasons: [],
  occasions: [],
  brand: '',
  remark: '',
  tags: []
})

const editId = ref(null)

// 标签数据
const colorTags = ref(getColorTags())
const seasonTags = ref(getSeasonTags())
const occasionTags = ref(getOccasionTags())

const categories = ref([
  { id: 'tops', name: '上衣' },
  { id: 'bottoms', name: '裤子' },
  { id: 'dresses', name: '裙子' },
  { id: 'outerwear', name: '外套' },
  { id: 'shoes', name: '鞋子' },
  { id: 'accessories', name: '配饰' }
])

const selectedCategory = computed(() => {
  return categories.value.find(c => c.id === form.value.category)
})

onLoad((options) => {
  if (options.image) {
    form.value.image = decodeURIComponent(options.image)
  }
  if (options.id) {
    editId.value = options.id
    const item = wardrobeStore.getItemById(options.id)
    if (item) {
      form.value = {
        ...item,
        seasons: item.seasons || [],
        occasions: item.occasions || []
      }
    }
  }
})

const chooseImage = () => {
  uni.chooseImage({
    count: 1,
    sourceType: ['album', 'camera'],
    success: (res) => {
      form.value.image = res.tempFilePaths[0]
    }
  })
}

const onCategoryChange = (e) => {
  const categoryId = categories.value[e.detail.value].id
  form.value.category = categoryId

  // 智能推荐标签
  const recommendations = recommendTags(categoryId)
  form.value.seasons = [...recommendations.seasons]
  form.value.occasions = [...recommendations.occasions]
}

const selectColor = (colorId) => {
  form.value.color = form.value.color === colorId ? '' : colorId
}

const toggleSeason = (seasonId) => {
  if (!form.value.seasons) {
    form.value.seasons = []
  }
  const index = form.value.seasons.indexOf(seasonId)
  if (index > -1) {
    form.value.seasons.splice(index, 1)
  } else {
    form.value.seasons.push(seasonId)
  }
}

const toggleOccasion = (occasionId) => {
  if (!form.value.occasions) {
    form.value.occasions = []
  }
  const index = form.value.occasions.indexOf(occasionId)
  if (index > -1) {
    form.value.occasions.splice(index, 1)
  } else {
    form.value.occasions.push(occasionId)
  }
}

const submitForm = () => {
  if (!form.value.image) {
    uni.showToast({ title: '请添加图片', icon: 'none' })
    return
  }
  if (!form.value.name) {
    uni.showToast({ title: '请输入名称', icon: 'none' })
    return
  }
  if (!form.value.category) {
    uni.showToast({ title: '请选择分类', icon: 'none' })
    return
  }

  // 整理标签数据
  const submitData = {
    ...form.value,
    // 将颜色ID转换为颜色名称
    colorName: form.value.color ? colorTags.value.find(c => c.id === form.value.color)?.name : ''
  }

  if (editId.value) {
    wardrobeStore.updateItem(editId.value, submitData)
    uni.showToast({ title: '修改成功', icon: 'success' })
  } else {
    wardrobeStore.addItem(submitData)
    uni.showToast({ title: '添加成功', icon: 'success' })
  }

  setTimeout(() => {
    uni.navigateBack()
  }, 1000)
}
</script>

<style lang="scss" scoped>
.add-page {
  min-height: 100vh;
  background: $background-color;
  padding-bottom: 200rpx;
}

.image-section {
  background: $white;
  padding: $spacing-base;

  .preview-image {
    width: 100%;
    height: 500rpx;
    border-radius: $border-radius-base;
  }

  .image-placeholder {
    @include flex-column;
    @include flex-center;
    height: 400rpx;
    background: #F5F5F5;
    border-radius: $border-radius-base;
    border: 2rpx dashed $border-color;

    .placeholder-icon {
      font-size: 80rpx;
      color: $text-placeholder;
    }

    .placeholder-text {
      font-size: $font-size-base;
      color: $text-placeholder;
      margin-top: $spacing-sm;
    }
  }
}

.form-section {
  background: $white;
  margin-top: $spacing-base;
  padding: $spacing-base;
}

.form-item {
  margin-bottom: $spacing-lg;

  .form-label {
    font-size: $font-size-base;
    color: $text-color;
    display: block;
    margin-bottom: $spacing-sm;
  }

  .form-input {
    height: 80rpx;
    padding: 0 $spacing-base;
    background: #F5F5F5;
    border-radius: $border-radius-base;
    font-size: $font-size-base;
  }

  .form-textarea {
    width: 100%;
    min-height: 120rpx;
    padding: $spacing-base;
    background: #F5F5F5;
    border-radius: $border-radius-base;
    font-size: $font-size-base;
  }

  .picker-value {
    height: 80rpx;
    padding: 0 $spacing-base;
    background: #F5F5F5;
    border-radius: $border-radius-base;
    font-size: $font-size-base;
    line-height: 80rpx;
  }
}

.color-tags {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-sm;

  .color-tag {
    width: 56rpx;
    height: 56rpx;
    border-radius: 50%;
    @include flex-center;
    border: 2rpx solid transparent;
    transition: all 0.2s ease;

    &.active {
      border-color: $primary-color;
      box-shadow: 0 0 0 4rpx rgba(201, 168, 108, 0.3);
    }

    .color-check {
      color: #fff;
      font-size: 24rpx;
      font-weight: bold;
      text-shadow: 0 1rpx 2rpx rgba(0, 0, 0, 0.3);
    }
  }
}

.tag-group {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-sm;

  .tag-option {
    padding: 12rpx 24rpx;
    background: #F5F5F5;
    border-radius: $border-radius-lg;
    font-size: $font-size-sm;
    color: $text-secondary;
    transition: all 0.2s ease;

    &.active {
      background: linear-gradient(135deg, $primary-color, $primary-dark);
      color: $white;
    }
  }
}

.submit-section {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: $spacing-base;
  background: $white;
  box-shadow: 0 -4rpx 16rpx rgba(0, 0, 0, 0.05);

  .btn-submit {
    height: 88rpx;
    background: linear-gradient(135deg, $primary-color 0%, $primary-dark 100%);
    color: $white;
    border-radius: $border-radius-lg;
    font-size: $font-size-lg;
  }
}
</style>
