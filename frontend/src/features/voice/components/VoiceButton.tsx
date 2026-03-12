type VoiceButtonProps = {
  isListening: boolean
  isSupported: boolean
  onStart: () => void
  onStop: () => void
}

function VoiceButton({ isListening, isSupported, onStart, onStop }: VoiceButtonProps) {
  return (
    <button
      type="button"
      className={`voice-button ${isListening ? 'is-listening' : ''}`}
      onClick={isListening ? onStop : onStart}
      disabled={!isSupported}
      aria-label="Nút điều khiển giọng nói"
    >
      {isListening ? 'Dừng mic' : 'Giọng nói'}
    </button>
  )
}

export default VoiceButton
