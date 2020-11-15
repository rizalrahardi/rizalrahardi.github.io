if ("serviceWorker" in navigator) {
    registerServiceWorker();
    requestPermission();
} else {
    console.log("ServiceWorker belum didukung browser ini.");
}

// Register service worker
function registerServiceWorker() {
    window.addEventListener("load", () => {
        navigator.serviceWorker
            .register("/service-worker.js")
            .then(() => {
                console.log("Pendaftaran ServiceWorker berhasil");
            })
            .catch(() => {
                console.log("Pendaftaran ServiceWorker gagal");
            });
    });
}

function requestPermission() {
    if ('Notification' in window) {
        Notification.requestPermission().then((result) => {
            if (result === "denied") {
                console.log("Fitur notifikasi tidak diijinkan.");
                return;
            } else if (result === "default") {
                console.error("Pengguna menutup kotak dialog permintaan ijin.");
                return;
            }

            /* kita tambahkan kode untuk berlangganan pesan push melalui objek PushManager */

            if (('PushManager' in window)) {
                navigator.serviceWorker.getRegistration().then((registration) => {
                    registration.pushManager.subscribe({
                        userVisibleOnly: true,
                        applicationServerKey: urlBase64ToUint8Array(
                            "BCIEEJZrCNNS_M74MwKwCRRa8knEGPTLLSFLxysczFE2ktvs5pTDQ5XpIsfuko9bnm42XA1c1rzcDtys-MsVvrU")
                    }).then((subscribe) => {
                        console.log('Berhasil melakukan subscribe dengan endpoint: ',
                            subscribe.endpoint);
                        console.log('Berhasil melakukan subscribe dengan p256dh key: ',
                            btoa(String.fromCharCode.apply(null, new Uint8Array(
                                subscribe.getKey('p256dh')))));
                        console.log('Berhasil melakukan subscribe dengan auth key: ',
                            btoa(String.fromCharCode.apply(
                                null, new Uint8Array(subscribe.getKey('auth')))));
                    }).catch((e) => {
                        console.error('Tidak dapat melakukan subscribe ', e.message);
                    });
                });
            }

        });
    }
}

/* tuliskan fungsi berikut di dalam tag <script> index.html untuk mengubah string menjadi Uint8Array */
const urlBase64ToUint8Array = (base64String) => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

document.addEventListener("DOMContentLoaded", () => {
    let urlParams = new URLSearchParams(window.location.search);
    let isFromSaved = urlParams.get("saved");
    let id = Number(urlParams.get("id"));
    let btnSave = document.getElementById("save");
    let btnRemove = document.getElementById("delete");
    let item = getTeamById();

    checkFavorite(id);

    if (isFromSaved) {
        btnSave.style.display = 'none';
        // ambil artikel lalu tampilkan
        getSavedTeamById();
    } else {
        btnRemove.style.display = 'none';
    }

    checkFavorite(id).then(() => {
        btnSave.style.display = "none";
        btnRemove.style.display = "block";
    }).catch(() => {
        btnSave.style.display = "block";
        btnRemove.style.display = "none";
    });

    //jika tombol save diklik
    btnSave.onclick = () => {
        console.log("Tombol Create diklik.");
        item.then((team) => {
            saveForLater(team);
        });
    };

    //jika tombol remove diklik
    btnRemove.onclick = () => {
        console.log("Tombol Remove diklik.");
        item.then((id) => {
            removeTeam(id);
        });
    };
});