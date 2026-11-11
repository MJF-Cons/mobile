/* MJF — Contrôle chantier (téléphone) : garde la page disponible hors ligne.
   Réseau d'abord (toujours la dernière version quand il y a du réseau), copie locale sinon. Les appels Supabase ne sont pas mis en cache. */
const CACHE = 'mjf-ctrl-v1';
const FILES = ['controle.html', 'controle.webmanifest', 'controle-icon.svg', 'controle-icon-192.png', 'controle-icon-512.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('mjf-ctrl-') && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin || !FILES.some(f => u.pathname.endsWith('/' + f))) return;
  e.respondWith(fetch(e.request).then(r => { const cp = r.clone(); caches.open(CACHE).then(c => c.put(e.request, cp)); return r; })
    .catch(() => caches.match(e.request, { ignoreSearch: true })));
});
