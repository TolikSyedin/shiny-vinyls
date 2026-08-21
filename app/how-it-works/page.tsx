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
import { cx } from '@/lib/utils/cx'

const PROCESS_STEPS = [
  {
    number: '01',
    title: 'Огляд під скісним світлом',
    note: 'Дивимося кожну платівку під кутом і фіксуємо стан: наліт, мікроподряпини, глибокі риски, деформацію. Те, що чищення не виправить, показуємо одразу.',
  },
  {
    number: '02',
    title: 'Ультразвукова ванна',
    note: 'Платівка повільно обертається у ванні 40 кГц із підігрітим розчином. Кавітаційні бульбашки лопаються всередині канавки й виносять бруд зі стінок.',
  },
  {
    number: '03',
    title: 'Ополіскування й сушіння',
    note: 'Знімаємо залишки розчину чистою водою й сушимо без розводів — інакше висохлий розчин у канавці знову збирає пил.',
  },
  {
    number: '04',
    title: 'Контроль і видача',
    note: 'Повторний огляд, звіт про стан і код замовлення. Платівки віддаємо вертикально в тій самій тарі, в якій прийняли.',
  },
]

const EQUIPMENT_SPECS = [
  {
    value: '40 кГц',
    title: 'Частота',
    note: 'Стандарт для вінілу. Нижчі частоти дають грубішу кавітацію, яка вже небезпечна для полімеру.',
  },
  {
    value: '180 Вт',
    title: 'Ультразвук',
    note: 'Плюс 300 Вт підігріву: теплий розчин розчиняє жир від пальців у рази швидше за холодний.',
  },
  {
    value: '6 л · сталь 304',
    title: 'Ванна',
    note: 'Нержавіюча ванна, розчин фільтрується й міняється за графіком, а не «поки не потемніє».',
  },
  {
    value: '20–40 хв',
    title: 'Цикл',
    note: 'До чотирьох платівок за раз. Час залежить від ступеня забруднення, а не від того, скільки нам зручно.',
  },
]

const COMPARISON = [
  {
    kicker: 'Щітка й серветка',
    body: 'Знімає тільки те, що лежить згори. По запиленій поверхні тканина тягне пісок за собою й малює концентричні риски — найпоширеніша причина мікроподряпин у домашніх колекціях.',
  },
  {
    kicker: 'Вакуумна мийка',
    body: 'Значно ефективніша за щітку, але залишається контактною: розчин розтирають губкою і знімають вакуумом. Одна сторона за прохід, платівку перевертають вручну, губки й фірмовий розчин — витратники. Глибина канавки все одно опрацьовується механічно, тобто частково.',
  },
  {
    kicker: 'Ультразвук',
    body: 'Кавітація виникає в самій рідині, а рідина заходить у канавку повністю — на всю висоту стінки під кутом 45°, куди не дістає ні ворс, ні губка. Обидві сторони за один цикл, до чотирьох платівок одночасно, поверхні не торкається нічого.',
    highlight: true,
  },
]

const INCLUDED_LEFT = [
  'Ультразвукова ванна 40 кГц із підігрівом',
  'Ополіскування чистою водою й сушіння без розводів',
  'Обидві сторони за один цикл',
]

const INCLUDED_RIGHT = [
  'Огляд до і після, зі звітом про стан',
  'Чищення етикетки по краю без намокання',
  'Код замовлення для відстеження партії',
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
    answer: 'Ні. На 40 кГц бульбашки кавітації малі й діють у масштабі частинок бруду. Ризик несуть низька частота й надмірна потужність — ми не використовуємо ні того, ні того.',
  },
  {
    question: 'Чи зникнуть клацання й тріск?',
    answer: 'Той шум, що від бруду — так, і його зазвичай більшість. Той, що від мікроподряпин і зношеної канавки — ні. На огляді видно, чого саме чекати.',
  },
  {
    question: 'Чи треба чистити нові платівки?',
    answer: 'Так, і це найнедооціненіший випадок. На новому вінілі лишаються залишки прес-форми — той сірий наліт, який чути як шурхіт із першого програвання.',
  },
  {
    question: 'Скільки це триває?',
    answer: 'До 10 платівок — 2–3 робочі дні. Великі колекції — від тижня, залежно від стану. Термін фіксуємо перед початком.',
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
        <SectionHeading eyebrow="Обладнання">Характеристики ванни</SectionHeading>
        <CardGrid cols={4} className="mt-[1.5rem]">
          {EQUIPMENT_SPECS.map(({ value, title, note }) => (
            <Card key={title}>
              <Mono tone="stamp">{value}</Mono>
              <h3>{title}</h3>
              <Note>{note}</Note>
            </Card>
          ))}
        </CardGrid>
      </Section>

      <Section>
        <SectionHeading eyebrow="Порівняння">
          Ультразвук проти інших методів
        </SectionHeading>
        <div className="mt-[1.5rem] flex flex-col">
          {COMPARISON.map(({ kicker, body, highlight }, index) => (
            <div
              key={kicker}
              className={cx(
                'border border-[var(--rule)] p-[clamp(1rem,2.5vw,1.5rem)]',
                index > 0 && '-mt-px',
                index === 0 && 'rounded-t-[0.3rem]',
                index === COMPARISON.length - 1 && 'rounded-b-[0.3rem]',
                highlight
                  ? 'relative z-10 border-[var(--stamp)]'
                  : 'bg-[var(--surface-2)]',
              )}
            >
              <Mono
                tone={highlight ? 'stamp' : 'muted'}
                className="uppercase tracking-[0.08em]"
              >
                {kicker}
              </Mono>
              <Note className="mt-[0.5rem] max-w-none">{body}</Note>
            </div>
          ))}
        </div>
        <Note className="mt-[1.125rem]">
          Чесна межа: ультразвук прибирає <strong>бруд</strong>.
          Мікроподряпини, зношену канавку й глибокі риски він не лікує — це
          фізична втрата матеріалу, і ми кажемо про це на огляді, а не після
          оплати.
        </Note>
        <Row className="mt-[1.5rem]">
          <CtaLink href="/blog" variant="ghost">
            Розгорнуте порівняння
          </CtaLink>
        </Row>
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
