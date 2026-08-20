import { PageContainer } from '@/components/layout'
import { PageHeader } from '@/components/common'
import { Note } from '@/components/ui'

export const metadata = {
  title: 'Контакти — Shiny Vinyls',
}

export default function ContactsPage() {
  return (
    <PageContainer>
      <PageHeader
        eyebrow="Контакти"
        title="Shiny Vinyls"
        lead="Сервіс ультразвукової мийки вінілових платівок. Приймаємо заявки по всій Україні. м. Київ. Самовивіз / доставка"
      />
      {/* TODO: Add correct phone number when ready */}
      <p>
        Телефон: <a href="tel:+380000000000">+380 00 000 00 00</a>
      </p>
      {/* TODO: Add correct telegram when ready */}
      <p>
        Telegram: <a href="https://t.me/shinyvinyls">@shinyvinyls</a>
      </p>
      <Note>Платівки можна привезти особисто або надіслати Новою поштою.</Note>
    </PageContainer>
  )
}
