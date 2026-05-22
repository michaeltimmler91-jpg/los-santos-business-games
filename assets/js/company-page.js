document.addEventListener("DOMContentLoaded", () => {
    initCompanyPage();
});

async function initCompanyPage(){

    const profile =
    await getCurrentProfile();

    if(!profile){
        window.location.href = "../index.html";
        return;
    }

    const params =
    new URLSearchParams(window.location.search);

    const companyId =
    params.get("id");

    if(!companyId){
        document.querySelector("main").innerHTML =
            "<section class='panel'><h2>Fehler</h2><p class='info-text'>Keine Firma ausgewählt.</p></section>";
        return;
    }

    const company =
    await getCompanyById(companyId);

    if(!company){
        document.querySelector("main").innerHTML =
            "<section class='panel'><h2>Fehler</h2><p class='info-text'>Firma wurde nicht gefunden.</p></section>";
        return;
    }

    renderCompanyInfo(company);
    renderCompanyMembers(company.id);
    renderCompanyLogs(company.id);
}

function renderCompanyInfo(company){

    document.getElementById("companyName").innerText =
        company.name;

    document.getElementById("companySubtitle").innerText =
        (company.short_name || "Kein Kürzel") + " | " + company.type;

    document.getElementById("companyDescription").innerText =
        company.description || "Keine Beschreibung vorhanden.";

    document.getElementById("companyPoints").innerText =
        "Punkte: " + company.points;

    const requiredXp =
    getRequiredXpForLevel(company.level);

const xpText =
    "Level: " +
    company.level +
    " | XP: " +
    company.xp +
    " / " +
    requiredXp;

const xpElement =
document.createElement("p");

xpElement.innerText =
    xpText;

document
.getElementById("companyPoints")
.after(xpElement);

    const leaderName =
        company.leader && company.leader.username
        ? company.leader.username
        : "Keine Leitung";

    document.getElementById("companyLeader").innerText =
        "Leitung: " + leaderName;
}

async function renderCompanyMembers(companyId){

    const wrapper =
    document.getElementById("companyMembersList");

    const members =
    await loadCompanyMembers(companyId);

    wrapper.innerHTML = "";

    if(members.length === 0){
        wrapper.innerHTML =
            "<p class='info-text'>Keine Mitarbeiter vorhanden.</p>";
        return;
    }

    members.forEach(member => {

        const div =
        document.createElement("div");

        div.className =
        "member-row";

        const username =
            member.profile && member.profile.username
            ? member.profile.username
            : "Unbekannt";

        div.innerHTML = `
            <span>${username}</span>
        `;

        wrapper.appendChild(div);
    });
}

async function renderCompanyLogs(companyId){

    const wrapper =
    document.getElementById("companyLogsList");

    const logs =
    await loadCompanyLogs(companyId);

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