import { useCallback, useEffect, useRef, useState } from 'react'

type DeferredDeleteOptions = {
  label: string
  commit: () => Promise<void>
  rollback: () => void
}

type PendingDelete = {
  label: string
  commit: () => Promise<void>
  rollback: () => void
  expiresAt: number
}

type UseDeferredDeleteOptions = {
  delayMs?: number
  onCommitError: (error: unknown) => void
}

export function useDeferredDelete({
  delayMs = 5000,
  onCommitError,
}: UseDeferredDeleteOptions) {
  const [pendingDelete, setPendingDelete] = useState<PendingDelete | null>(null)
  const [remainingSeconds, setRemainingSeconds] = useState(0)
  const timerRef = useRef<ReturnType<typeof window.setTimeout> | null>(null)
  const intervalRef = useRef<ReturnType<typeof window.setInterval> | null>(null)
  const pendingRef = useRef<PendingDelete | null>(null)

  const clearPendingState = useCallback(() => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current)
      timerRef.current = null
    }
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    pendingRef.current = null
    setPendingDelete(null)
    setRemainingSeconds(0)
  }, [])

  const commitDelete = useCallback(
    async (target?: PendingDelete | null) => {
      const current = target ?? pendingRef.current
      if (!current) {
        return
      }

      if (pendingRef.current === current) {
        clearPendingState()
      }

      try {
        await current.commit()
      } catch (error) {
        current.rollback()
        onCommitError(error)
      }
    },
    [clearPendingState, onCommitError],
  )

  const queueDelete = useCallback(
    async ({ label, commit, rollback }: DeferredDeleteOptions) => {
      if (pendingRef.current) {
        await commitDelete(pendingRef.current)
      }

      const expiresAt = Date.now() + delayMs
      const nextPending = { label, commit, rollback, expiresAt }
      pendingRef.current = nextPending
      setPendingDelete(nextPending)
      setRemainingSeconds(Math.ceil(delayMs / 1000))

      intervalRef.current = window.setInterval(() => {
        const currentPending = pendingRef.current
        if (!currentPending) {
          return
        }

        const nextRemainingSeconds = Math.max(
          0,
          Math.ceil((currentPending.expiresAt - Date.now()) / 1000),
        )
        setRemainingSeconds(nextRemainingSeconds)
      }, 250)

      timerRef.current = window.setTimeout(() => {
        void commitDelete(nextPending)
      }, delayMs)
    },
    [commitDelete, delayMs],
  )

  const undoDelete = useCallback(() => {
    const current = pendingRef.current
    if (!current) {
      return
    }
    current.rollback()
    clearPendingState()
  }, [clearPendingState])

  useEffect(() => () => clearPendingState(), [clearPendingState])

  return {
    pendingDelete,
    remainingSeconds,
    queueDelete,
    undoDelete,
  }
}
