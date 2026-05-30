const APP_CACHE = 'kam-stable-app-v172-dialogue'
const RUNTIME_CACHE = 'kam-stable-runtime-v172-dialogue'
const APP_SHELL = ['/', '/manifest.webmanifest', '/icon.svg']

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(APP_CACHE).then(cache => cache.addAll(APP_SHELL)).then(() => self.skipWaiting())
  )
})

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => ![APP_CACHE, RUNTIME_CACHE].includes(k)).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  )
})

self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting()
})

self.addEventListener('fetch', event => {
  const req = event.request
  if (req.method !== 'GET') return
  const url = new URL(req.url)
  if (url.origin !== self.location.origin) return
  if (url.pathname.startsWith('/api/')) return

  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then(res => {
          const clone = res.clone()
          caches.open(RUNTIME_CACHE).then(cache => cache.put(req, clone))
          return res
        })
        .catch(() => caches.match(req).then(cached => cached || caches.match('/')))
    )
    return
  }

  event.respondWith(
    fetch(req)
      .then(res => {
        if (res.ok) {
          const clone = res.clone()
          caches.open(RUNTIME_CACHE).then(cache => cache.put(req, clone))
        }
        return res
      })
      .catch(() => caches.match(req))
  )
})
