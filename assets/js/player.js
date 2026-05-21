function createPlayer(){

    const playerName =
    document
    .getElementById("playerName")
    .value
    .trim();

    if(!playerName){
        alert("Bitte Spielernamen eingeben");
        return;
    }

    if(!selectedTeam){
        alert("Bitte ein Team wählen");
        return;
    }

    const player = {
        name:playerName,
        team:selectedTeam,
        energy:100
    };

    saveData("player",player);

    window.location.href =
    "pages/dashboard.html";
}
