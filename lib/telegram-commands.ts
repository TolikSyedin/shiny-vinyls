export type ParsedCommand = {
  command: string
  payload?: string
}

export function parseCommand(text: string): ParsedCommand {
  const [command, ...rest] = text.trim().split(/\s+/)
  const payload = rest.join(' ') || undefined
  return { command, payload }
}
