document.addEventListener("DOMContentLoaded", () => {
    initDashboardActions();
});

let currentProfile = null;
let currentMembership = null;

async function initDashboardActions(){

    currentProfile =
    await getCurrentProfile();

    currentProfile =
    await syncEnergy(currentProfile);

    if(!currentProfile){
        window.location.href = "../index.html";
        return;
    }

    currentMembership =
    await getMyMembership();

    renderDashboardHeader();
    renderActions();
    renderDailyTasks();
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

async function renderActions(){

    const wrapper =
    document.getElementById("actionsList");

    wrapper.innerHTML = "";

    const availableActions =
        currentMembership && currentMembership.team
        ? getActionsForCompany(currentMembership.team)
        : [];

if(availableActions.length === 0){
    wrapper.innerHTML =
        "<p class='info-text'>Für deine Firma gibt es aktuell keine passenden Aktionen.</p>";
    return;
}

for(const action of availableActions){

        const cooldownData =
        await getCooldown(action.id);

        const remaining =
        getRemainingCooldownSeconds(
            cooldownData,
            action.cooldown
        );

        const card =
        document.createElement("div");

        card.className =
        "action-card";

        let buttonHtml = "";

        if(remaining > 0){

            buttonHtml = `
                <button disabled>
                    Cooldown:
                    ${formatCooldown(remaining)}
                </button>
            `;

        }else{

            buttonHtml = `
                <button class="execute-action-btn">
                    Aktion ausführen
                </button>
            `;
        }

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

            <p>
                Cooldown:
                ${Math.floor(action.cooldown / 60)}
                Minuten
            </p>

            ${buttonHtml}
        `;

        const executeBtn =
        card.querySelector(".execute-action-btn");

        if(executeBtn){

            executeBtn.addEventListener("click", async () => {
                await executeAction(action);
            });
        }

        wrapper.appendChild(card);
    }
}

async function executeAction(action){

    currentProfile =
    await getCurrentProfile();

    currentProfile =
    await syncEnergy(currentProfile);

    currentMembership =
    await getMyMembership();

    if(!currentMembership){
        alert("Du bist in keiner Firma.");
        return;
    }

    const cooldownData =
    await getCooldown(action.id);

    const remaining =
    getRemainingCooldownSeconds(
        cooldownData,
        action.cooldown
    );

    if(remaining > 0){

        alert(
            "Cooldown aktiv:\n" +
            formatCooldown(remaining)
        );

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
        energy:newEnergy,
        last_energy_update:new Date().toISOString()
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

    const taskResult =
await updateDailyTaskProgress(
    currentMembership.team_id,
    action.id
);

if(taskResult && taskResult.completed){
    alert(
        "Tagesaufgabe abgeschlossen!\n+" +
        taskResult.rewardPoints +
        " Bonus-Firmenpunkte"
    );
}

    await setCooldown(action.id);

    currentProfile.energy =
    newEnergy;

    updateEnergyBar();

    alert(
        action.title +
        "\n+" +
        points +
        " Firmenpunkte"
    );

    renderActions();
    renderDailyTasks();
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
async function renderDailyTasks(){

    const wrapper =
    document.getElementById("dailyTasksList");

    if(!wrapper){
        return;
    }

    if(!currentMembership){
        wrapper.innerHTML =
            "<p class='info-text'>Du bist in keiner Firma.</p>";
        return;
    }

    const tasks =
    await createDailyTasksIfNeeded(currentMembership.team);

    wrapper.innerHTML = "";

    if(tasks.length === 0){
        wrapper.innerHTML =
            "<p class='info-text'>Keine Tagesaufgaben vorhanden.</p>";
        return;
    }

    tasks.forEach(task => {

        const action =
        GAME_ACTIONS.find(a => {
            return a.id === task.action_id;
        });

        const title =
        action ? action.title : task.action_id;

        const div =
        document.createElement("div");

        div.className =
        "daily-task-card";

        div.innerHTML = `
            <strong>${title}</strong>
            <p>
                ${task.current_count}
                /
                ${task.target_count}
                erledigt
            </p>
            <p>
                Belohnung:
                ${task.reward_points}
                Firmenpunkte
            </p>
            <p>
                Status:
                ${task.completed ? "Abgeschlossen" : "Offen"}
            </p>
        `;

        wrapper.appendChild(div);
    });
}