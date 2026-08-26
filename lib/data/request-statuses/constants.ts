import type { RequestStatus } from '@/types/database'

export const requestStatusLabels: Record<RequestStatus, string> = {
  new: "Дякуємо, ми отримали Ваше замовлення і звʼяжемось з Вами найближчим часом",
  contacted:
    "Ми вже звʼязались з Вами, у випадку запитань — звертайтесь в Telegram або за контактним номером телефону",
  in_progress: 'Ваші платівки миються та сушаться — зовсім скоро будуть готові',
  done: 'Ваші платівки вже блищать і чекають на Вас',
  cancelled: 'Замовлення скасовано',
}
