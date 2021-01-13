importScripts(
    "https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js"
);

if (workbox) console.log(`Workbox berhasil dimuat`);
else console.log(`Workbox gagal dimuat`);

workbox.precaching.precacheAndRoute(
    [
        { url: "/", revision: "1" },
        { url: "/index.html", revision: "1" },
        { url: "/nav.html", revision: "1" },
        { url: "/css/materialize.min.css", revision: "1" },
        { url: "/js/materialize.min.js", revision: "1" },
        { url: "/js/nav.js", revision: "1" },
        { url: "/manifest.json", revision: "1" },
        { url: "/push.js", revision: "1" },
        { url: "/detail.html", revision: "1" },
        { url: "/pages/teams.html", revision: "1" },
        { url: "/pages/standing.html", revision: "1" },
        { url: "/pages/saved.html", revision: "1" },
        { url: "/js/sw_index.js", revision: "1" },
        { url: "/js/sw_detail.js", revision: "1" },
        { url: "/js/idb.js", revision: "1" },
        { url: "/js/db.js", revision: "1" },
        { url: "/js/api.js", revision: "1" },
        { url: "/img/slider/1.webp", revision: "1" },
        { url: "/img/slider/2.webp", revision: "1" },
        { url: "/img/slider/3.webp", revision: "1" },
        { url: "/img/slider/4.webp", revision: "1" },
        { url: "/img/icon/72x72.png", revision: "1" },
        { url: "/img/icon/96x96.png", revision: "1" },
        { url: "/img/icon/192x192.png", revision: "1" },
        { url: "/img/icon/512x512.png", revision: "1" },
        { url: "/img/icon/favicon.ico", revision: "1" },
    ],
    { ignoreUrlParametersMatching: [/.*/] }
);

workbox.routing.registerRoute(
    new RegExp("/pages/"),
    workbox.strategies.staleWhileRevalidate({
        cacheName: "pages-cache",
    })
);

workbox.routing.registerRoute(
    new RegExp("/"),
    workbox.strategies.staleWhileRevalidate()
);

workbox.routing.registerRoute(
    new RegExp("https://api.football-data.org/v2/"),
    workbox.strategies.staleWhileRevalidate({
        cacheName: "fetch-api",
        plugins: [
            new workbox.cacheableResponse.Plugin({
                statuses: [0, 200],
            }),
            new workbox.expiration.Plugin({
                maxAgeSeconds: 60 * 60 * 24 * 365,
                maxEntries: 30,
            }),
        ],
    })
);

workbox.routing.registerRoute(
    /.*(?:png|gif|jpg|jpeg|svg)$/,
    workbox.strategies.cacheFirst({
        cacheName: "infootball-image-cache",
        plugins: [
            new workbox.cacheableResponse.Plugin({
                statuses: [0, 200],
            }),
            new workbox.expiration.Plugin({
                maxEntries: 100,
                maxAgeSeconds: 30 * 24 * 60 * 60,
            }),
        ],
    })
);

workbox.routing.registerRoute(
    /.*(?:googleapis|gstatic)\.com/,
    workbox.strategies.staleWhileRevalidate({
        cacheName: "material-icons",
    })
);

self.addEventListener("push", (event) => {
    let body;
    if (event.data) {
        body = event.data.text();
    } else {
        body = "Push message no payload";
    }
    let options = {
        body: body,
        icon: "/img/icon/72x72.png",
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1,
        },
    };
    event.waitUntil(
        self.registration.showNotification("Push Notification", options)
    );
});
