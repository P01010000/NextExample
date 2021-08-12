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

self.addEventListener('message', async (ev) => {
    const client = ev.source;
    client.postMessage(`pong: ${ev.data}`);
    const clients = await self.clients.matchAll();
    clients.forEach(c => {
        if (c.id === client.id) return;
        c.postMessage(`received message: ${ev.data}`);
    });
});

const urlB64ToUint8Array = base64String => {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
    const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/')
    const rawData = atob(base64)
    const outputArray = new Uint8Array(rawData.length)
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
}

self.addEventListener('activate', async function(event) {
    console.log('activate');
    try {
        const applicationServerKey = urlB64ToUint8Array('BGHVWiOGawLqrf8O9EvI5t9RhcAJ-G74gp1GtbAMfh4OSIlFdF2rBdK9Bf8QpCIJ4Et9jmolGnfwf9y04XZueyY');
        const options = { applicationServerKey, userVisibleOnly: true };
        const subscription = await self.registration.pushManager.subscribe(options);
        await fetch(`${self.registration.scope}api/push/subscribe`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(subscription),
        });
    } catch (ex) {
        console.error('Error', ex);
    }
});

self.addEventListener('push', async function(event) {
    console.log('push', event);
    if (Notification.permission === 'granted') {
        self.registration.showNotification('Next Example App', {
            body: await event.data.text(),
        });
    }
});

self.addEventListener('sync', async function(event) {
    if (event.tag === 'myFirstSync') {
        event.waitUntil(
            fetch(`${self.registration.scope}api/push/broadcast`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify('Hello Me'),
            })
        );
    }
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request).then(function(response){
            return response || fetch(event.request);
        })
    );
});
