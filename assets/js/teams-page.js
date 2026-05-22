document.addEventListener("DOMContentLoaded", () => {
    initTeamsPage();
});

let myMembership = null;

async function initTeamsPage(){

    const profile =
    await getCurrentProfile();

    if(!profile){
        window.location.href = "../index.html";
        return;
    }

    myMembership =
    await getMyMembership();

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

        let buttonHtml = "";

        if(!myMembership){
            buttonHtml = `
                <button class="join-company-btn">
                    Firma beitreten
                </button>
            `;
        }else if(myMembership.team_id === team.id){
            buttonHtml = `
                <button class="small-danger-btn leave-company-btn">
                    Firma verlassen
                </button>
            `;
        }else{
            buttonHtml = `
                <button disabled>
                    Bereits in anderer Firma
                </button>
            `;
        }

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

            <div class="company-actions">

            <a class="detail-link" href="company.html?id=${team.id}">
                Profil ansehen
            </a>
            
            ${buttonHtml}
            </div>
        `;

        const joinBtn =
        card.querySelector(".join-company-btn");

        if(joinBtn){
            joinBtn.addEventListener("click", async () => {
                const result =
                await joinCompany(team.id);

                alert(result.message);

                myMembership =
                await getMyMembership();

                renderTeamsOverview();
            });
        }

        const leaveBtn =
        card.querySelector(".leave-company-btn");

        if(leaveBtn){
            leaveBtn.addEventListener("click", async () => {
                const confirmed =
                confirm("Firma wirklich verlassen?");

                if(!confirmed){
                    return;
                }

                const result =
                await leaveCompany();

                alert(result.message);

                myMembership =
                await getMyMembership();

                renderTeamsOverview();
            });
        }

        wrapper.appendChild(card);
    });
}