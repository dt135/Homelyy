import { Outlet } from 'react-router-dom'
import { useState } from 'react'
import VoiceButton from '../../features/voice/components/VoiceButton'
import VoiceFeedback from '../../features/voice/components/VoiceFeedback'
import { useVoiceCommands } from '../../features/voice/useVoiceCommands'
import Footer from './Footer'
import Header from './Header'

function MainLayout() {
  const { status, transcript, feedback, isSupported, startListening, stopListening } =
    useVoiceCommands()
  const [isVoiceCenterOpen, setIsVoiceCenterOpen] = useState(false)

  const statusText =
    status === 'listening'
      ? 'Đang nghe'
      : status === 'success'
        ? 'Đã nhận lệnh'
        : status === 'error'
          ? 'Lỗi nhận diện'
          : status === 'unsupported'
            ? 'Không hỗ trợ'
            : 'Sẵn sàng'

  function handleStartListening() {
    setIsVoiceCenterOpen(true)
    startListening()
  }

  function handleStopListening() {
    stopListening()
  }

  function handleCloseVoiceCenter() {
    stopListening()
    setIsVoiceCenterOpen(false)
  }

  return (
    <div className="app-shell">
      <Header />
      <main className="app-main">
        <div className="container">
          <Outlet />
        </div>
      </main>
      <Footer />

      <div className="voice-widget">
        <VoiceButton
          isListening={status === 'listening'}
          isSupported={isSupported}
          onStart={handleStartListening}
          onStop={handleStopListening}
        />
        {isVoiceCenterOpen ? (
          <VoiceFeedback
            message={feedback}
            transcript={transcript}
            statusText={statusText}
            isListening={status === 'listening'}
            onStop={handleStopListening}
            onClose={handleCloseVoiceCenter}
          />
        ) : null}
      </div>
    </div>
  )
}

export default MainLayout
