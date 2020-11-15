document.addEventListener("DOMContentLoaded", function() {
    // Activate sidebar nav
    const elems = document.querySelectorAll(".sidenav");
    M.Sidenav.init(elems);
    loadNav();

    function loadNav() {
        const xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState === 4) {
                if (this.status !== 200) return;

                // Muat daftar tautan menu
                document.querySelectorAll(".topnav, .sidenav").forEach(function(elm) {
                    elm.innerHTML = xhttp.responseText;
                });
                const elems = document.querySelectorAll('.dropdown-button');
                M.Dropdown.init(elems);


                // Daftarkan event listener untuk setiap tautan menu
                document.querySelectorAll(".sidenav a, .topnav a").forEach(function(elm) {
                    elm.addEventListener("click", event => {
                        // Tutup sidenav
                        const sidenav = document.querySelector(".sidenav");
                        M.Sidenav.getInstance(sidenav).close();

                        // Muat konten halaman yang dipanggil
                        page = event.target.getAttribute("href").substr(1);
                        loadPage(page);
                    });
                });
            }
        };
        xhttp.open("GET", "nav.html", true);
        xhttp.send();
    }

    // Load pages content
    let page = window.location.hash.substr(1);
    if (page === "") page = "teams";
    loadPage(page);

    function loadPage(page) {
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState === 4) {
                let content = document.querySelector("#body-content");

                switch (page) {
                    case 'standing':
                        getAllStandings();
                        break;
                    case 'teams':
                        getAllTeam();
                        break;
                    case 'saved':
                        getSavedTeams();
                        break;
                    default:
                        getAllStandings();
                }

                if (this.status === 200) {
                    content.innerHTML = xhttp.responseText;
                    if (page === "standing") {
                        // slider
                        const slider = document.querySelectorAll(".slider");
                        M.Slider.init(slider, {
                            indicators: false,
                            transition: 600,
                            interval: 3000,
                            height: 500
                        });
                    }
                    if (page === "teams") {

                        const slider = document.querySelectorAll(".slider");
                        M.Slider.init(slider, {
                            indicators: false,
                            transition: 600,
                            interval: 3000,
                            height: 500
                        });
                    }
                    if (page === "saved") {

                        const slider = document.querySelectorAll(".slider");
                        M.Slider.init(slider, {
                            indicators: false,
                            transition: 600,
                            interval: 3000,
                            height: 500
                        });
                    }
                    
                } else if (this.status === 404) {
                    content.innerHTML = "<p>Halaman tidak ditemukan.</p>";
                } else {
                    content.innerHTML = "<p>Ups.. halaman tidak dapat diakses.</p>";
                }
            }
        };
        xhttp.open("GET", "pages/" + page + ".html", true);
        xhttp.send();
    }
});