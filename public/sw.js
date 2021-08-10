self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open('sw-cache').then(function(cache) {
            cache.add('/');
            cache.add('/example1/remoteEntry.js');
            cache.add('/example1/597.js');
            cache.add('/example1/63.js');
            cache.add('/example2/remoteEntry.js');
            cache.add('/example2/597.js');
            cache.add('/example2/935.js');
            cache.add('/favicon.ico');
            cache.add('/manifest.json');
            cache.add('/favicon.ico');
            cache.add('/icon-192.jpg');
            cache.add('/icon-512.jpg');
        })
    );
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request).then(function(response){
            return response || fetch(event.request);
        })
    );
});
