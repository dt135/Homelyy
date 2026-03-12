function sanitizeDoc(doc) {
  if (!doc) {
    return null
  }

  const payload = typeof doc.toObject === 'function' ? doc.toObject() : { ...doc }
  if (payload.specs instanceof Map) {
    payload.specs = Object.fromEntries(payload.specs)
  }
  delete payload._id
  delete payload.__v
  return payload
}

function sanitizeDocs(docs) {
  return docs.map((doc) => sanitizeDoc(doc))
}

module.exports = {
  sanitizeDoc,
  sanitizeDocs,
}
