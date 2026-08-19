export const FIELD_LABEL_CLASS_NAME =
  'font-[family-name:var(--f-mono)] text-[10px] tracking-[0.12em] text-[var(--muted)] uppercase'

export function inputClassName(error?: string) {
  return [
    'w-full rounded-[4px] border px-[13px] py-[12px] font-[family-name:var(--f-body)] text-base text-[var(--ink)] focus:outline-2 focus:-outline-offset-2 focus:outline-[var(--stamp)]',
    error ? 'border-red-500' : 'border-[var(--rule)]',
  ].join(' ')
}
