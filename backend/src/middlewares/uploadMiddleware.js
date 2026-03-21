const multer = require('multer')
const { CloudinaryStorage } = require('multer-storage-cloudinary')
const cloudinary = require('../config/cloudinary')

const ALLOWED_IMAGE_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp'])

function sanitizePublicIdSegment(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

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

function createAvatarStorage(folder) {
  return new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => {
      const authUserId = sanitizePublicIdSegment(req.authUser?.id || 'guest')
      const originalName = sanitizePublicIdSegment(file.originalname.replace(/\.[^.]+$/, '')) || 'avatar'

      return {
        folder,
        resource_type: 'image',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        public_id: `${authUserId}-${Date.now()}-${originalName}`,
      }
    },
  })
}

const avatarUpload = multer({
  storage: createAvatarStorage('homelyy/users/avatars'),
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
