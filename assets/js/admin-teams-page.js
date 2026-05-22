document.addEventListener("DOMContentLoaded", () => {
    initAdminTeams();
});

async function initAdminTeams(){

    const profile =
    await getCurrentProfile();

    if(!profile){
        window.location.href = "../index.html";
        return;
    }

    if(profile.role !== "admin" && profile.role !== "owner"){
        document.querySelector("main").innerHTML = `
            <section class="panel">
                <h2>Kein Zugriff</h2>
                <p class="info-text">Du bist kein Admin.</p>
            </section>
        `;
        return;
    }

    document
    .getElementById("createCompanyBtn")
    .addEventListener("click", handleCreateCompany);

    renderCompanyAdminList();
}

async function handleCreateCompany(){

    const name =
    document.getElementById("companyNameInput").value.trim();

    const shortName =
    document.getElementById("companyShortInput").value.trim();

    const type =
    document.getElementById("companyTypeInput").value;

    const description =
    document.getElementById("companyDescriptionInput").value.trim();

    const color =
    document.getElementById("companyColorInput").value;

    if(!name){
        showCompanyAdminMessage("Bitte Firmennamen eingeben.");
        return;
    }

    const result =
    await createGameTeam({
        name:name,
        shortName:shortName,
        type:type,
        description:description,
        color:color
    });

    showCompanyAdminMessage(result.message);

    if(result.success){
        document.getElementById("companyNameInput").value = "";
        document.getElementById("companyShortInput").value = "";
        document.getElementById("companyDescriptionInput").value = "";

        renderCompanyAdminList();
    }
}

async function renderCompanyAdminList(){

    const teams =
    await loadGameTeams();

    const wrapper =
    document.getElementById("companyAdminList");

    wrapper.innerHTML = "";

    if(teams.length === 0){
        wrapper.innerHTML =
            "<p class='info-text'>Noch keine Firmen vorhanden.</p>";
        return;
    }

    teams.forEach(team => {

        const card =
        document.createElement("div");

        card.className =
        "admin-team-card";

        const leaderName =
            team.leader && team.leader.username
            ? team.leader.username
            : "Keine Leitung";

        card.innerHTML = `
            <div class="admin-team-head">
                <span class="team-dot large" style="background:${team.color}"></span>

                <div>
                    <h3>${team.name}</h3>
                    <p>${team.short_name || "Kein Kürzel"} | ${team.type} | ${team.points} Punkte</p>
                    <p>Leitung: ${leaderName}</p>
                </div>
            </div>

            <p class="info-text">${team.description || ""}</p>

            <button class="small-danger-btn">
                Firma löschen
            </button>
        `;

        card
        .querySelector("button")
        .addEventListener("click", async () => {

            const confirmed =
            confirm("Firma wirklich löschen?");

            if(!confirmed){
                return;
            }

            const result =
            await deleteGameTeam(team.id);

            showCompanyAdminMessage(result.message);

            renderCompanyAdminList();
        });

        wrapper.appendChild(card);
    });
}

function showCompanyAdminMessage(text){
    document.getElementById("companyAdminMessage").innerText = text;
}