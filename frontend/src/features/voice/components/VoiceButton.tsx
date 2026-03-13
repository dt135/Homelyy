type VoiceButtonProps = {
  isListening: boolean
  isSupported: boolean
  onStart: () => void
  onStop: () => void
}

function VoiceButton({ isListening, isSupported, onStart, onStop }: VoiceButtonProps) {
  const actionLabel = isListening ? 'Dừng ghi âm' : 'Bật ghi âm'

  return (
    <button
      type="button"
      className={`voice-button ${isListening ? 'is-listening' : ''}`}
      onClick={isListening ? onStop : onStart}
      disabled={!isSupported}
      aria-label={actionLabel}
      title={actionLabel}
    >
      <span className="voice-button-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" role="presentation">
          <rect x="9" y="3" width="6" height="11" rx="3" />
          <path d="M6 11a6 6 0 1 0 12 0" />
          <path d="M12 17v4" />
          <path d="M9 21h6" />
        </svg>
      </span>
    </button>
  )
}

export default VoiceButton
