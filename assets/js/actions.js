function performPlayerAction(){
    const player = loadData("player");

    if(!player){
        return;
    }

    if(player.energy < GAME_CONFIG.actionEnergyCost){
        showActionMessage("Nicht genug Energie. Bitte warte oder lade Energie auf.");
        return;
    }

    player.energy -= GAME_CONFIG.actionEnergyCost;

    const points =
        Math.floor(
            Math.random() *
            (GAME_CONFIG.maxPointsPerAction - GAME_CONFIG.minPointsPerAction + 1)
        ) + GAME_CONFIG.minPointsPerAction;

    addPointsToTeam(player.team, points);

    saveData("player", player);

    updateEnergyDisplay();
    renderRanking();

    showActionMessage("Du hast " + points + " Punkte für dein Team gesammelt!");
}

function showActionMessage(text){
    document.getElementById("actionMessage").innerText = text;
}
