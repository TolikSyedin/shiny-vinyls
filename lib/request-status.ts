import type { RequestStatus } from '@/types/database'

const ALLOWED_TRANSITIONS: Record<RequestStatus, RequestStatus[]> = {
  new: ['contacted', 'cancelled'],
  contacted: ['in_progress', 'cancelled'],
  in_progress: ['done', 'cancelled'],
  done: [],
  cancelled: [],
}

export function isValidStatusTransition(
  from: RequestStatus,
  to: RequestStatus,
): boolean {
  if (from === to) return false // немає сенсу "переходити" в той самий стан
  return ALLOWED_TRANSITIONS[from].includes(to)
}
