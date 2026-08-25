export const CONTACT_INFO = {
  phone: {
    raw: '+380671480148',
    display: '+38 067 148 01 48',
  },
  telegram: {
    handle: '@shinyvinyls',
    url: 'https://t.me/shinyvinyls',
  },
  email: 'hello@shinyvinyls.com',
  address: {
    street: 'Львівська площа',
    city: 'Київ',
  },
  hours: [
    { days: 'Пн–Пт', time: '11:00–19:00' },
    { days: 'Сб', time: '12:00–16:00' },
    { days: 'Нд', time: 'зачинено' },
  ],
} as const
