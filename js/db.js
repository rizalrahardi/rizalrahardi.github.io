const dbPromised = idb.open("infootball", 1, (upgradeDb) => {
    let teamsObjectStore = upgradeDb.createObjectStore("teams", {
        keyPath: "id",
    });
    teamsObjectStore.createIndex("name", "name", {
        unique: false,
    });
});

//save team
const saveForLater = (team) => {
    dbPromised
        .then((db) => {
            let tx = db.transaction("teams", "readwrite");
            let store = tx.objectStore("teams");
            console.log(team);
            store.put(team);
            return tx.complete;
        })
        .then(() => {
            console.log("Team Berhasil disimpan!");
            const title = "Team Berhasil disimpan!";
            const options = {
                body: `Team ${team.name} sudah tersimpan`,
                badge: "/img/icon/72x72.png",
                icon: "/img/icon/72x72.png",
            };
            if (Notification.permission === "granted") {
                navigator.serviceWorker.ready.then(function (registration) {
                    registration.showNotification(title, options);
                });
                M.toast({html:`Team ${team.name} berhasil ditambahkan ke favorite`});
            } else {
                console.error("fitur notifikasi tidak diijinkan.");
            }
            location.reload();
        })
};

//getAll teams
const getAll = () => {
    return new Promise((resolve, reject) => {
        dbPromised
            .then((db) => {
                let tx = db.transaction("teams", "readonly");
                let store = tx.objectStore("teams");
                return store.getAll();
            })
            .then((teams) => {
                resolve(teams);
            });
    });
};

const getById = (id) => {
    return new Promise((resolve, reject) => {
        dbPromised
            .then((db) => {
                let tx = db.transaction("teams", "readonly");
                let store = tx.objectStore("teams");
                return store.get(id);
            })
            .then((team) => {
                resolve(team);
            });
    });
};

//cek team indexed db
const checkFavorite = (id) => {
    return new Promise((resolve, reject) => {
        dbPromised
            .then((db) => {
                let tx = db.transaction("teams", "readonly");
                let store = tx.objectStore("teams");
                return store.get(id);
            })
            .then((favorite) => {
                if (favorite !== undefined) {
                    resolve(true);
                }
            });
    });
};

//remove team
const removeTeam = (id) => {
    dbPromised
        .then((db) => {
            let tx = db.transaction("teams", "readwrite");
            let store = tx.objectStore("teams");
            console.log(id);
            store.delete(id.id);
            return tx.complete;
        })
        .then(() => {
            console.log("Team berhasil dihapus");
            const title = "Team Berhasil dihapus!";
            const options = {
                body: `Team telah dihapus dari My Favorite.`,
                badge: "/img/icon/72x72.png",
                icon: "/img/icon/72x72.png",
            };
            if (Notification.permission === "granted") {
                navigator.serviceWorker.ready.then(registration => {
                    registration.showNotification(title, options);
                });
                M.toast({html:"Team berhasil dihapus"})
            }else{
                console.error("fitur notifikasi tidak diijinkan.");
            }
            location.reload();
        })
};
