document.addEventListener("DOMContentLoaded", () => {
    initTeamAdmin();
});

function initTeamAdmin(){

    initTeamsIfNeeded();

    const user = getCurrentUser();

    if(!user){

        window.location.href =
        "../index.html";

        return;
    }

    if(!user.teamId){

        showNoAccess(
            "Du bist aktuell in keinem Team."
        );

        return;
    }

    const team = getTeamById(
        user.teamId
    );

    if(!team){

        showNoAccess(
            "Team wurde nicht gefunden."
        );

        return;
    }

    if(team.leader !== user.username){

        showNoAccess(
            "Nur der Teamleiter darf diesen Bereich verwalten."
        );

        return;
    }

    document.getElementById(
        "teamAdminInfo"
    ).innerText =
        "Verwaltung für " +
        team.name;

    renderMemberList();

    document
    .getElementById("addMemberBtn")
    .addEventListener(
        "click",
        addMemberFromInput
    );
}

function addMemberFromInput(){

    const user = getCurrentUser();

    const team =
    getTeamById(user.teamId);

    const input =
    document.getElementById(
        "newMemberName"
    );

    const username =
    input.value.trim();

    if(!username){

        showTeamAdminMessage(
            "Bitte Spielernamen eingeben."
        );

        return;
    }

    const users = getUsers();

    const targetUser =
    users.find(u => {
        return u.username === username;
    });

    if(!targetUser){

        showTeamAdminMessage(
            "Spieler existiert nicht."
        );

        return;
    }

    targetUser.teamId = team.id;

    const updatedUsers =
    users.map(u => {
        return u.id === targetUser.id
            ? targetUser
            : u;
    });

    saveUsers(updatedUsers);

    addPlayerToTeam(
        team.id,
        targetUser.username
    );

    input.value = "";

    renderMemberList();

    showTeamAdminMessage(
        username +
        " wurde hinzugefügt."
    );
}

function removeMemberFromTeam(memberName){

    const user =
    getCurrentUser();

    const team =
    getTeamById(user.teamId);

    if(team.leader === memberName){

        showTeamAdminMessage(
            "Teamleiter kann nicht entfernt werden."
        );

        return;
    }

    team.members =
    team.members.filter(member => {
        return member !== memberName;
    });

    const users = getUsers();

    const updatedUsers =
    users.map(u => {

        if(u.username === memberName){
            u.teamId = null;
        }

        return u;
    });

    saveUsers(updatedUsers);

    saveTeams(getTeams());

    renderMemberList();

    showTeamAdminMessage(
        memberName +
        " wurde entfernt."
    );
}

function renderMemberList(){

    const user =
    getCurrentUser();

    const team =
    getTeamById(user.teamId);

    const memberList =
    document.getElementById(
        "memberList"
    );

    memberList.innerHTML = "";

    if(team.members.length === 0){

        memberList.innerHTML =
            "<p class='info-text'>Keine Mitglieder vorhanden.</p>";

        return;
    }

    team.members.forEach(member => {

        const row =
        document.createElement("div");

        row.className =
        "member-row";

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
        .addEventListener(
            "click",
            () => {
                removeMemberFromTeam(member);
            }
        );

        memberList.appendChild(row);
    });
}

function showNoAccess(text){

    document.querySelector("main").innerHTML = `
        <section class="panel">
            <h2>Kein Zugriff</h2>
            <p class="info-text">
                ${text}
            </p>
        </section>
    `;
}

function showTeamAdminMessage(text){

    const msg =
    document.getElementById(
        "teamAdminMessage"
    );

    if(msg){
        msg.innerText = text;
    }
}
