import { CardGridSection, type CardGridItem } from '@/components/common'

const ITEMS: CardGridItem[] = [
  {
    title: 'Тиша між треками',
    note: 'Ультразвукова кавітація вибиває з канавки те, чого щітка не дістає: пил, залишки прес-форми, старі рідини.',
  },
  {
    title: 'Жодного контакту',
    note: 'Платівку не тре ніщо, крім рідини. Немає ризику нових потертостей і статики — на відміну від сухого чищення.',
  },
  {
    title: 'Голка живе довше',
    note: 'Бруд у доріжці працює як абразив. Чиста платівка економить вашу голку значно більше, ніж коштує чищення.',
  },
]

export function WhatYouGetSection() {
  return (
    <CardGridSection
      eyebrow="Що ви отримуєте"
      heading="Три речі, які чути з першої доріжки"
      items={ITEMS}
    />
  )
}
