import type { RequestStatus } from '@/types/database'

export const requestStatusLabels: Record<RequestStatus, string> = {
  new: "Дякуємо, ми отримали Вашу заявку і зв'яжемось з Вами найближчим часом",
  contacted:
    "Ми вже зв'язались з Вами, у випадку запитань — звертайтесь в Telegram або за контактним крномером телефону",
  in_progress: 'Ваші платівки миються та сушаться — зовсім скоро будуть готові',
  done: 'Ваші платівки вже блищать і чекають на Вас',
  cancelled: 'Замовлення скасовано',
}
