import { PageContainer } from '@/components/layout'
import { PageHeader, Section, SectionHeading } from '@/components/common'
import {
  Card,
  CardGrid,
  CtaLink,
  Mono,
  NeedleList,
  Note,
  PriceTag,
  Row,
} from '@/components/ui'
import { ContactForm } from '@/components/forms'
import { cx } from '@/lib/utils/cx'
import { CONTACT_INFO } from '@/lib/data/contact-info/constants'

const PACKING_TIPS = [
  'Ставте платівки вертикально — так вони не деформуються від тиску.',
  'Зовнішні обкладинки лишайте вдома, якщо вони цінні — нам потрібен тільки вініл.',
  'Щільна коробка з запасом 2–3 см з кожного боку, порожнини заповніть папером.',
]

const MAP_EMBED_SRC = `https://www.google.com/maps?q=${encodeURIComponent(
  `${CONTACT_INFO.address.street}, ${CONTACT_INFO.address.city}`,
)}&output=embed`

export const metadata = {
  title: 'Контакти — Shiny Vinyls',
}

export default function ContactsPage() {
  return (
    <PageContainer>
      <PageHeader
        eyebrow="Контакти"
        title="Shiny Vinyls"
        lead="Сервіс ультразвукової мийки вінілових платівок. Приймаємо замовлення по всій Україні. м. Київ. Самовивіз / доставка"
      />

      <Note fullWidth className="mt-[1.5rem]">
        Можна звʼязатися з нами будь-яким зручним способом. Найшвидше — через
        Telegram.
      </Note>

      <Section>
        <SectionHeading eyebrow="Звʼязок">
          Оберіть найзручніший для Вас варіант
        </SectionHeading>
        <CardGrid cols={3} className="mt-[1.5rem]">
          <Card>
            <Mono tone="stamp">Телефон</Mono>
            <a
              href={`tel:${CONTACT_INFO.phone.raw}`}
              className="font-mono text-[1rem]"
            >
              {CONTACT_INFO.phone.display}
            </a>
            <Note>
              {CONTACT_INFO.hours[0].days} {CONTACT_INFO.hours[0].time},{' '}
              {CONTACT_INFO.hours[1].days} {CONTACT_INFO.hours[1].time}
            </Note>
          </Card>
          <Card>
            <Mono tone="stamp">Telegram</Mono>
            <a
              href={CONTACT_INFO.telegram.url}
              className="font-mono text-[1rem]"
            >
              {CONTACT_INFO.telegram.handle}
            </a>
            <Note>Можна одразу надіслати фото стану платівок</Note>
          </Card>
          {/* TODO: Add email back when it's ready */}
          {/* <Card>
            <Mono tone="stamp">Пошта</Mono>
            <a
              href={`mailto:${CONTACT_INFO.email}`}
              className="font-mono text-[0.95rem]"
            >
              {CONTACT_INFO.email}
            </a>
            <Note>Для рахунків і великих колекцій</Note>
          </Card> */}
        </CardGrid>
      </Section>

      <Section>
        <SectionHeading eyebrow="Самовивіз">
          Адреса і графік роботи
        </SectionHeading>
        <div className="mt-[1.5rem] grid gap-[1.5rem] md:grid-cols-2">
          <div className="flex flex-col items-start gap-[0.875rem]">
            <p className="text-[1.05rem] leading-[1.55]">
              {CONTACT_INFO.address.street}
              <br />
              {CONTACT_INFO.address.city}
            </p>
            <Note>
              Дзвоніть за 15 хвилин — вийдемо назустріч.
            </Note>
            <PriceTag>Без передоплати</PriceTag>
          </div>
          <Card>
            <Mono tone="stamp">Графік</Mono>
            <div className="flex flex-col gap-[0.44rem] font-mono text-[0.9rem] text-[var(--ink)]">
              {CONTACT_INFO.hours.map(({ days, time }) => (
                <div
                  key={days}
                  className={cx(
                    'flex justify-between gap-[1rem]',
                    days === 'Нд' && 'text-[var(--muted)]',
                  )}
                >
                  <span>{days}</span>
                  <span>{time}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
        <div className="mt-[1.5rem] overflow-hidden rounded-[0.3rem] border border-[var(--rule)]">
          <iframe
            src={MAP_EMBED_SRC}
            title="Shiny Vinyls на мапі"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="aspect-[16/9] w-full border-0 dark:invert dark:hue-rotate-180 md:aspect-[21/9]"
          />
        </div>
      </Section>

      <Section>
        <SectionHeading eyebrow="Поштою">Як пакувати платівки</SectionHeading>
        <NeedleList items={PACKING_TIPS} className="mt-[1.5rem]" />
        <Note fullWidth className="mt-[1.125rem]">
          Зворотня відправка — за наш рахунок, якщо в замовленні більше 10
          платівок. Платівки повертаємо в тій самій коробці, в якій прийняли.
        </Note>
        <Row className="mt-[1.5rem]">
          <CtaLink href="/request">Залишити замовлення</CtaLink>
          <CtaLink href="/how-it-works" variant="ghost">
            Подивитися ціни
          </CtaLink>
        </Row>
      </Section>

      <Section>
        <SectionHeading eyebrow="Написати нам">
          Залишити повідомлення
        </SectionHeading>
        <ContactForm />
      </Section>
    </PageContainer>
  )
}
