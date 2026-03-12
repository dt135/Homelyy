import { useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { categoryOptions } from '../../services/mock/data/categories'
import { parseVoiceCommand } from './parser'

type VoiceStatus = 'idle' | 'listening' | 'success' | 'error' | 'unsupported'

type SpeechRecognitionResultLike = {
  transcript: string
}

type SpeechRecognitionEventLike = {
  results: {
    [index: number]: {
      [index: number]: SpeechRecognitionResultLike
    }
  }
}

type SpeechRecognitionLike = {
  lang: string
  interimResults: boolean
  continuous?: boolean
  maxAlternatives: number
  onresult: ((event: SpeechRecognitionEventLike) => void) | null
  onerror: ((event: { error: string }) => void) | null
  onnomatch?: (() => void) | null
  onend: (() => void) | null
  start: () => void
  stop: () => void
}

type SpeechRecognitionConstructorLike = new () => SpeechRecognitionLike

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function getRecognitionConstructor(): SpeechRecognitionConstructorLike | null {
  const customWindow = window as Window & {
    SpeechRecognition?: SpeechRecognitionConstructorLike
    webkitSpeechRecognition?: SpeechRecognitionConstructorLike
  }
  return customWindow.SpeechRecognition ?? customWindow.webkitSpeechRecognition ?? null
}

function resolveCategoryName(rawCategory: string): string {
  const normalizedInput = normalize(rawCategory)
  const matched = categoryOptions.find((category) => normalize(category) === normalizedInput)
  return matched ?? rawCategory
}

export function useVoiceCommands() {
  const navigate = useNavigate()
  const location = useLocation()
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null)

  const [status, setStatus] = useState<VoiceStatus>('idle')
  const [transcript, setTranscript] = useState('')
  const [feedback, setFeedback] = useState(
    'Nhấn nút mic, nói ngắn gọn và rõ ràng để nhận diện chính xác hơn.',
  )

  const isSupported = useMemo(() => getRecognitionConstructor() !== null, [])

  function applyCommand(rawTranscript: string) {
    const intent = parseVoiceCommand(rawTranscript)
    const params = new URLSearchParams(location.search)

    switch (intent.type) {
      case 'goHome':
        navigate('/')
        setFeedback('Đã điều hướng đến trang chủ.')
        setStatus('success')
        return
      case 'goProducts':
        navigate('/products')
        setFeedback('Đã mở trang sản phẩm.')
        setStatus('success')
        return
      case 'goCart':
        navigate('/cart')
        setFeedback('Đã mở giỏ hàng.')
        setStatus('success')
        return
      case 'goBack':
        navigate(-1)
        setFeedback('Đã quay lại trang trước đó.')
        setStatus('success')
        return
      case 'search':
        params.set('q', intent.query)
        navigate(`/products?${params.toString()}`)
        setFeedback(`Đã tìm với từ khóa: ${intent.query}`)
        setStatus('success')
        return
      case 'filterCategory': {
        const resolvedCategory = resolveCategoryName(intent.category)
        params.set('category', resolvedCategory)
        navigate(`/products?${params.toString()}`)
        setFeedback(`Đã lọc danh mục: ${resolvedCategory}`)
        setStatus('success')
        return
      }
      case 'filterPrice':
        if (intent.mode === 'max') {
          params.set('max', String(intent.amount))
        } else {
          params.set('min', String(intent.amount))
        }
        navigate(`/products?${params.toString()}`)
        setFeedback(
          intent.mode === 'max'
            ? `Đã lọc giá dưới ${intent.amount.toLocaleString('vi-VN')} VND`
            : `Đã lọc giá trên ${intent.amount.toLocaleString('vi-VN')} VND`,
        )
        setStatus('success')
        return
      case 'unknown':
      default:
        setStatus('error')
        setFeedback('Không nhận diện được lệnh. Hãy nói chậm hơn và dùng đúng mẫu lệnh.')
    }
  }

  function startListening() {
    if (!isSupported) {
      setStatus('unsupported')
      setFeedback('Trình duyệt của bạn không hỗ trợ Web Speech API.')
      return
    }

    const Recognition = getRecognitionConstructor()
    if (!Recognition) {
      setStatus('unsupported')
      setFeedback('Web Speech API hiện không khả dụng.')
      return
    }

    const recognition = new Recognition()
    recognition.lang = 'vi-VN'
    recognition.interimResults = false
    recognition.continuous = false
    recognition.maxAlternatives = 1

    recognition.onresult = (event) => {
      const spokenText = event.results[0]?.[0]?.transcript ?? ''
      const cleanedText = spokenText.trim()
      setTranscript(cleanedText)
      applyCommand(cleanedText)
    }

    recognition.onnomatch = () => {
      setStatus('error')
      setFeedback('Không nghe rõ nội dung. Bạn hãy thử lại trong môi trường yên tĩnh hơn.')
    }

    recognition.onerror = (event) => {
      setStatus('error')
      setFeedback(`Lỗi nhận diện giọng nói: ${event.error}`)
    }

    recognition.onend = () => {
      recognitionRef.current = null
      setStatus((previous) => (previous === 'listening' ? 'idle' : previous))
    }

    recognitionRef.current = recognition
    setStatus('listening')
    setFeedback('Đang nghe... mời bạn nói lệnh.')
    recognition.start()
  }

  function stopListening() {
    recognitionRef.current?.stop()
    recognitionRef.current = null
    setStatus('idle')
    setFeedback('Đã dừng nghe.')
  }

  return {
    status,
    transcript,
    feedback,
    isSupported,
    startListening,
    stopListening,
  }
}
