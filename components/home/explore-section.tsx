import { CardGridSection, type CardGridItem } from '@/components/common'

const ITEMS: CardGridItem[] = [
  {
    href: '/how-it-works',
    label: '01 · Послуга',
    title: 'Процес і ціни',
    note: 'Чотири етапи від приймання до антистатичного конверта, що входить у ціну, і відповіді на часті питання.',
  },
  {
    href: '/reviews',
    label: '02 · Відгуки',
    title: 'Що кажуть власники',
    note: 'Колекціонери, діджеї та люди, які просто дістали батьківський ящик із балкона.',
  },
  {
    href: '/request',
    label: '03 · Заявка',
    title: 'Порахувати вартість',
    note: 'Вкажіть кількість платівок і спосіб передачі — сума порахується одразу у формі.',
  },
]

export function ExploreSection() {
  return <CardGridSection eyebrow="Розділи" heading="Куди далі" items={ITEMS} />
}
