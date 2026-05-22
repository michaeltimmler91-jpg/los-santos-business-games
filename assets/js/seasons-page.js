document.addEventListener("DOMContentLoaded", () => {
    initSeasonsPage();
});

async function initSeasonsPage(){

    const profile =
    await getCurrentProfile();

    if(!profile){
        window.location.href = "../index.html";
        return;
    }

    renderSeasonHistory();

    const resetBtn =
    document.getElementById("manualSeasonResetBtn");

    const isAdmin =
        profile.role === "admin" ||
        profile.role === "owner";

    if(!isAdmin){
        resetBtn.style.display = "none";
        return;
    }

    resetBtn.addEventListener("click", async () => {

        const confirmed =
        confirm(
            "Season wirklich zurücksetzen?"
        );

        if(!confirmed){
            return;
        }

        await executeSeasonReset();

        alert("Season wurde zurückgesetzt.");

        renderSeasonHistory();
    });
}

async function renderSeasonHistory(){

    const wrapper =
    document.getElementById("seasonHistoryList");

    const history =
    await loadSeasonHistory();

    wrapper.innerHTML = "";

    if(history.length === 0){
        wrapper.innerHTML =
            "<p class='info-text'>Noch keine vergangenen Seasons vorhanden.</p>";
        return;
    }

    history.forEach(entry => {

        const div =
        document.createElement("div");

        div.className =
        "season-history-card";

        const medal =
            entry.rank === 1 ? "🥇" :
            entry.rank === 2 ? "🥈" :
            entry.rank === 3 ? "🥉" :
            "#" + entry.rank;

        div.innerHTML = `
            <strong>
                Season ${entry.season_number}
            </strong>

            <p>
                ${medal}
                ${entry.team.name}
            </p>

            <p>
                ${entry.points} Punkte
            </p>
        `;

        wrapper.appendChild(div);
    });
}