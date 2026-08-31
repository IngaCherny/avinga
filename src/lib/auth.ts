/**
 * Lightweight, client-side password gate.
 *
 * The site is a static build (GitHub Pages) with no server, so this can't be
 * true server-side auth. Instead we store only the SHA-256 *hash* of the
 * password here — the plaintext is never in the code or the repo. On unlock we
 * hash what's typed and compare. This keeps casual visitors and search engines
 * out (so the official-program videos aren't publicly shared); the videos
 * themselves stay protected by Google Drive's own sharing settings.
 *
 * To change the password: run in a terminal
 *   node -e "console.log(require('crypto').createHash('sha256').update('YOUR NEW PASSWORD').digest('hex'))"
 * and paste the result below.
 */
export const PASSWORD_SHA256 =
  '40049d1412b74261b4baf284c76c453aa86c2c1a0d9336356ff66918ecc17138'

/** Persists the "unlocked on this device" flag so you don't retype each visit. */
const UNLOCK_KEY = 'liift-more:unlocked:v1'

/** SHA-256 hex digest of a string, using the browser's Web Crypto. */
async function sha256Hex(input: string): Promise<string> {
  const bytes = new TextEncoder().encode(input)
  const digest = await crypto.subtle.digest('SHA-256', bytes)
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

/** Does the entered password match? */
export async function checkPassword(entered: string): Promise<boolean> {
  try {
    const hash = await sha256Hex(entered)
    return hash === PASSWORD_SHA256
  } catch {
    return false
  }
}

export function isUnlocked(): boolean {
  try {
    return localStorage.getItem(UNLOCK_KEY) === PASSWORD_SHA256
  } catch {
    return false
  }
}

export function rememberUnlocked(): void {
  try {
    localStorage.setItem(UNLOCK_KEY, PASSWORD_SHA256)
  } catch {
    /* storage may be unavailable (private mode) — the session still unlocks */
  }
}

export function lock(): void {
  try {
    localStorage.removeItem(UNLOCK_KEY)
  } catch {
    /* ignore */
  }
}
