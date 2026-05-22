document.addEventListener("DOMContentLoaded", () => {
    initRankingPage();
});

async function initRankingPage(){

    const profile =
    await getCurrentProfile();

    if(!profile){
        window.location.href = "../index.html";
        return;
    }

    renderRanking();
}

async function renderRanking(){

    const rankingList =
    document.getElementById("rankingList");

    const teams =
    await loadGameTeams();

    rankingList.innerHTML = "";

    if(teams.length === 0){
        rankingList.innerHTML =
            "<p class='info-text'>Noch keine Firmen vorhanden.</p>";
        return;
    }

    teams.forEach((team, index) => {

        const div =
        document.createElement("div");

        div.className =
        "ranking-card";

        div.innerHTML = `
            <span class="rank">#${index + 1}</span>
            <span class="team-dot" style="background:${team.color}"></span>
            <strong>${team.name}</strong>
            <span>${team.points} Punkte</span>
        `;

        rankingList.appendChild(div);
    });
}