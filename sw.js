/**
 * Service Worker to load Offline Page
 *
 * It will load the files listed in "CACHE_ITEMS" array and load "OFFLINE_PAGE" when user is offline.
 *
 * We are working on this and try to cache all the static source on the page
 * */
'use strict';

const CACHE_VERSION = "1.0.0";
const CACHE_NAME = 'offline-cache-' + CACHE_VERSION;
const CACHE_ITEMS = [
    'offline.html',
    'css/default.css',
    'css/patterns.css',
    'css/svg/offline.svg'
];
// Page you want to cache
const OFFLINE_PAGE = 'offline.html';

addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(function (cache) {
            return cache.addAll(CACHE_ITEMS);
        })
    );
});

// Now to retrieve the cached pages, we will use the fetch event.
addEventListener('fetch', event => {
    if (event.request.mode === 'navigate' ||
        (event.request.method === 'GET' &&
            event.request.headers.get('accept').includes('text/html'))) {
        event.respondWith(
            fetch(event.request.url).catch(error => {
                // Return the offline page
                return caches.match(OFFLINE_PAGE);
            })
        );
    } else {
        event.respondWith(
            caches.match(event.request).then(function (response) {
                //console.log('else part = ', event.request);
                return response || fetch(event.request);
            })
        );
    }
});