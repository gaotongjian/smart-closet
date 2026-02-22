export const uploadImage = (filePath) => {
  return new Promise((resolve, reject) => {
    // 模拟上传（实际项目中需要接入云存储或CDN）
    setTimeout(() => {
      resolve({
        success: true,
        url: filePath
      })
    }, 500)
  })
}

export const uploadImages = (filePaths) => {
  return Promise.all(filePaths.map(path => uploadImage(path)))
}
