import { PageContainer } from '@/components/layout'
import {
  ColumnContentSection,
  PageHeader,
  Section,
  SectionHeading,
} from '@/components/common'
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
    note: 'Нержавіюча ванна, розчин фільтрується й міняється після кожного циклу помивки.',
  },
  {
    value: '20–40 хв',
    title: 'Цикл',
    note: 'Час залежить здебільшого від ступеня забруднення. Кожна партія уважно оглядається і оцінюється перед початком процесу.',
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
    body: 'Кавітація виникає в самій рідині, а рідина заходить у канавку повністю — на всю висоту стінки під кутом 45°, куди не дістає ні ворс, ні губка. Обидві сторони за один цикл, і поверхні нічого не торкається.',
    highlight: true,
  },
]

const INCLUDED_LEFT = [
  'Ультразвукова ванна 40 кГц із підігрівом',
  'Обидві сторони за один цикл',
  'Ополіскування чистою водою й сушіння без розводів',
]

const INCLUDED_RIGHT = [
  'Огляд до і після, зі звітом про стан',
  'Зворотня відправка',
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
    answer:
      'Ні. На 40 кГц бульбашки кавітації малі й діють у масштабі частинок бруду. Ризик несуть низька частота й надмірна потужність — ми не використовуємо ні того, ні того.',
  },
  {
    question: 'Чи зникнуть клацання й тріск?',
    answer:
      'Той шум, що від бруду — так, і його зазвичай більшість. Той, що від мікроподряпин і зношеної канавки — ні. На огляді видно, чого саме чекати.',
  },
  {
    question: 'Чи треба чистити нові платівки?',
    answer:
      'Так, і це найнедооціненіший випадок. На новому вінілі лишаються залишки прес-форми — той сірий наліт, який чути як шурхіт із першого програвання.',
  },
  {
    question: 'Скільки це триває?',
    answer:
      'До 10 платівок — 2–3 робочі дні. Великі колекції — від тижня, залежно від стану. Термін узгоджуємо та фіксуємо перед початком.',
  },
]

export const metadata = { title: 'Послуга — Shiny Vinyls' }

export default function HowItWorksPage() {
  return (
    <PageContainer>
      <PageHeader
        eyebrow="Послуга"
        title="Основні кроки які продляють життя вашому вінілу"
        lead="Кожна платівка мріє про такий SPA салон, в якому її викупають в теплій ванні, помиють, висушать, і відправлять назад радувати своїх власників"
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
        <SectionHeading eyebrow="Обладнання">
          Характеристики ванни
        </SectionHeading>
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

      <ColumnContentSection
        eyebrow="Порівняння"
        heading="Ультразвук проти інших методів"
        items={COMPARISON}
        footnote={
          <>
            Слід зауважити: ультразвук прибирає <strong>бруд</strong>.
            Мікроподряпини, зношену канавку й глибокі риски він не лікує — це
            фізична втрата матеріалу, і ми кажемо про це на огляді, а не після
            оплати.
          </>
        }
      >
        <Row className="mt-[1.5rem]">
          <CtaLink href="/blog" variant="ghost">
            Розгорнуте порівняння
          </CtaLink>
        </Row>
      </ColumnContentSection>

      <Section>
        <SectionHeading eyebrow="Входить у ціну">
          Без окремих доплат
        </SectionHeading>
        <div className="mt-[1.5rem] grid gap-[1.5rem] md:grid-cols-2">
          <NeedleList items={INCLUDED_LEFT} />
          <NeedleList items={INCLUDED_RIGHT} />
        </div>
        <Row className="mt-[1.5rem]">
          <CtaLink href="/reviews" variant="ghost">
            Відгуки наших клієнтів
          </CtaLink>
        </Row>
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
        <Row className="mt-[1.5rem]">
          <CtaLink href="/request">Порахувати замовлення</CtaLink>
          <CtaLink href="/contacts" variant="ghost">
            Спитати наперед
          </CtaLink>
        </Row>
      </Section>

      <Section>
        <SectionHeading eyebrow="Часті питання">
          Що частіше за все питають про послугу
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

      <Section>
        <div className="flex flex-col items-start gap-[0.75rem]">
          <h3>Чогось не вистачає?</h3>
          <Note>Маєте питання, відповіді на яке тут нема? Напишіть нам.</Note>
          <CtaLink href="/contacts" className="mt-[0.25rem]">
            Написати нам
          </CtaLink>
        </div>
      </Section>
    </PageContainer>
  )
}
