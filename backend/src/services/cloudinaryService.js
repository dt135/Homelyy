const cloudinary = require('../config/cloudinary')

function normalizePublicIds(publicIds) {
  if (!publicIds) {
    return []
  }

  if (Array.isArray(publicIds)) {
    return publicIds.map((item) => String(item || '').trim()).filter(Boolean)
  }

  const singleValue = String(publicIds || '').trim()
  return singleValue ? [singleValue] : []
}

async function destroyImagesByPublicIds(publicIds) {
  const ids = normalizePublicIds(publicIds)
  if (ids.length === 0) {
    return
  }

  await Promise.all(
    ids.map(async (publicId) => {
      try {
        await cloudinary.uploader.destroy(publicId)
      } catch (_error) {
        // Ignore destroy failures to avoid blocking business flow.
      }
    }),
  )
}

module.exports = {
  destroyImagesByPublicIds,
}
