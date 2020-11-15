var webPush = require("web-push");

const vapidKeys = {
    publicKey: "BCIEEJZrCNNS_M74MwKwCRRa8knEGPTLLSFLxysczFE2ktvs5pTDQ5XpIsfuko9bnm42XA1c1rzcDtys-MsVvrU",
    privateKey: "LgXuA2GVvwx1KWzfbvs8_TQMXDAG4qD-U9E9rQX1QYc",
};

webPush.setVapidDetails(
    "mailto:rizalrahardi@gmail.com",
    vapidKeys.publicKey,
    vapidKeys.privateKey
);
var pushSubscription = {
    endpoint: "https://fcm.googleapis.com/fcm/send/d3dv5g01NtU:APA91bEaJRhKZR5XU1FBu_8Ap_GJ9K-REqWCHGfG8oJvX1qtJvBOo9TDYLtvWwPo_sqRUh0U2eLS3TtuLiDPcpKRoG6X83aG4rIVqVPVAqa-Rco1zHOZ74p_7Wg_mb_cwQP2SYw5zLy0",
    keys: {
        p256dh: "BGA86u6Vu5YMh8cURa9aX3Y9P8GwTC//y0/PqvuQLfw7hYey7xFjdNCKmHeGj+pYplt4TMAGNvO9r1o+LdZj6fw=",
        auth: "UjzqJsZZbf9UIfsWd3k2YQ==",
    },
};
var payload = "Selamat! Aplikasi Anda sudah dapat menerima push notifikasi!";

var options = {
    gcmAPIKey: "130065327643",
    TTL: 60,
};
webPush.sendNotification(pushSubscription, payload, options);
