const MIN_LATENCY_MS = 280
const MAX_LATENCY_MS = 680

function randomLatency(): number {
  return Math.floor(Math.random() * (MAX_LATENCY_MS - MIN_LATENCY_MS + 1)) + MIN_LATENCY_MS
}

export async function withLatency<T>(payload: T): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(payload), randomLatency())
  })
}

export function maybeThrowError(message: string, trigger: boolean): void {
  if (trigger) {
    throw new Error(message)
  }
}
