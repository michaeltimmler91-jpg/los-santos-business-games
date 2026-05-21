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
        role:"member",
        energy:100
    };

    addPlayerToTeam(selectedTeam, playerName);

    saveData("player",player);

    window.location.href =
    "pages/dashboard.html";
}

function logoutPlayer(){
    localStorage.removeItem("player");
    window.location.href = "../index.html";
}
