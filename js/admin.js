async function initAdmin() {
    await loadCompanies();
    await loadLeaderboard();
}

function generateCode() {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code = "";

    for (let i = 0; i < 4; i++) {
        code += chars[
            Math.floor(Math.random() * chars.length)
        ];
    }

    document.getElementById("companyCode").value =
    "LS-" + code;
}

async function createCompany() {
    const name = document.getElementById("companyName").value.trim();
    const icon = document.getElementById("companyIcon").value.trim() || "🏢";
    const color = document.getElementById("companyColor").value;
    const code = document.getElementById("companyCode").value.trim();
    const message = document.getElementById("adminMessage");

    if (!name || !code) {
        message.innerText = "Bitte Firmenname und Code eintragen.";
        return;
    }

    const { data, error } = await db
        .from("game_companies")
        .insert([{
            name: name,
            icon: icon,
            color: color,
            join_code: code,
            active: true
        }])
        .select()
        .single();

    if (error) {
        console.error(error);
        message.innerText = "Firma konnte nicht erstellt werden.";
        return;
    }

    await db
        .from("game_scores")
        .insert([{
            company_id: data.id,
            points: 0
        }]);

    message.innerText = "Firma erstellt.";

    document.getElementById("companyName").value = "";
    document.getElementById("companyCode").value = "";

    await loadCompanies();
    await loadLeaderboard();
}

async function loadCompanies() {
    const { data, error } = await db
        .from("game_companies")
        .select("*")
        .order("name", { ascending: true });

    if (error) {
        console.error(error);
        return;
    }

    const box = document.getElementById("adminCompanies");
    box.innerHTML = "";

    if (!data || data.length === 0) {
        box.innerHTML = "Noch keine Firmen.";
        return;
    }

    data.forEach(company => {
        box.innerHTML += `
            <div class="company-row">
                <div>
                    <strong>${company.icon} ${company.name}</strong><br>
                    <span class="small-text">Code: ${company.join_code}</span>
                </div>

                <button onclick="toggleCompany(${company.id}, ${!company.active})">
                    ${company.active ? "Deaktivieren" : "Aktivieren"}
                </button>
            </div>
        `;
    });
}

async function toggleCompany(id, active) {
    await db
        .from("game_companies")
        .update({ active: active })
        .eq("id", id);

    await loadCompanies();
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

    const box = document.getElementById("adminLeaderboard");
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

initAdmin();
