function performPlayerAction(){

    let user = getCurrentUser();

    if(!user){
        return;
    }

    user = regenerateEnergy(user);

    if(!user.teamId){

        showActionMessage(
            "Du musst zuerst einem Team beitreten."
        );

        updateCurrentUser(user);

        return;
    }

    if(user.energy < GAME_CONFIG.actionEnergyCost){

        showActionMessage(
            "Nicht genug Energie. Bitte warte kurz."
        );

        updateCurrentUser(user);

        updateEnergyDisplay();

        return;
    }

    user.energy -= GAME_CONFIG.actionEnergyCost;
    user.lastEnergyUpdate = Date.now();

    const points =
        Math.floor(
            Math.random() *
            (
                GAME_CONFIG.maxPointsPerAction -
                GAME_CONFIG.minPointsPerAction + 1
            )
        ) +
        GAME_CONFIG.minPointsPerAction;

    addPointsToTeam(
        user.teamId,
        points
    );

    updateCurrentUser(user);

    updateEnergyDisplay();

    renderRanking();

    showActionMessage(
        "Du hast " +
        points +
        " Punkte gesammelt."
    );
}

function showActionMessage(text){

    document.getElementById(
        "actionMessage"
    ).innerText = text;
}
