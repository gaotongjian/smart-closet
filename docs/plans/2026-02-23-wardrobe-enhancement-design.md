# SmartCloset 衣橱管理增强设计方案

**日期**: 2026-02-23

## 1. 整体架构

采用混合模式：
- **本地层**: 使用 uni.getStorageSync 本地持久化（当前已实现）
- **服务层**: 抽象API接口，预留云端同步能力
- **数据流**: Store → Service → API Adapter（可切换本地/云端）

## 2. 衣橱管理增强

### 2.1 衣物详情页面 (wardrobe/detail.vue)
- 支持编辑：名称、分类、颜色、品牌、季节、场合、备注
- 支持多图相册管理
- 支持删除衣物

### 2.2 添加衣物页面 (wardrobe/add.vue)
- 图片选择（相机/相册）
- 手动填写详细信息
- 智能标签推荐（模拟）

### 2.3 智能标签系统
- 颜色选择器（预设12种常用颜色）
- 季节标签：春/夏/秋/冬（多选）
- 场合标签：通勤/约会/运动/休闲/正式（多选）
- 基于选择自动推荐匹配

### 2.4 批量管理
- 长按进入多选模式
- 批量删除
- 批量移动分类
- 批量添加标签

## 3. 服务层补全

### wardrobeService.js
```javascript
export const wardrobeService = {
  getItems(),      // 获取衣物列表
  getItemById(),   // 获取单件衣物
  createItem(),    // 创建衣物
  updateItem(),    // 更新衣物
  deleteItem(),    // 删除衣物
  batchDelete(),   // 批量删除
  batchUpdate(),   // 批量更新
}
```

### tagService.js
```javascript
export const tagService = {
  getColorTags(),     // 获取颜色标签
  getSeasonTags(),    // 获取季节标签
  getOccasionTags(),  // 获取场合标签
  recommendTags(),    // 智能推荐标签
}
```

## 4. 测试策略

使用 **vitest** 编写测试：
- **Store 单元测试**: 测试 wardrobe.js, outfit.js, weather.js, user.js 的核心方法
- **Service 单元测试**: 测试 service 层的业务逻辑
- **组件集成测试**: 验证 Store 与组件的数据交互
