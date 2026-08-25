export function pluralizeUk(
  count: number,
  [one, few, many]: [string, string, string],
): string {
  const abs = Math.abs(Math.round(count))
  const lastTwo = abs % 100
  if (lastTwo >= 11 && lastTwo <= 14) return many
  const last = abs % 10
  if (last === 1) return one
  if (last >= 2 && last <= 4) return few
  return many
}

export function vinylsWord(count: number): string {
  return pluralizeUk(count, ['платівка', 'платівки', 'платівок'])
}
