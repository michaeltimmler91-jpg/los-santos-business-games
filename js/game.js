let companies = [];
let currentPlayer = null;

const districts = [
    "Mirror Park",
    "Vespucci",
    "Downtown",
    "Sandy Shores",
    "Paleto Bay",
    "Davis",
    "Rockford Hills",
    "Del Perro",
    "La Mesa",
    "Grapeseed"
];

const actionNames = {
    lieferung: "Lieferung abgeschlossen",
    einsatz: "Einsatz erledigt",
    support: "Support geleistet",
    chaos: "Chaos-Aktion gewonnen"
};

async function initGame() {
    await loadCompanies();
    restorePlayer();
    await loadLeaderboard();
    await loadActionFeed();
    await loadDistricts();
    setupRealtime();
}

async function loadCompanies() {
    const { data, error } = await db
        .from("game_companies")
        .select("*")
        .eq("active", true)
        .order("name", { ascending: true });

    if (error) {
        console.error(error);
        return;
    }

    companies = data || [];

    const select = document.getElementById("companySelect");
    select.innerHTML = "";

    companies.forEach(company => {
        select.innerHTML += `
            <option value="${company.id}">
                ${company.icon} ${company.name}
            </option>
        `;
    });
}

function joinGame() {
    const playerName = document.getElementById("playerName").value.trim();
    const companyId = Number(document.getElementById("companySelect").value);
    const joinCode = document.getElementById("joinCode").value.trim();
    const message = document.getElementById("joinMessage");

    const company = companies.find(c => c.id === companyId);

    if (!playerName || !company || !joinCode) {
        message.innerText = "Bitte alles ausf&uuml;llen.";
        return;
    }

    if (company.join_code !== joinCode) {
        message.innerText = "Falscher Firmen-Code.";
        return;
    }

    currentPlayer = {
        name: playerName,
        company_id: company.id,
        company_name: company.name,
        company_icon: company.icon
    };

    localStorage.setItem(
        "businessGamePlayer",
        JSON.stringify(currentPlayer)
    );

    showGame();
}

function restorePlayer() {
    const saved = localStorage.getItem("businessGamePlayer");

    if (!saved) return;

    currentPlayer = JSON.parse(saved);
    showGame();
}

function showGame() {
    document.getElementById("gameBox").style.display = "block";

    document.getElementById("playerInfo").innerHTML =
    `${currentPlayer.company_icon} ${currentPlayer.name} spielt f&uuml;r ${currentPlayer.company_name}`;
}

function leaveGame() {
    localStorage.removeItem("businessGamePlayer");
    location.reload();
}

async function playAction(type) {
    if (!currentPlayer) return;

    const district =
    districts[Math.floor(Math.random() * districts.length)];

    const points =
    Math.floor(Math.random() * 41) + 10;

    const actionText =
    actionNames[type] || "Aktion";

    const { error } = await db.rpc(
        "game_add_score",
        {
            p_company_id: currentPlayer.company_id,
            p_player_name: currentPlayer.name,
            p_action_type: actionText,
            p_district: district,
            p_points: points
        }
    );

    if (error) {
        console.error(error);
        document.getElementById("actionResult").innerText =
        "Aktion konnte nicht gespeichert werden.";
        return;
    }

    document.getElementById("actionResult").innerHTML =
    `<strong>+${points} Punkte</strong><br>${actionText} in ${district}`;

    await loadLeaderboard();
    await loadActionFeed();
}

async function loadLeaderboard() {
    const { data, error } = await db
        .from("game_scores")
        .select(`
            points,
            game_companies (
                name,
                icon
            )
        `)
        .order("points", { ascending: false });

    if (error) {
        console.error(error);
        return;
    }

    const box = document.getElementById("leaderboard");
    box.innerHTML = "";

    if (!data || data.length === 0) {
        box.innerHTML = "Noch keine Punkte.";
        return;
    }

    data.forEach((row, index) => {
        box.innerHTML += `
            <div class="leader-row">
                <span>#${index + 1} ${row.game_companies.icon} ${row.game_companies.name}</span>
                <strong>${row.points} Punkte</strong>
            </div>
        `;
    });
}

async function loadActionFeed() {
    const { data, error } = await db
        .from("game_actions")
        .select(`
            *,
            game_companies (
                name,
                icon
            )
        `)
        .order("created_at", { ascending: false })
        .limit(12);

    if (error) {
        console.error(error);
        return;
    }

    const box = document.getElementById("actionFeed");
    box.innerHTML = "";

    if (!data || data.length === 0) {
        box.innerHTML = "Noch keine Aktionen.";
        return;
    }

    data.forEach(action => {
        box.innerHTML += `
            <div class="feed-row">
                <strong>${action.game_companies.icon} ${action.game_companies.name}</strong><br>
                <span class="small-text">
                    ${action.player_name}: ${action.action_type}
                    in ${action.district}
                    +${action.points} Punkte
                </span>
            </div>
        `;
    });
}

function setupRealtime() {
    db.channel("business-games-live")
        .on(
            "postgres_changes",
            {
                event: "*",
                schema: "public",
                table: "game_scores"
            },
            () => loadLeaderboard()
        )
        .on(
            "postgres_changes",
            {
                event: "INSERT",
                schema: "public",
                table: "game_actions"
            },
            () => loadActionFeed()
        )
        .on(
            "postgres_changes",
            {
                event: "*",
                schema: "public",
                table: "game_districts"
            },
            () => loadDistricts()
        )
        .subscribe();
}

async function loadDistricts() {
    const { data, error } = await db
        .from("game_districts")
        .select(`
            *,
            game_companies (
                name,
                icon,
                color
            )
        `)
        .eq("active", true)
        .order("name", {
            ascending: true
        });

    if (error) {
        console.error(error);
        return;
    }

    const box = document.getElementById("districtGrid");

    if (!box) return;

    box.innerHTML = "";

    if (!data || data.length === 0) {
        box.innerHTML = "Noch keine Gebiete.";
        return;
    }

    data.forEach(district => {
        const owner = district.game_companies;

        box.innerHTML += `
            <div class="district-card">
                <strong>📍 ${district.name}</strong>

                <div class="${
                    owner
                    ? "district-owner"
                    : "district-empty"
                }">
                    ${
                        owner
                        ? `${owner.icon} ${owner.name}`
                        : "Noch neutral"
                    }
                </div>
            </div>
        `;
    });

    const attackSelect =
    document.getElementById("districtAttackSelect");

    if (attackSelect) {
        attackSelect.innerHTML = "";

        data.forEach(district => {
            attackSelect.innerHTML += `
                <option value="${district.id}">
                    ${district.name}
                </option>
            `;
        });
    }
}
async function attackDistrict() {

    if (!currentPlayer) return;

    const districtId =
    Number(
        document.getElementById(
            "districtAttackSelect"
        ).value
    );

    const { data:district } =
    await db
    .from("game_districts")
    .select("*")
    .eq("id", districtId)
    .single();

    if (!district) return;

    const attackPower =
    Math.floor(
        Math.random() * 120
    ) + 20;

    if (
        attackPower >=
        district.points_required
    ) {

        await db
        .from("game_districts")
        .update({
            owner_company_id:
            currentPlayer.company_id
        })
        .eq("id", district.id);

        document.getElementById(
            "actionResult"
        ).innerHTML = `
            🏆 ${district.name}
            wurde übernommen!
        `;

        await db
        .from("game_actions")
        .insert([{
            company_id:
            currentPlayer.company_id,

            player_name:
            currentPlayer.name,

            action_type:
            "Gebiet übernommen",

            district:
            district.name,

            points:
            attackPower
        }]);

    } else {

        document.getElementById(
            "actionResult"
        ).innerHTML = `
            ❌ Angriff auf
            ${district.name}
            fehlgeschlagen.
            <br>
            Angriffsstärke:
            ${attackPower}
        `;
    }

    await loadDistricts();
    await loadActionFeed();
}
initGame();
