document.addEventListener("DOMContentLoaded", () => {
    initTeamAdmin();
});

let currentProfile = null;
let currentMembership = null;
let currentCompany = null;

async function initTeamAdmin(){

    currentProfile =
    await getCurrentProfile();

    if(!currentProfile){
        window.location.href = "../index.html";
        return;
    }

    currentMembership =
    await getMyMembership();

    if(!currentMembership){
        showNoAccess("Du bist aktuell in keiner Firma.");
        return;
    }

    currentCompany =
    await getCompanyById(currentMembership.team_id);

    if(!currentCompany){
        showNoAccess("Firma wurde nicht gefunden.");
        return;
    }

    const isLeader =
    currentCompany.leader_id === currentProfile.id;

    const isAdmin =
    currentProfile.role === "admin" ||
    currentProfile.role === "owner";

    if(!isLeader && !isAdmin){
        showNoAccess("Nur die Firmenleitung oder ein Admin darf diesen Bereich verwalten.");
        return;
    }

    document.getElementById("teamAdminInfo").innerText =
        "Verwaltung für " + currentCompany.name;

    document.getElementById("companyInfoText").innerText =
        (currentCompany.description || "Keine Beschreibung") +
        " | Punkte: " +
        currentCompany.points;

    renderMemberList();
    renderCompanyLogs();
}

async function renderMemberList(){

    const memberList =
    document.getElementById("memberList");

    const members =
    await loadCompanyMembers(currentCompany.id);

    memberList.innerHTML = "";

    if(members.length === 0){
        memberList.innerHTML =
            "<p class='info-text'>Keine Mitarbeiter vorhanden.</p>";
        return;
    }

    members.forEach(member => {

        const row =
        document.createElement("div");

        row.className =
        "member-row";

        const username =
        member.profile
        ? member.profile.username
        : "Unbekannt";

        const isLeader =
        currentCompany.leader_id === member.user_id;

        const leaderBadge =
        isLeader
        ? "<span class='badge'>Leitung</span>"
        : "";

        row.innerHTML = `
            <span>${username} ${leaderBadge}</span>

            <div class="member-actions">
                <button class="set-leader-btn">
                    Zur Leitung machen
                </button>

                <button class="small-danger-btn">
                    Entfernen
                </button>
            </div>
        `;

        row
        .querySelector(".set-leader-btn")
        .addEventListener("click", async () => {
            await setMemberAsLeader(member.user_id);
        });

        row
        .querySelector(".small-danger-btn")
        .addEventListener("click", async () => {
            await kickMember(member.user_id, username);
        });

        memberList.appendChild(row);
    });
}

async function setMemberAsLeader(userId){

    const result =
    await updateGameTeamLeader(
        currentCompany.id,
        userId
    );

    showTeamAdminMessage(result.message);

    currentCompany =
    await getCompanyById(currentCompany.id);

    renderMemberList();
}

async function kickMember(userId, username){

    if(currentCompany.leader_id === userId){
        showTeamAdminMessage("Die aktuelle Leitung kann nicht entfernt werden.");
        return;
    }

    const confirmed =
    confirm(username + " wirklich aus der Firma entfernen?");

    if(!confirmed){
        return;
    }

    const result =
    await removeCompanyMember(userId);

    showTeamAdminMessage(result.message);

    renderMemberList();
}

function showNoAccess(text){

    document.querySelector("main").innerHTML = `
        <section class="panel">
            <h2>Kein Zugriff</h2>
            <p class="info-text">${text}</p>
        </section>
    `;

    document.getElementById("teamAdminInfo").innerText =
        "Keine Berechtigung";
}

function showTeamAdminMessage(text){

    const message =
    document.getElementById("teamAdminMessage");

    if(message){
        message.innerText = text;
    }
}
async function renderCompanyLogs(){

    const wrapper =
    document.getElementById("companyLogsList");

    if(!wrapper){
        return;
    }

    const logs =
    await loadCompanyLogs(currentCompany.id);

    wrapper.innerHTML = "";

    if(logs.length === 0){
        wrapper.innerHTML =
            "<p class='info-text'>Noch keine Aktionen vorhanden.</p>";
        return;
    }

    logs.forEach(log => {

        const div =
        document.createElement("div");

        div.className =
        "log-card";

        const username =
            log.profile && log.profile.username
            ? log.profile.username
            : "Unbekannt";

        const date =
        new Date(log.created_at).toLocaleString("de-DE");

        div.innerHTML = `
            <strong>${username}</strong>
            <p>${log.action_title}</p>
            <p>+${log.points} Punkte</p>
            <small>${date}</small>
        `;

        wrapper.appendChild(div);
    });
}