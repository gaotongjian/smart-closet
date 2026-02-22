<template>
  <view class="create-page">
    <view class="image-section" @click="chooseImage">
      <image v-if="form.image" class="preview-image" :src="form.image" mode="aspectFill" />
      <view v-else class="image-placeholder">
        <text class="placeholder-icon">+</text>
        <text class="placeholder-text">添加搭配图片</text>
      </view>
    </view>

    <view class="form-section">
      <view class="form-item">
        <text class="form-label">搭配名称</text>
        <input class="form-input" v-model="form.name" placeholder="请输入搭配名称" />
      </view>

      <view class="form-item">
        <text class="form-label">搭配描述</text>
        <textarea class="form-textarea" v-model="form.description" placeholder="请输入搭配描述" />
      </view>

      <view class="form-item">
        <text class="form-label">选择衣物</text>
        <view class="items-select">
          <view
            v-for="item in wardrobeItems"
            :key="item.id"
            class="item-option"
            :class="{ selected: selectedItems.includes(item.id) }"
            @click="toggleItem(item.id)"
          >
            <image class="item-thumb" :src="item.image" mode="aspectFill" />
            <text class="item-name">{{ item.name }}</text>
          </view>
        </view>
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
import { useOutfitStore } from '@/stores/outfit'
import { useWardrobeStore } from '@/stores/wardrobe'

const outfitStore = useOutfitStore()
const wardrobeStore = useWardrobeStore()

const form = ref({
  image: '',
  name: '',
  description: '',
  tags: []
})

const selectedItems = ref([])
const tagInput = ref('')
const editId = ref(null)

const wardrobeItems = computed(() => wardrobeStore.items)

onLoad((options) => {
  wardrobeStore.loadItems()
  if (options.id) {
    editId.value = options.id
    const outfit = outfitStore.getOutfitById(options.id)
    if (outfit) {
      form.value = { ...outfit }
      selectedItems.value = outfit.items?.map(i => i.id) || []
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

const toggleItem = (itemId) => {
  const index = selectedItems.value.indexOf(itemId)
  if (index > -1) {
    selectedItems.value.splice(index, 1)
  } else {
    selectedItems.value.push(itemId)
  }
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

  const items = selectedItems.value.map(id => wardrobeStore.getItemById(id)).filter(Boolean)

  const data = {
    ...form.value,
    items
  }

  if (editId.value) {
    outfitStore.updateOutfit(editId.value, data)
    uni.showToast({ title: '修改成功', icon: 'success' })
  } else {
    outfitStore.addOutfit(data)
    uni.showToast({ title: '创建成功', icon: 'success' })
  }

  setTimeout(() => {
    uni.navigateBack()
  }, 1000)
}
</script>

<style lang="scss" scoped>
.create-page {
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

  .form-textarea {
    width: 100%;
    height: 160rpx;
    padding: $spacing-base;
    background: #F5F5F5;
    border-radius: $border-radius-base;
    font-size: $font-size-base;
  }
}

.items-select {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-sm;

  .item-option {
    width: calc(33.33% - #{$spacing-sm * 2 / 3});
    padding: $spacing-xs;
    background: #F5F5F5;
    border-radius: $border-radius-base;
    border: 4rpx solid transparent;

    &.selected {
      border-color: $primary-color;
    }

    .item-thumb {
      width: 100%;
      height: 160rpx;
      border-radius: 8rpx;
    }

    .item-name {
      font-size: $font-size-xs;
      color: $text-secondary;
      display: block;
      margin-top: 4rpx;
      @include text-ellipsis(1);
    }
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
