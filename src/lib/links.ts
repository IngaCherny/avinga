import { useSyncExternalStore } from 'react'

/**
 * Drive links, kept ON THIS DEVICE only.
 *
 * The app's source is public, so the Google Drive IDs for the official program
 * videos and PDFs must not live in it — anyone reading the repo could open the
 * whole library. Instead each person pastes the link bundle into the app once
 * per device and it is held in localStorage, exactly like the weight log.
 *
 * Nothing here is ever uploaded, and nothing here is in the repository.
 */
const STORAGE_KEY = 'liift-more:links:v1'

/** A Drive file/folder id: what sits between /d/ and /view in a share link. */
const ID_RE = /^[A-Za-z0-9_-]{10,}$/

export interface LinkBundle {
  /** Drive folder holding the videos; used when a day has no video of its own. */
  folder?: string
  /** Program day (1-56) -> Drive file id. */
  videos: Record<number, string>
  /** Resource key (see data/resources.ts) -> Drive file or folder id. */
  resources: Record<string, string>
}

const EMPTY: LinkBundle = { videos: {}, resources: {} }

/* ------------------------------------------------------------------ */
/*  Store                                                              */
/* ------------------------------------------------------------------ */

let cache: LinkBundle = EMPTY
let loaded = false
const listeners = new Set<() => void>()

function read(): LinkBundle {
  if (typeof localStorage === 'undefined') return EMPTY
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? normalise(JSON.parse(raw)) : EMPTY
  } catch {
    return EMPTY
  }
}

/** Current bundle, loading it from storage on first use. */
export function links(): LinkBundle {
  if (!loaded) {
    cache = read()
    loaded = true
  }
  return cache
}

function emit() {
  for (const l of listeners) l()
}

function subscribe(fn: () => void): () => void {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

/** Re-render on every change to the stored links. */
export function useLinks(): LinkBundle {
  return useSyncExternalStore(subscribe, links, () => EMPTY)
}

// Keep other tabs in sync.
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEY) {
      cache = read()
      loaded = true
      emit()
    }
  })
}

/* ------------------------------------------------------------------ */
/*  Reading                                                            */
/* ------------------------------------------------------------------ */

export const fileUrl = (id: string) => `https://drive.google.com/file/d/${id}/view`
export const folderUrl = (id: string) => `https://drive.google.com/drive/folders/${id}`

/**
 * Where "Watch" should go for a program day: that day's own video, else the
 * folder, else nowhere (the button hides until links are added).
 */
export function videoUrlFor(day: number): string | undefined {
  const l = links()
  const id = l.videos[day]
  if (id) return fileUrl(id)
  return l.folder ? folderUrl(l.folder) : undefined
}

/** The URL for one program guide, or undefined if it hasn't been linked. */
export function resourceUrl(key: string, kind: 'file' | 'folder'): string | undefined {
  const id = links().resources[key]
  if (!id) return undefined
  return kind === 'folder' ? folderUrl(id) : fileUrl(id)
}

/** Has anything been linked on this device yet? */
export function hasLinks(): boolean {
  const l = links()
  return Boolean(l.folder) || Object.keys(l.videos).length > 0 || Object.keys(l.resources).length > 0
}

export function counts(): { videos: number; resources: number; folder: boolean } {
  const l = links()
  return {
    videos: Object.keys(l.videos).length,
    resources: Object.keys(l.resources).length,
    folder: Boolean(l.folder),
  }
}

/* ------------------------------------------------------------------ */
/*  Writing                                                            */
/* ------------------------------------------------------------------ */

/** Coerce arbitrary parsed JSON into a valid bundle, dropping anything odd. */
function normalise(raw: unknown): LinkBundle {
  if (!raw || typeof raw !== 'object') throw new Error('not a link bundle')
  const r = raw as Record<string, unknown>
  const out: LinkBundle = { videos: {}, resources: {} }

  if (typeof r.folder === 'string' && ID_RE.test(r.folder)) out.folder = r.folder

  if (r.videos && typeof r.videos === 'object') {
    for (const [k, v] of Object.entries(r.videos as Record<string, unknown>)) {
      const day = Number(k)
      if (!Number.isInteger(day) || day < 1 || day > 56) continue
      if (typeof v === 'string' && ID_RE.test(v)) out.videos[day] = v
    }
  }

  if (r.resources && typeof r.resources === 'object') {
    for (const [k, v] of Object.entries(r.resources as Record<string, unknown>)) {
      if (typeof v === 'string' && ID_RE.test(v)) out.resources[k] = v
    }
  }

  return out
}

/** Import a pasted bundle. Throws if it contains nothing usable. */
export function importLinks(text: string): { videos: number; resources: number } {
  const bundle = normalise(JSON.parse(text))
  if (!bundle.folder && !Object.keys(bundle.videos).length && !Object.keys(bundle.resources).length) {
    throw new Error('no usable links in that text')
  }
  cache = bundle
  loaded = true
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bundle))
  } catch {
    /* storage unavailable — the links still work for this session */
  }
  emit()
  return { videos: Object.keys(bundle.videos).length, resources: Object.keys(bundle.resources).length }
}

/** The current bundle as pretty JSON, to carry to another device. */
export function exportLinks(): string {
  return JSON.stringify({ app: 'liift-more', kind: 'links', version: 1, ...links() }, null, 2)
}

/** Forget every link on this device. */
export function clearLinks(): void {
  cache = EMPTY
  loaded = true
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    /* ignore */
  }
  emit()
}
