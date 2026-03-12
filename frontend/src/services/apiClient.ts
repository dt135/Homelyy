import { maybeThrowError, withLatency } from '../utils/mockApi'

type RequestConfig<T> = {
  shouldFail?: boolean
  failMessage?: string
  handler: () => Promise<T> | T
}

export async function mockRequest<T>({
  shouldFail,
  failMessage,
  handler,
}: RequestConfig<T>): Promise<T> {
  maybeThrowError(failMessage ?? 'Yêu cầu thất bại', Boolean(shouldFail))
  const payload = await handler()
  return withLatency(payload)
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }
  return 'Đã xảy ra lỗi không mong muốn. Vui lòng thử lại.'
}
