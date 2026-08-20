import { PageContainer } from '@/components/layout'
import { PageHeader, Section, SectionHeading } from '@/components/common'
import {
  Card,
  CardGrid,
  CtaLink,
  Mono,
  NeedleList,
  Note,
  Readout,
  Row,
} from '@/components/ui'

const PROCESS_STEPS = [
  {
    number: '01',
    title: 'Приймання й огляд',
    note: 'Оглядаємо кожну платівку під якісним світлом і фіксуємо стан: пил, відбитки пальців, механічні пошкодження. Те, що чищення не виправить, показуємо одразу.',
  },
  {
    number: '02',
    title: 'Ультразвукова ванна',
    note: 'Платівка обертається у ванні на 40 кГц. Кавітаційні бульбашки лопаються всередині звукової канавки й видаляють бруд — без контакту з поверхнею.',
  },
  {
    number: '03',
    title: 'Натуральне сушіння',
    note: 'Платівка сушиться природним способом. Це унеможливлює будь-які шанси на залишок розводів, що швидко збирають пил назад.',
  }
]

const INCLUDED_LEFT = [
  'Ультразвукова ванна 40 кГц',
  'Сушіння без розводів',
]

const INCLUDED_RIGHT = [
  'Огляд і звіт про стан платівки',
  'Чищення етикетки по краю без намокання',
]

const PRICE_TIERS = [
  {
    range: '1–10 платівок',
    price: '130 ₴',
    note: 'Базова ціна. Термін — 2–3 робочі дні.',
  },
  {
    range: '11–20 платівок',
    price: '110 ₴',
    note: 'Знижений тариф для обсягу на одну полицю.',
  },
  {
    range: '21+ платівок',
    price: '90 ₴',
    note: 'Найвигідніший тариф для великих колекцій.',
  },
]

const FAQ = [
  {
    question: 'Чи не пошкодить ультразвук платівку?',
    answer: 'Ні. На 40 кГц кавітація працює в масштабі бруду, а не вінілу. Ризик несуть висока потужність і низька частота — ми не використовуємо ні того, ні того.',
  },
  {
    question: 'Чи зникнуть клацання й тріск?',
    answer: 'Той шум, що від бруду — так. Той, що від зношеної канавки або подряпини — ні, це вже фізична втрата. На огляді видно, чого саме чекати.',
  },
  {
    question: 'Як передати платівки?',
    answer: 'Самовивіз у Києві або посилка Новою поштою. Для пересилання — пакувати платівки вертикально, у щільній коробці, порожнини максимально заповнити папером.',
  },
  {
    question: 'Скільки це триває?',
    answer: 'До 10 платівок — 2–3 робочі дні. Великі колекції — від тижня, залежно від стану. Термін узгоджуємо і фіксуємо перед початком.',
  },
]

export const metadata = { title: 'Послуга — Shiny Vinyls' }

export default function HowItWorksPage() {
  return (
    <PageContainer>
      <PageHeader
        eyebrow="Послуга"
        title="Основні кроки які продляють життя вашому вінілу"
        lead="Кожна платівка мріє про такий спа-салон, в якому її викупають в теплій ванні, помиють, посушать, і щайсливу й радісну відправлять назад до власників."
      />

      <Section>
        <SectionHeading eyebrow="Процес">Як це відбувається</SectionHeading>
        <CardGrid cols={4} className="mt-[1.5rem]">
          {PROCESS_STEPS.map(({ number, title, note }) => (
            <Card key={number}>
              <Mono tone="stamp">{number}</Mono>
              <h3>{title}</h3>
              <Note>{note}</Note>
            </Card>
          ))}
        </CardGrid>
      </Section>

      <Section>
        <SectionHeading eyebrow="Входить у ціну">
          Без окремих доплат
        </SectionHeading>
        <div className="mt-[1.5rem] grid gap-[1.5rem] md:grid-cols-2">
          <NeedleList items={INCLUDED_LEFT} />
          <NeedleList items={INCLUDED_RIGHT} />
        </div>
      </Section>

      <Section>
        <SectionHeading eyebrow="Ціни">Одна послуга, три обсяги</SectionHeading>
        <CardGrid cols={3} className="mt-[1.5rem]">
          {PRICE_TIERS.map(({ range, price, note }, index) => (
            <Card
              key={range}
              className={index === 1 ? 'border-[var(--stamp)]' : undefined}
            >
              <Mono>{range}</Mono>
              <Readout unit="за шт">{price}</Readout>
              <Note>{note}</Note>
            </Card>
          ))}
        </CardGrid>
        <Note className="mt-[1rem]">
          <strong>Пліснява й важкі випадки</strong> — потрібен окремий цикл і
          фунгіцидний розчин. Кажемо про це до роботи, не після.
        </Note>
        <Row className="mt-[1.5rem]">
          <CtaLink href="/request">Порахувати замовлення</CtaLink>
          <CtaLink href="/contacts" variant="ghost">
            Спитати наперед
          </CtaLink>
        </Row>
      </Section>

      <Section>
        <SectionHeading eyebrow="Часті питання">
          Те, що питають щотижня
        </SectionHeading>
        <CardGrid cols={2} className="mt-[1.5rem]">
          {FAQ.map(({ question, answer }) => (
            <Card
              key={question}
              flat
              className="rounded-none border-0 border-l-2 border-[var(--rule)] py-[0.25rem] pl-[1rem]"
            >
              <h3>{question}</h3>
              <Note>{answer}</Note>
            </Card>
          ))}
        </CardGrid>
      </Section>
    </PageContainer>
  )
}
