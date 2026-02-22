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

      <view class="form-item">
        <text class="form-label">品牌</text>
        <input class="form-input" v-model="form.brand" placeholder="请输入品牌（选填）" />
      </view>

      <view class="form-item">
        <text class="form-label">颜色</text>
        <input class="form-input" v-model="form.color" placeholder="请输入颜色（选填）" />
      </view>

      <view class="form-item">
        <text class="form-label">标签</text>
        <view class="tags-input">
          <view v-for="(tag, index) in form.tags" :key="index" class="tag">
            {{ tag }}
            <text class="tag-remove" @click="removeTag(index)">×</text>
          </view>
          <input
            class="tag-input"
            v-model="tagInput"
            placeholder="添加标签"
            @confirm="addTag"
          />
        </view>
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

const wardrobeStore = useWardrobeStore()

const form = ref({
  image: '',
  name: '',
  category: '',
  brand: '',
  color: '',
  tags: []
})

const tagInput = ref('')
const editId = ref(null)

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
      form.value = { ...item }
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
  form.value.category = categories.value[e.detail.value].id
}

const addTag = () => {
  if (tagInput.value && !form.value.tags.includes(tagInput.value)) {
    form.value.tags.push(tagInput.value)
    tagInput.value = ''
  }
}

const removeTag = (index) => {
  form.value.tags.splice(index, 1)
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

  if (editId.value) {
    wardrobeStore.updateItem(editId.value, form.value)
    uni.showToast({ title: '修改成功', icon: 'success' })
  } else {
    wardrobeStore.addItem(form.value)
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
  margin-bottom: $spacing-base;

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

  .picker-value {
    height: 80rpx;
    padding: 0 $spacing-base;
    background: #F5F5F5;
    border-radius: $border-radius-base;
    font-size: $font-size-base;
    line-height: 80rpx;
  }
}

.tags-input {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-sm;
  min-height: 80rpx;
  padding: $spacing-sm;
  background: #F5F5F5;
  border-radius: $border-radius-base;

  .tag {
    display: flex;
    align-items: center;
    padding: 8rpx 16rpx;
    background: $primary-color;
    color: $white;
    border-radius: 8rpx;
    font-size: $font-size-sm;

    .tag-remove {
      margin-left: 8rpx;
      font-size: 28rpx;
    }
  }

  .tag-input {
    flex: 1;
    min-width: 120rpx;
    height: 56rpx;
    font-size: $font-size-sm;
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
    background: $primary-color;
    color: $white;
    border-radius: $border-radius-lg;
    font-size: $font-size-lg;
  }
}
</style>
