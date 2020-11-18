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
    endpoint: "https://fcm.googleapis.com/fcm/send/fDFtfbzTI60:APA91bEFARLgqzSe-nXdCyy-bbdmliuy5sJz7NIEk-lRIVSejhSTld1jzTbR6-lNRFKgBsANdk0OUUZ0tyS_3CDwIXJIs0ZEktQkKAQ_ySkCU5p1-YovzZBGXRB7NwhA5oWErX9ndFu3",
    keys: {
        p256dh: "BGorXtsJkrdmLs+bYcNLnlXu7jGEg/zU4N988LqbhOY034HYSO9WqlriznttW2HL6UDyxTdYWA9W+Us9PWWrA9Q=",
        auth: "RPNPjqPn0SiXFQo1AibO1g==",
    },
};
var payload = "Selamat! Aplikasi Anda sudah dapat menerima push notifikasi!";

var options = {
    gcmAPIKey: "130065327643",
    TTL: 60,
};
webPush.sendNotification(pushSubscription, payload, options);
