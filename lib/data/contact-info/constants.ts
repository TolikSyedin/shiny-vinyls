export const CONTACT_INFO = {
  phone: {
    raw: '+380984233699',
    display: '+38 098 423 36 99',
  },
  telegram: {
    handle: '@shinyvinyls',
    url: 'https://t.me/shinyvinyls',
  },
  email: 'info@shinyvinyls.com.ua',
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
