document.addEventListener("DOMContentLoaded", () => {
    initDashboard();
});

function initDashboard(){
    const player = loadData("player");

    if(!player){
        window.location.href = "../index.html";
        return;
    }

    initTeamsIfNeeded();
    updatePlayerInfo();
    updateEnergyDisplay();
    renderRanking();

    document
    .getElementById("actionBtn")
    .addEventListener("click", performPlayerAction);

    const logoutBtn = document.getElementById("logoutBtn");

    if(logoutBtn){
        logoutBtn.addEventListener("click", (event) => {
            event.preventDefault();
            logoutPlayer();
        });
    }
}

function updatePlayerInfo(){
    const player = loadData("player");
    const teams = getTeams();
    const team = teams.find(t => t.id === player.team);

    document.getElementById("playerInfo").innerText =
        player.name + " | Team: " + team.name;
}

function updateEnergyDisplay(){
    const player = loadData("player");

    document.getElementById("energyText").innerText =
        player.energy + " / 100";

    document.getElementById("energyFill").style.width =
        player.energy + "%";
}
