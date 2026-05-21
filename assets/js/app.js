document.addEventListener(
    "DOMContentLoaded",
    ()=>{

        renderTeams();

        document
        .getElementById("startGameBtn")
        .addEventListener(
            "click",
            createPlayer
        );
    }
);
