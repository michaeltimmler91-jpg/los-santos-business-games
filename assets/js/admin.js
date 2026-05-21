document.addEventListener("DOMContentLoaded", () => {
    initAdmin();
});

function initAdmin(){
    initTeamsIfNeeded();
    renderAdminTeams();

    document
    .getElementById("createTeamBtn")
    .addEventListener("click", createTeamFromAdmin);
}

function createTeamFromAdmin(){
    const nameInput = document.getElementById("teamNameInput");
    const colorInput = document.getElementById("teamColorInput");

    const teamName = nameInput.value.trim();
    const teamColor = colorInput.value;

    if(!teamName){
        showAdminMessage("Bitte Teamnamen eingeben.");
        return;
    }

    const teams = getTeams();

    const newTeam = {
        id:createTeamId(teamName),
        name:teamName,
        color:teamColor,
        points:0,
        leader:null,
        members:[]
    };

    teams.push(newTeam);
    saveTeams(teams);

    nameInput.value = "";

    renderAdminTeams();
    showAdminMessage("Team wurde erstellt.");
}

function createTeamId(name){
    return name
        .toLowerCase()
        .replaceAll("ä","ae")
        .replaceAll("ö","oe")
        .replaceAll("ü","ue")
        .replaceAll("ß","ss")
        .replace(/[^a-z0-9]+/g,"-")
        .replace(/^-+|-+$/g,"")
        + "-" + Date.now();
}

function renderAdminTeams(){
    const wrapper = document.getElementById("adminTeamList");
    const teams = getTeams();

    wrapper.innerHTML = "";

    teams.forEach(team => {
        const card = document.createElement("div");

        card.className = "admin-team-card";

        const membersOptions = team.members.map(member => {
            const selected = team.leader === member ? "selected" : "";

            return `
                <option value="${member}" ${selected}>
                    ${member}
                </option>
            `;
        }).join("");

        card.innerHTML = `
            <div class="admin-team-head">
                <span class="team-dot large" style="background:${team.color}"></span>
                <div>
                    <h3>${team.name}</h3>
                    <p>${team.points} Punkte | ${team.members.length} Mitglieder</p>
                </div>
            </div>

            <label>Teamleiter</label>

            <select class="leader-select">
                <option value="">Kein Teamleiter</option>
                ${membersOptions}
            </select>

            <button class="small-danger-btn delete-team-btn">
                Team löschen
            </button>
        `;

        card
        .querySelector(".leader-select")
        .addEventListener("change", event => {
            setTeamLeader(team.id, event.target.value);
        });

        card
        .querySelector(".delete-team-btn")
        .addEventListener("click", () => {
            deleteTeam(team.id);
        });

        wrapper.appendChild(card);
    });
}

function setTeamLeader(teamId, leaderName){
    const teams = getTeams();
    const team = teams.find(t => t.id === teamId);

    if(!team){
        return;
    }

    team.leader = leaderName || null;

    saveTeams(teams);
    renderAdminTeams();

    showAdminMessage("Teamleiter wurde gespeichert.");
}

function deleteTeam(teamId){
    const confirmed = confirm(
        "Dieses Team wirklich löschen? Punkte und Mitglieder gehen verloren."
    );

    if(!confirmed){
        return;
    }

    let teams = getTeams();

    teams = teams.filter(team => {
        return team.id !== teamId;
    });

    saveTeams(teams);
    renderAdminTeams();

    showAdminMessage("Team wurde gelöscht.");
}

function showAdminMessage(text){
    document.getElementById("adminMessage").innerText = text;
}
