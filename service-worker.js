const APP_PREFIX = 'Portfolio';
const VERSION = '01';
const CACHE_NAME = APP_PREFIX + VERSION;
const FILES_TO_CACHE =['index.html','bcard.html']

const self=this
self.addEventListener('install', function (e) {
    e.waitUntil(
        caches.open(CACHE_NAME).then(function (cache) {
            console.log('installing cache : ' + CACHE_NAME)
            return cache.addAll(FILES_TO_CACHE);
        })
    );
});

self.addEventListener('activate', function (e) {
    e.waitUntil(
        caches.keys().then(function (keyList) {
            let cacheKeeplist = keyList.filter(function (key) {
                return key.indexOf(APP_PREFIX)
            })

            cacheKeeplist.push(CACHE_NAME);

            // eslint-disable-next-line array-callback-return
            return Promise.all(keyList.map(function (key, i) {
                if (cacheKeeplist.indexOf(key) === -1) {
                    console.log('deleting cache : ' + keyList[i]);
                    return caches.delete(keyList[i]);
                }
            }));
        })
    );
});

self.addEventListener('fetch', function (e) {
    console.log('fetch request : ' + e.request.url);
    e.respondWith(
        caches.match(e.request).then(function (request) {
            if (request) {
                console.log('responding with cache : ' + e.request.url)
                return request
            } else {
                console.log('file is not cached, fetching : ' + e.request.url)
                return fetch(e.request)
            }
        })
    )
});