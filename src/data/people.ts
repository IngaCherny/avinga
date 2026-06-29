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
