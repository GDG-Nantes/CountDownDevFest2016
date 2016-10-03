'use strict';

let cacheFileName = "legonnaryModeratorCache-v{timestamp}";
let cacheCdnName = "legonnaryModeratorCdnCache-v0";

let filesToCache = [
    './',
    './moderator.html',
    './bundle_moderator.js',
    './css/moderator.css',
    './assets/img/favicon.ico',
    './assets/img/launcher_moderator_144.png',
    './assets/img/launcher_moderator_192.png',
    './assets/img/launcher_moderator_512.png',
    './assets/img/lego_painter.png',
    './assets/img/lego_painter_128.png',
    './assets/fonts/LEGO_BRIX.ttf',
    './manifest_moderator.json'
];

let cdnToCache = [
  "https://fonts.googleapis.com/",
  "https://cdnjs.cloudflare.com/",
  "https://www.gstatic.com/",
  "https://ajax.googleapis.com/",
  "https://rawgit.com/",
  "https://www.google-analytics.com/",
  "https://code.getmdl.io/",
  "https://fonts.gstatic.com/"  
];

self.addEventListener('install', function(e) {
    console.log('[ServiceWorker] Install');
    e.waitUntil(
        caches.open(cacheFileName)
            .then(function(cache) {
                console.log('[ServiceWorker] Caching app shell');
                return cache.addAll(filesToCache);
            })
    );
});

self.addEventListener('activate', function(e) {
    console.log('[ServiceWorker] Activate');
    e.waitUntil(
        caches.keys().then(function(keyList) {
            return Promise.all(keyList.map(function(key) {
                if (key !== cacheFileName && key != cacheCdnName) {
                    console.log('[ServiceWorker] Removing old cache', key);
                    return caches.delete(key);
                }
            }));
        })
    );
});

self.addEventListener('fetch', function(e) {
    console.log('[ServiceWorker] Fetch', e.request.url);
    if (cdnToCache.find((element)=>{return e.request.url.indexOf(element) === 0;})) {
        e.respondWith(
            fetch(e.request)
                .then(function(response) {
                    return caches.open(cacheCdnName).then(function(cache) {
                        cache.put(e.request.url, response.clone());
                        console.log('[ServiceWorker] Fetched&Cached Data');
                        return response;
                    });
                })
        );
    } else {
        e.respondWith(
            caches.match(e.request).then(function(response) {
                return response || fetch(e.request);
            })
        );
    }
});