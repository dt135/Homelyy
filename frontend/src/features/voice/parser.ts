export type VoiceIntent =
  | { type: 'goHome' }
  | { type: 'goProducts' }
  | { type: 'goCart' }
  | { type: 'goBack' }
  | { type: 'search'; query: string }
  | { type: 'filterCategory'; category: string }
  | { type: 'filterPrice'; mode: 'min' | 'max'; amount: number }
  | { type: 'unknown' }

function hasKeywords(transcript: string, keywords: string[]): boolean {
  return keywords.every((keyword) => transcript.includes(keyword))
}

function extractAmount(text: string): number | null {
  const digits = text.replace(/\D/g, '')
  if (!digits) {
    return null
  }
  const parsed = Number(digits)
  return Number.isFinite(parsed) ? parsed : null
}

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

export function parseVoiceCommand(rawTranscript: string): VoiceIntent {
  const transcript = normalize(rawTranscript)

  const searchMatch = transcript.match(/^tim(?:\s+kiem)?\s+(.+)$/)
  if (searchMatch?.[1]) {
    return { type: 'search', query: searchMatch[1].trim() }
  }

  const filterCategoryMatch = transcript.match(
    /^loc(?:\s+theo)?\s+(?:danh muc|category)\s+(.+)$/,
  )
  if (filterCategoryMatch?.[1]) {
    return { type: 'filterCategory', category: filterCategoryMatch[1].trim() }
  }

  const maxPriceMatch = transcript.match(/^loc\s+gia\s+duoi\s+(.+)$/)
  if (maxPriceMatch?.[1]) {
    const amount = extractAmount(maxPriceMatch[1])
    if (amount !== null) {
      return { type: 'filterPrice', mode: 'max', amount }
    }
  }

  const minPriceMatch = transcript.match(/^loc\s+gia\s+tren\s+(.+)$/)
  if (minPriceMatch?.[1]) {
    const amount = extractAmount(minPriceMatch[1])
    if (amount !== null) {
      return { type: 'filterPrice', mode: 'min', amount }
    }
  }

  if (
    transcript === 'vao trang chu' ||
    transcript === 've trang chu' ||
    hasKeywords(transcript, ['trang', 'chu'])
  ) {
    return { type: 'goHome' }
  }
  if (
    transcript === 'mo trang san pham' ||
    transcript === 'vao trang san pham' ||
    transcript === 'mo danh sach san pham'
  ) {
    return { type: 'goProducts' }
  }
  if (
    transcript === 'mo gio hang' ||
    transcript === 'vao gio hang' ||
    hasKeywords(transcript, ['gio', 'hang'])
  ) {
    return { type: 'goCart' }
  }
  if (transcript === 'quay lai' || transcript === 'tro lai') {
    return { type: 'goBack' }
  }

  return { type: 'unknown' }
}
