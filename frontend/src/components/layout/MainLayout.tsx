import { Outlet } from 'react-router-dom'
import VoiceButton from '../../features/voice/components/VoiceButton'
import VoiceFeedback from '../../features/voice/components/VoiceFeedback'
import { useVoiceCommands } from '../../features/voice/useVoiceCommands'
import Footer from './Footer'
import Header from './Header'

function MainLayout() {
  const { status, transcript, feedback, isSupported, startListening, stopListening } =
    useVoiceCommands()

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
          onStart={startListening}
          onStop={stopListening}
        />
        <VoiceFeedback message={feedback} transcript={transcript} />
      </div>
    </div>
  )
}

export default MainLayout
