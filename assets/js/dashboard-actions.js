document.addEventListener("DOMContentLoaded", () => {
    initDashboardActions();
});

let currentProfile = null;
let currentMembership = null;

async function initDashboardActions(){

    currentProfile =
    await getCurrentProfile();

    if(!currentProfile){
        window.location.href = "../index.html";
        return;
    }

    currentMembership =
    await getMyMembership();

    renderDashboardHeader();
    renderActions();
}

function renderDashboardHeader(){

    const playerInfo =
    document.getElementById("playerInfo");

    if(!currentMembership){

        playerInfo.innerHTML = `
            ${currentProfile.username}
            <br>
            Keine Firma
        `;

        return;
    }

    playerInfo.innerHTML = `
        ${currentProfile.username}
        <br>
        ${currentMembership.team.name}
    `;
}

function renderActions(){

    const wrapper =
    document.getElementById("actionsList");

    wrapper.innerHTML = "";

    GAME_ACTIONS.forEach(action => {

        const card =
        document.createElement("div");

        card.className =
        "action-card";

        card.innerHTML = `
            <h3>${action.title}</h3>

            <p>
                ${action.pointsMin}
                -
                ${action.pointsMax}
                Punkte
            </p>

            <p>
                Energie:
                ${action.energyCost}
            </p>

            <button>
                Aktion ausführen
            </button>
        `;

        card
        .querySelector("button")
        .addEventListener("click", async () => {
            await executeAction(action);
        });

        wrapper.appendChild(card);
    });
}

async function executeAction(action){

    currentProfile =
    await getCurrentProfile();

    currentMembership =
    await getMyMembership();

    if(!currentMembership){
        alert("Du bist in keiner Firma.");
        return;
    }

    if(currentProfile.energy < action.energyCost){
        alert("Nicht genug Energie.");
        return;
    }

    const points =
        Math.floor(
            Math.random() *
            (
                action.pointsMax -
                action.pointsMin + 1
            )
        ) +
        action.pointsMin;

    const newEnergy =
        currentProfile.energy -
        action.energyCost;

    const { error } =
    await supabaseClient
    .from("game_profiles")
    .update({
        energy:newEnergy
    })
    .eq("id", currentProfile.id);

    if(error){
        console.error(error);
        return;
    }

    await addPointsToCompany(
        currentMembership.team_id,
        points
    );

    currentProfile.energy =
    newEnergy;

    updateEnergyBar();

    alert(
        action.title +
        "\n+" +
        points +
        " Firmenpunkte"
    );
}

function updateEnergyBar(){

    const energyText =
    document.getElementById("energyText");

    const energyFill =
    document.getElementById("energyFill");

    energyText.innerText =
        currentProfile.energy + " / 100";

    energyFill.style.width =
        currentProfile.energy + "%";
}