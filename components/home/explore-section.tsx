import { CardGridSection, type CardGridItem } from '@/components/common'

const ITEMS: CardGridItem[] = [
  {
    href: '/how-it-works',
    label: '01 · Послуга',
    title: 'Процес і ціни',
    note: 'Чотири етапи від прийому до трекінгу виконання замовлення, що входить у ціну, і відповіді на часті питання.',
  },
  {
    href: '/reviews',
    label: '02 · Відгуки',
    title: 'Що кажуть власники',
    note: 'Колекціонери, діджеї та люди, які просто дістали батьківський ящик із балкона.',
  },
  {
    href: '/request',
    label: '03 · Замовлення',
    title: 'Калькулятор',
    note: 'Вкажіть кількість платівок і сума порахується в залежності від тарифу.',
  },
]

export function ExploreSection() {
  return <CardGridSection eyebrow="Розділи" heading="Куди далі" items={ITEMS} />
}
