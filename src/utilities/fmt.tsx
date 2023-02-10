export const SECONDS = 1000
export const MINUTE = SECONDS * 60
export const HOUR = MINUTE * 60

export function fmt(ms: number): string {
  const hours = Math.floor(ms / HOUR)
  ms -= hours * HOUR

  const minutes = Math.floor(ms / MINUTE)
  ms -= minutes * MINUTE

  const seconds = Math.floor(ms / SECONDS)

  const fmt = []

  if (hours) fmt.push(`${hours}h`)
  if (minutes) fmt.push(`${minutes}m`)
  fmt.push(`${seconds}s`)

  return fmt.join(' ')
}
