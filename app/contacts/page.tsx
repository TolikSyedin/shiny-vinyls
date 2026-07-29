export const metadata = {
  title: 'Контакти — Shiny Vinyls',
}

export default function ContactsPage() {
  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-4 p-8">
      <h1 className="text-2xl font-semibold">Контакти</h1>
      {/* TODO: Add correct phone number when ready */}
      <p>
        Телефон: <a href="tel:+380000000000">+380 00 000 00 00</a>
      </p>
      {/* TODO: Add correct telegram when ready */}
      <p>
        Telegram: <a href="https://t.me/shinyvinyls">@shinyvinyls</a>
      </p>
      <p className="text-muted-foreground">
        Приймаємо заявки на мийку вінілових платівок ультразвуком по всій
        Україні.
      </p>
    </main>
  )
}
