/**
 * Keep an installed copy of the app up to date.
 *
 * The service worker is built with skipWaiting + clientsClaim, so a new build
 * takes control as soon as it installs. But taking control does NOT refresh a
 * page that is already open: it carries on running the old JavaScript until
 * something reloads it. On a phone where the app is never really "closed",
 * that showed up as the app simply not updating — you had to launch it twice.
 *
 * So: reload once when a new worker takes over, and actively check for one on
 * launch and whenever the app comes back to the foreground.
 */
export function watchForUpdates(): void {
  if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) return

  // A new worker has taken control -- pick up its assets. The guard stops the
  // reload loop you get if the new worker claims again during startup.
  let reloading = false
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (reloading) return
    reloading = true
    window.location.reload()
  })

  navigator.serviceWorker.ready.then((reg) => {
    const check = () => {
      reg.update().catch(() => {
        /* offline, or the check failed -- try again next time */
      })
    }
    check()
    // Coming back to the app is the moment worth re-checking on a phone.
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') check()
    })
    // And a slow drip for a session left open all day.
    window.setInterval(check, 60 * 60 * 1000)
  }).catch(() => {
    /* no worker registered (dev server, or unsupported) */
  })
}

/** Build stamp, so you can tell which version a device is actually running. */
export const BUILD_ID: string = __BUILD_ID__
