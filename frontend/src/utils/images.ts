export function isLikelyImageUrl(value: string): boolean {
  const normalized = value.trim().toLowerCase()
  if (!normalized) {
    return false
  }

  return normalized.startsWith('http://') || normalized.startsWith('https://')
}
