const CACHE_NAME = 'banksampah-v1'

const STATIC_ASSETS = [
  '/',
  '/offline.html',
  '/manifest.json',
  '/web-app-manifest-192x192.png',
  '/web-app-manifest-512x512.png',
  '/dashboard/petugas/dashboard',
  '/dashboard/petugas/daftar-nasabah',
  '/dashboard/nasabah/dashboard',
]

// Install — cache aset statis
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS)
    })
  )
  self.skipWaiting()
})

// Activate — hapus cache lama
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    )
  )
  self.clients.claim()
})

// Fetch — strategi NetworkFirst
// Fetch — strategi NetworkFirst dengan filter offline.html yang aman
self.addEventListener('fetch', (event) => {
  // Skip non-GET & API transaksi (wajib online)
  if (event.request.method !== 'GET') return
  if (event.request.url.includes('/api/transaksi')) return

  const url = new URL(event.request.url)

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Simpan ke cache kalau berhasil
        const clone = response.clone()
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, clone)
        })
        return response
      })
      .catch(() => {
        // Gagal (offline) → coba dari cache dulu
        return caches.match(event.request).then((cached) => {
          if (cached) return cached

          // JIKA rute dinamis Next.js (bukan navigasi halaman utama luar), 
          // JANGAN lempar ke offline.html agar logic offline di page.js tetap jalan 
          if (url.pathname.includes('/dashboard/')) {
            return Response.error() // Biarkan error normal ditangkap state page.js
          }

          // Navigasi halaman biasa baru lempar ke offline.html
          if (event.request.mode === 'navigate') {
            return caches.match('/offline.html')
          }

          return Response.error()
        })
      })
  )
})