let selectedTeam = null;

function initTeamsIfNeeded(){
    const existingTeams = loadData("teams");

    if(!existingTeams){
        saveData("teams", DEFAULT_TEAMS);
    }
}

function getTeams(){
    initTeamsIfNeeded();
    return loadData("teams");
}

function saveTeams(teams){
    saveData("teams", teams);
}

function renderTeams(){
    initTeamsIfNeeded();

    const teams = getTeams();
    const teamList = document.getElementById("teamList");

    if(!teamList){
        return;
    }

    teamList.innerHTML = "";

    teams.forEach(team => {
        const div = document.createElement("div");

        div.className = "team-card";
        div.style.background = team.color;

        div.innerHTML = `
            <h3>${team.name}</h3>
            <p>Punkte: ${team.points}</p>
        `;

        div.addEventListener("click", () => {
            document
            .querySelectorAll(".team-card")
            .forEach(card => {
                card.classList.remove("active");
            });

            div.classList.add("active");
            selectedTeam = team.id;
        });

        teamList.appendChild(div);
    });
}

function addPointsToTeam(teamId, points){
    const teams = getTeams();

    const team = teams.find(t => t.id === teamId);

    if(!team){
        return;
    }

    team.points += points;

    saveTeams(teams);
}

function renderRanking(){
    const rankingList = document.getElementById("rankingList");

    if(!rankingList){
        return;
    }

    const teams = getTeams();

    const sortedTeams = [...teams].sort((a, b) => {
        return b.points - a.points;
    });

    rankingList.innerHTML = "";

    sortedTeams.forEach((team, index) => {
        const div = document.createElement("div");

        div.className = "ranking-card";

        div.innerHTML = `
            <span class="rank">#${index + 1}</span>
            <span class="team-dot" style="background:${team.color}"></span>
            <strong>${team.name}</strong>
            <span>${team.points} Punkte</span>
        `;

        rankingList.appendChild(div);
    });
}
document.addEventListener("DOMContentLoaded", () => {
    initTeamsIfNeeded();
    renderTeamsOverview();
});

function renderTeamsOverview(){
    const wrapper = document.getElementById("teamsOverview");
    const teams = getTeams();

    wrapper.innerHTML = "";

    teams.forEach(team => {
        const card = document.createElement("section");

        card.className = "team-overview-card";
        card.style.borderColor = team.color;

        const leaderName = team.leader ? team.leader : "Kein Teamleiter";

        card.innerHTML = `
            <div class="team-overview-head">
                <span class="team-dot large" style="background:${team.color}"></span>
                <div>
                    <h2>${team.name}</h2>
                    <p>${team.points} Punkte</p>
                </div>
            </div>

            <div class="team-meta">
                <p><strong>Teamleiter:</strong> ${leaderName}</p>
                <p><strong>Mitglieder:</strong> ${team.members.length}</p>
            </div>
        `;

        wrapper.appendChild(card);
    });
}
function addPlayerToTeam(teamId, playerName){
    const teams = getTeams();
    const team = teams.find(t => t.id === teamId);

    if(!team){
        return;
    }

    const alreadyMember = team.members.includes(playerName);

    if(!alreadyMember){
        team.members.push(playerName);
    }

    saveTeams(teams);
}
function getTeamById(teamId){

    const teams = getTeams();

    return teams.find(team => {
        return team.id === teamId;
    });
}
