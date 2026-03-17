type AdminUndoToastProps = {
  message: string
  remainingSeconds: number
  onUndo: () => void
}

function AdminUndoToast({ message, remainingSeconds, onUndo }: AdminUndoToastProps) {
  return (
    <div className="admin-undo-toast" role="status" aria-live="polite">
      <p>{message}</p>
      <button type="button" className="ghost-btn" onClick={onUndo}>
        {`Hoàn tác (${remainingSeconds}s)`}
      </button>
    </div>
  )
}

export default AdminUndoToast
