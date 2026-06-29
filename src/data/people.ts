export interface Person {
  id: string
  name: string
  /** Single-letter avatar fallback. */
  initial: string
  /** Tailwind classes for the avatar chip. */
  avatarClass: string
}

/**
 * The two friends keeping each other accountable.
 * Each person tracks their own completed workouts.
 */
export const PEOPLE: Person[] = [
  {
    id: 'inga',
    name: 'Inga',
    initial: 'I',
    avatarClass: 'bg-rose text-white',
  },
  {
    id: 'aviv',
    name: 'Aviv',
    initial: 'A',
    avatarClass: 'bg-camel text-white',
  },
]

export const DEFAULT_PERSON_ID = PEOPLE[0].id

export function personById(id: string): Person {
  return PEOPLE.find((p) => p.id === id) ?? PEOPLE[0]
}

/**
 * Resolve a free-form string (from a `?me=` link) to a known person id.
 * Matches by id or name, case-insensitively. Returns null if unknown.
 */
export function resolvePersonId(input: string | null | undefined): string | null {
  if (!input) return null
  const needle = input.trim().toLowerCase()
  const match = PEOPLE.find(
    (p) => p.id.toLowerCase() === needle || p.name.toLowerCase() === needle,
  )
  return match ? match.id : null
}
