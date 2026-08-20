import type { RequestStatus, ReviewStatus } from '@/types/database'

export const adminRequestStatusLabels: Record<RequestStatus, string> = {
  new: 'Нова',
  contacted: "На зв'язку",
  in_progress: 'В процесі',
  done: 'Готово',
  cancelled: 'Скасовано',
}

export const adminReviewStatusLabels: Record<ReviewStatus, string> = {
  pending: 'На розгляді',
  approved: 'Схвалено',
  rejected: 'Відхилено',
}
