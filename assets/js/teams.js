let selectedTeam = null;

function renderTeams(){

    const teamList =
    document.getElementById("teamList");

    teamList.innerHTML = "";

    TEAMS.forEach(team => {

        const div =
        document.createElement("div");

        div.className = "team-card";

        div.style.background = team.color;

        div.innerHTML = `
            <h3>${team.name}</h3>
            <p>Punkte: ${team.points}</p>
        `;

        div.addEventListener("click",()=>{

            document
            .querySelectorAll(".team-card")
            .forEach(card => {
                card.classList.remove("active");
            });

            div.classList.add("active");

            selectedTeam = team.id;
        });

        teamList.appendChild(div);
    });
}
