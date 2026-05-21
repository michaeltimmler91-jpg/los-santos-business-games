document.addEventListener("DOMContentLoaded", () => {
    initTeamAdmin();
});

function initTeamAdmin(){
    initTeamsIfNeeded();

    const player = loadData("player");

    if(!player){
        window.location.href = "../index.html";
        return;
    }

    const team = getPlayerTeam(player);

    if(!team){
        showTeamAdminMessage("Team wurde nicht gefunden.");
        return;
    }

    if(team.leader !== player.name){
        document.querySelector("main").innerHTML = `
            <section class="panel">
                <h2>Kein Zugriff</h2>
                <p class="info-text">
                    Nur der Teamleiter von ${team.name} darf diesen Bereich verwalten.
                </p>
            </section>
        `;

        document.getElementById("teamAdminInfo").innerText =
            "Keine Berechtigung";

        return;
    }

    document.getElementById("teamAdminInfo").innerText =
        "Verwaltung für " + team.name;

    renderMemberList();

    document
    .getElementById("addMemberBtn")
    .addEventListener("click", addMemberFromInput);
}

function getPlayerTeam(player){
    const teams = getTeams();

    return teams.find(team => {
        return team.id === player.team;
    });
}

function addMemberFromInput(){
    const player = loadData("player");
    const team = getPlayerTeam(player);

    const input = document.getElementById("newMemberName");
    const newMemberName = input.value.trim();

    if(!newMemberName){
        showTeamAdminMessage("Bitte Spielernamen eingeben.");
        return;
    }

    addPlayerToTeam(team.id, newMemberName);

    input.value = "";

    renderMemberList();

    showTeamAdminMessage(
        newMemberName + " wurde dem Team hinzugefügt."
    );
}

function removeMemberFromTeam(memberName){
    const player = loadData("player");
    const teams = getTeams();
    const team = teams.find(t => t.id === player.team);

    if(!team){
        return;
    }

    if(team.leader === memberName){
        showTeamAdminMessage("Der Teamleiter kann nicht entfernt werden.");
        return;
    }

    team.members = team.members.filter(member => {
        return member !== memberName;
    });

    saveTeams(teams);

    renderMemberList();

    showTeamAdminMessage(
        memberName + " wurde aus dem Team entfernt."
    );
}

function renderMemberList(){
    const player = loadData("player");
    const team = getPlayerTeam(player);
    const memberList = document.getElementById("memberList");

    memberList.innerHTML = "";

    if(!team.members || team.members.length === 0){
        memberList.innerHTML =
            "<p class='info-text'>Noch keine Mitglieder vorhanden.</p>";
        return;
    }

    team.members.forEach(member => {
        const row = document.createElement("div");

        row.className = "member-row";

        const leaderBadge =
            team.leader === member
                ? "<span class='badge'>Teamleiter</span>"
                : "";

        row.innerHTML = `
            <span>${member} ${leaderBadge}</span>
            <button class="small-danger-btn">
                Entfernen
            </button>
        `;

        row
        .querySelector("button")
        .addEventListener("click", () => {
            removeMemberFromTeam(member);
        });

        memberList.appendChild(row);
    });
}

function showTeamAdminMessage(text){
    const message = document.getElementById("teamAdminMessage");

    if(message){
        message.innerText = text;
    }
}
