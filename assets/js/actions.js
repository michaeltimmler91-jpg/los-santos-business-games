function performPlayerAction(){

    const user = getCurrentUser();

    if(!user){
        return;
    }

    if(!user.teamId){

        showActionMessage(
            "Du musst zuerst einem Team beitreten."
        );

        return;
    }

    if(user.energy < GAME_CONFIG.actionEnergyCost){

        showActionMessage(
            "Nicht genug Energie."
        );

        return;
    }

    user.energy -= GAME_CONFIG.actionEnergyCost;

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
