document.addEventListener("DOMContentLoaded", () => {
    initTeamsPage();
});

async function initTeamsPage(){

    const profile =
    await getCurrentProfile();

    if(!profile){
        window.location.href = "../index.html";
        return;
    }

    renderTeamsOverview();
}

async function renderTeamsOverview(){

    const wrapper =
    document.getElementById("teamsOverview");

    const teams =
    await loadGameTeams();

    wrapper.innerHTML = "";

    if(teams.length === 0){
        wrapper.innerHTML =
            "<section class='panel'><p class='info-text'>Noch keine Firmen vorhanden.</p></section>";
        return;
    }

    teams.forEach(team => {

        const card =
        document.createElement("section");

        card.className =
        "team-overview-card";

        card.style.borderColor =
        team.color;

        const leaderName =
            team.leader && team.leader.username
            ? team.leader.username
            : "Keine Leitung";

        card.innerHTML = `
            <div class="team-overview-head">
                <span class="team-dot large" style="background:${team.color}"></span>

                <div>
                    <h2>${team.name}</h2>
                    <p>${team.short_name || "Kein Kürzel"} | ${team.type}</p>
                </div>
            </div>

            <div class="team-meta">
                <p><strong>Punkte:</strong> ${team.points}</p>
                <p><strong>Leitung:</strong> ${leaderName}</p>
                <p><strong>Beschreibung:</strong> ${team.description || "Keine Beschreibung"}</p>
            </div>
        `;

        wrapper.appendChild(card);
    });
}