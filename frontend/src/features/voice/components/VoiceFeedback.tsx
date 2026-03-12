import { supportedVoiceCommands } from '../commandConfig'

type VoiceFeedbackProps = {
  message: string
  transcript: string
}

function VoiceFeedback({ message, transcript }: VoiceFeedbackProps) {
  return (
    <section className="voice-feedback" aria-label="Phản hồi lệnh giọng nói">
      <p className="voice-feedback-title">Trung tâm lệnh giọng nói</p>
      <p className="voice-feedback-message">{message}</p>
      {transcript ? (
        <p className="voice-feedback-transcript">
          Bạn vừa nói: <strong>{transcript}</strong>
        </p>
      ) : null}

      <div>
        <p className="voice-feedback-title">Lệnh hỗ trợ</p>
        <ul>
          {supportedVoiceCommands.map((command) => (
            <li key={command}>{command}</li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default VoiceFeedback
