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
