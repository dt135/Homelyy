const multer = require('multer')
const { CloudinaryStorage } = require('multer-storage-cloudinary')
const cloudinary = require('../config/cloudinary')

const ALLOWED_IMAGE_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp'])

function createFileFilter() {
  return (_req, file, callback) => {
    if (!ALLOWED_IMAGE_MIME_TYPES.has(file.mimetype)) {
      const error = new Error('Chỉ chấp nhận ảnh JPG, PNG hoặc WEBP')
      error.statusCode = 422
      callback(error)
      return
    }

    callback(null, true)
  }
}

function createStorage(folder) {
  return new CloudinaryStorage({
    cloudinary,
    params: async () => ({
      folder,
      resource_type: 'image',
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    }),
  })
}

const avatarUpload = multer({
  storage: createStorage('homelyy/users/avatars'),
  fileFilter: createFileFilter(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
})

const productUpload = multer({
  storage: createStorage('homelyy/products'),
  fileFilter: createFileFilter(),
  limits: {
    fileSize: 8 * 1024 * 1024,
  },
})

const uploadAvatar = avatarUpload.single('avatar')
const uploadProductImages = productUpload.fields([
  { name: 'thumbnail', maxCount: 1 },
  { name: 'images', maxCount: 8 },
])

module.exports = {
  uploadAvatar,
  uploadProductImages,
}
