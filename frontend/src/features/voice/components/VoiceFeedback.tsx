import { useState } from 'react'
import { supportedVoiceCommands } from '../commandConfig'

type VoiceFeedbackProps = {
  message: string
  transcript: string
  statusText: string
  isListening: boolean
  onStop: () => void
  onClose: () => void
}

function VoiceFeedback({
  message,
  transcript,
  statusText,
  isListening,
  onStop,
  onClose,
}: VoiceFeedbackProps) {
  const [isCommandListOpen, setIsCommandListOpen] = useState(false)

  return (
    <section className="voice-feedback" aria-label="Phản hồi lệnh giọng nói">
      <div className="voice-feedback-head">
        <p className="voice-feedback-title">Trung tâm lệnh giọng nói</p>
        <button type="button" className="voice-feedback-close" onClick={onClose} aria-label="Đóng">
          X
        </button>
      </div>

      <p className="voice-feedback-status">Trạng thái: {statusText}</p>
      <p className="voice-feedback-message">{message}</p>

      {transcript ? (
        <p className="voice-feedback-transcript">
          Bạn vừa nói: <strong>{transcript}</strong>
        </p>
      ) : null}

      <div className="voice-feedback-actions">
        {isListening ? (
          <button type="button" className="voice-feedback-stop" onClick={onStop}>
            Dừng mic
          </button>
        ) : (
          <span className="voice-feedback-idle">Mic đang tắt</span>
        )}

        <button
          type="button"
          className="voice-feedback-toggle"
          onClick={() => setIsCommandListOpen((previous) => !previous)}
        >
          {isCommandListOpen ? 'Ẩn lệnh' : 'Xem lệnh'}
        </button>
      </div>

      {isCommandListOpen ? (
        <div className="voice-feedback-command-list">
          <p className="voice-feedback-title">Lệnh hỗ trợ</p>
          <ul>
            {supportedVoiceCommands.map((command) => (
              <li key={command}>{command}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  )
}

export default VoiceFeedback
