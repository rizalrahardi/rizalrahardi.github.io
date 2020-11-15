const base_url = "https://api.football-data.org/v2/";
const api_key = "bd7a726d5d1f4badb0f98a68e1ba21fd";

const league_spanish = 2014;

const standing = `${base_url}competitions/${league_spanish}/standings`;
const team = `${base_url}competitions/${league_spanish}/teams`;
const team_by_id = `${base_url}teams/`;

const fetchAPI = (url) => {
    return fetch(url, {
        headers: {
            "X-Auth-Token": api_key,
        },
    })
        .then((res) => {
            if (res.status !== 200) {
                console.log("Error: " + res.status);
                return Promise.reject(new Error(res.statusText));
            } else {
                return Promise.resolve(res);
            }
        })
        .then((res) => res.json())
        .catch((err) => {
            console.log(err);
        });
};

const getAllStandings = () => {
    if ("caches" in window) {
        caches.match(standing).then((response) => {
            if (response) {
                response.json().then((data) => {
                    console.log("Competition Data: " + data);
                    showStanding(data);
                });
            }
        });
    }

    fetchAPI(standing)
        .then((data) => {
            showStanding(data);
        })
        .catch((error) => {
            console.log(error);
        });
};

const getAllTeam = () => {
    if ("caches" in window) {
        caches.match(team).then((response) => {
            if (response) {
                response.json().then((data) => {
                    console.log("Team Data: " + data);
                    showAllTeam(data);
                });
            }
        });
    }

    fetchAPI(team)
        .then((data) => {
            showAllTeam(data);
        })
        .catch((error) => {
            console.log(error);
        });
};

const getTeamById = () => {
    return new Promise((resolve, reject) => {
        // Ambil nilai query parameter (?id=)
        let urlParams = new URLSearchParams(window.location.search);
        let idParam = urlParams.get("id");
        if ("caches" in window) {
            caches.match(team_by_id + idParam).then((response) => {
                if (response) {
                    response.json().then((data) => {
                        console.log("Team Data: " + data);
                        showTeamById(data);
                        // Kirim objek data hasil parsing json agar bisa disimpan ke indexed db
                        resolve(data);
                    });
                }
            });
        }

        fetchAPI(team_by_id + idParam)
            .then((data) => {
                showTeamById(data);
                resolve(data);
            })
            .catch((error) => {
                console.log(error);
            });
    });
};

const showStanding = (data) => {
    let standings = "";
    let standingElement = document.getElementById("standings");

    data.standings[0].table.forEach((standing) => {
        standings += `
                <tr>
                    <td>
                        <img src="${standing.team.crestUrl.replace(/^http:\/\//i,"https://")}" width="30px" alt="badge"/>
                    </td>
                    <td>${standing.team.name}</td>
                    <td>${standing.won}</td>
                    <td>${standing.draw}</td>
                    <td>${standing.lost}</td>
                    <td>${standing.points}</td>
                    <td>${standing.goalsFor}</td>
                    <td>${standing.goalsAgainst}</td>
                    <td>${standing.goalDifference}</td>
                </tr>

        `;
    });

    standingElement.innerHTML = `
                <div class="card" style="padding-left: 24px; padding-right: 24px; margin-top: 30px;">
                <table class="striped responsive-table centered">
                    <thead>
                        <tr>
                            <th></th>
                            <th>Team Name</th>
                            <th>Won</th>
                            <th>Draw</th>
                            <th>Lost</th>
                            <th>Point</th>
                            <th>Goals For</th>
                            <th>Goals Against</th>
                            <th>Goal Difference</th>
                        </tr>
                    </thead>
                    <tbody id="standings">
                        ${standings}
                    </tbody>
                </table>
                
                </div>
    `;
};

const showAllTeam = (data) => {
    let squads = "";
    data.teams.forEach((team) => {
        squads += `
                <a href="./detail.html?id=${team.id}" style="color:black;">
                    <div class="col s12 m3 " style="float: center; height: 25rem; margin: 0; padding: 5px; ">
                        <div class="card">
                            <div class="card-image" style="height : 13rem;">
                            <img src="${team.crestUrl}" alt="Team Banner" style="margin: auto; padding: 1rem 1rem 0 1rem; height: 100%; width:auto; max-width: 100%; ">
                            </div>
                            <div class="card-content" style="text-align: center; padding-top: 0.5rem; height : 6rem;">
                            <h5><strong>${team.name}</strong></h5>
                            </div>
                            <div class="card-action">
                            <span>
                            <a href="./detail.html?id=${team.id}">Read More..<i class="material-icons right">info_outline</i></a>
                            </span>
                            </div>
                        </div>
                    </div>
                </a>
                `;
    });

    let teamElement = document.getElementById("teams");
    teamElement.innerHTML = ` 
        <div class="row">    
        ${squads}
        </div>
    `;
};

const showTeamById = (data) => {
    let logo = "";
    logo += `
                <div class="row" style="text-align:center; margin-top: 2rem;">
                    <div class="col s8 m2 offset-m5 offset-s2" style="margin-bottom: 0; padding:0; ">
                        <img class ="resonsive-img" src="${data.crestUrl.replace(/^http:\/\//i,"https://")}" alt="Team Banner" style="padding-top: 2rem; width:100%; height: auto;" align:"middle;">
                    </div>
                </div>
                <h4 style="text-align:center;">${data.name}</h4>
                <hr style="border: solid green; width:70%; align: center;">
                <div class="row">
                    <div class="col s12 l8 offset-l2">
                        <ul class="collection center">
                            <li class="collection-item">address : ${data.address}</li>
                            <li class="collection-item">phone : ${data.phone}</li>
                            <li class="collection-item">website : <a href="${data.website}" target="blank">${data.website}</a></li>
                            <li class="collection-item">email : ${data.email}</li>
                            <li class="collection-item">founded : ${data.founded}</li>
                            <li class="collection-item">club colors : ${data.clubColors}</li>
                            <li class="collection-item">venue : ${data.vanue}</li>
                        </ul>
                    </div>
                </div>
        `;

    let squads = "";
    data.squad.forEach((member) => {
        squads += `
            <tr style="text-align: center;">
                <td>${member.name}</td>
                <td>${member.role}</td>
                <td>${member.nationality}</td>
                <td>${member.position}</td>
            </tr>
    `;
    });

    let teamElement = document.getElementById("body-content");
    teamElement.innerHTML = `
            ${logo}
            <div class="card" style="padding-left: 24px; padding-right: 24px; margin-top: 30px;">
                    <table class="striped responsive-table">
                        <thead>
                        <tr><h5 style="text-align: center; padding-top: 25px;"><strong>Team Players</strong><h5></tr>
                            <tr>
                                <th>Name</th>
                                <th>Role</th>
                                <th>Nationality</th>
                                <th>Position</th>
                            </tr>
                        </thead>
                        <tbody id="standings" >
                            ${squads}
                        </tbody>
                    </table>
                    
            </div>
        `;
};

const getSavedTeams = () => {
    getAll().then((teams) => {
        console.log(teams);
        let squads = "";
        teams.forEach((team) => {
            squads += `
                    <a href="./detail.html?id=${
                        team.id
                    }&saved=true" style="color:black;">
                        <div class="col s12 m3 " style="float: center; height: 25rem; margin: 0; padding: 5px; ">
                            <div class="card">
                                <div class="card-image" style="height: 13rem;">
                                <img src="${team.crestUrl.replace(
                                    /^http:\/\//i,
                                    "https://"
                                )}" style="margin: auto; padding: 1rem 1rem 0 1rem; height: 100%; width:auto; max-width: 100%; ">
                                </div>
                                <div class="card-content" style="text-align: center; padding-top: 0.5rem; height : 6rem;">
                                <h5><strong>${team.name}</strong></h5>
                                </div>
                                <div class="card-action">
                                <span><a href="/detail.html?id=${
                                    team.id
                                }&saved=true" style="float: center; ">Read More...<i class="material-icons right">info_outline</i></span>
                                </div>
                            </div>
                        </div>
                    </a>
                    `;
        });

        document.getElementById("saved").innerHTML = ` 
                    <div class="row">    
                    ${squads}
                    </div>
                `;
    });
};

const getSavedTeamById = () => {
    let urlParams = new URLSearchParams(window.location.search);
    let idParam = parseInt(urlParams.get("id"));

    getById(idParam).then((team) => {
        console.log(team);
        showTeamById(team);
    });
};
