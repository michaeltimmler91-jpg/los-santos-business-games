document.addEventListener("DOMContentLoaded", () => {
    initDashboard();
});

function initDashboard(){

    initTeamsIfNeeded();

    let user = getCurrentUser();

    if(!user){
        window.location.href = "../index.html";
        return;
    }

    user = regenerateEnergy(user);
    updateCurrentUser(user);

    updatePlayerInfo();
    updateEnergyDisplay();
    renderRanking();
    renderTeamSelection();
    startEnergyTimer();

    document
    .getElementById("actionBtn")
    .addEventListener("click", performPlayerAction);

    const logoutBtn =
    document.getElementById("logoutBtn");

    if(logoutBtn){

        logoutBtn.addEventListener("click", (event) => {

            event.preventDefault();

            logoutUser();
        });
    }
}

function updatePlayerInfo(){

    const user = getCurrentUser();

    let teamText = "Kein Team";

    if(user.teamId){

        const teams = getTeams();

        const team = teams.find(t => {
            return t.id === user.teamId;
        });

        if(team){
            teamText = team.name;
        }
    }

    document.getElementById("playerInfo").innerText =
        user.username + " | Team: " + teamText;
}

function updateEnergyDisplay(){

    let user = getCurrentUser();

    user = regenerateEnergy(user);
    updateCurrentUser(user);

    document.getElementById("energyText").innerText =
        user.energy + " / " + GAME_CONFIG.maxEnergy;

    document.getElementById("energyFill").style.width =
        user.energy + "%";
}

function startEnergyTimer(){
    setInterval(() => {
        updateEnergyDisplay();
    }, 1000);
}

function renderTeamSelection(){

    const user = getCurrentUser();

    if(user.teamId){
        return;
    }

    const teams = getTeams();

    const wrapper =
    document.createElement("section");

    wrapper.className = "panel";
    wrapper.id = "teamSelectionPanel";

    wrapper.innerHTML = `
        <h2>Team auswählen</h2>
        <div id="dashboardTeamList" class="team-list"></div>
    `;

    document
    .querySelector(".dashboard-grid")
    .prepend(wrapper);

    const teamList =
    document.getElementById("dashboardTeamList");

    teams.forEach(team => {

        const div =
        document.createElement("div");

        div.className = "team-card";

        div.style.background = team.color;

        div.innerHTML = `
            <h3>${team.name}</h3>
            <p>${team.points} Punkte</p>
        `;

        div.addEventListener("click", () => {
            joinTeam(team.id);
        });

        teamList.appendChild(div);
    });
}

function joinTeam(teamId){

    const user = getCurrentUser();

    if(user.teamId){
        return;
    }

    user.teamId = teamId;

    updateCurrentUser(user);

    addPlayerToTeam(
        teamId,
        user.username
    );

    location.reload();
}
