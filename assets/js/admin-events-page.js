document.addEventListener("DOMContentLoaded", () => {
    initAdminEventsPage();
});

async function initAdminEventsPage(){

    const profile =
    await getCurrentProfile();

    if(!profile){
        window.location.href = "../index.html";
        return;
    }

    const isAdmin =
        
        profile.role === "owner";

    if(!isAdmin){
        document.querySelector("main").innerHTML = `
            <section class="panel">
                <h2>Kein Zugriff</h2>
                <p class="info-text">Du bist kein Admin.</p>
            </section>
        `;
        return;
    }

    document
    .getElementById("createEventBtn")
    .addEventListener("click", handleCreateEvent);

    renderAdminEvents();
}

async function handleCreateEvent(){

    const title =
    document.getElementById("eventTitleInput").value.trim();

    const description =
    document.getElementById("eventDescriptionInput").value.trim();

    const bonusMultiplier =
    Number(
        document.getElementById("eventBonusInput").value
    );

    const durationHours =
    Number(
        document.getElementById("eventDurationInput").value
    );

    const targetTypes =
    Array.from(
        document.querySelectorAll(".event-type-checkbox:checked")
    ).map(checkbox => {
        return checkbox.value;
    });

    if(!title){
        showEventAdminMessage("Bitte Titel eingeben.");
        return;
    }

    const result =
    await createGameEvent({
        title:title,
        description:description,
        bonusMultiplier:bonusMultiplier,
        durationHours:durationHours,
        targetTypes:targetTypes
    });

    showEventAdminMessage(result.message);

    if(result.success){
        document.getElementById("eventTitleInput").value = "";
        document.getElementById("eventDescriptionInput").value = "";
        renderAdminEvents();
    }
}

async function renderAdminEvents(){

    const wrapper =
    document.getElementById("eventsAdminList");

    const events =
    await loadGameEvents();

    wrapper.innerHTML = "";

    if(events.length === 0){
        wrapper.innerHTML =
            "<p class='info-text'>Noch keine Events vorhanden.</p>";
        return;
    }

    events.forEach(event => {

        const div =
        document.createElement("div");

        div.className =
        "event-card";

        const endsAt =
        event.ends_at
        ? new Date(event.ends_at).toLocaleString("de-DE")
        : "Kein Ende";

        div.innerHTML = `
            <h3>${event.title}</h3>
            <p>${event.description || ""}</p>
            <p>Bonus: x${event.bonus_multiplier}</p>
            <p>Zielgruppen: ${(event.target_types || []).join(", ") || "Alle"}</p>
            <p>Status: ${event.active ? "Aktiv" : "Inaktiv"}</p>
            <small>Endet: ${endsAt}</small>

            <button class="small-danger-btn">
                Deaktivieren
            </button>
        `;

        div
        .querySelector("button")
        .addEventListener("click", async () => {

            const result =
            await deactivateGameEvent(event.id);

            showEventAdminMessage(result.message);

            renderAdminEvents();
        });

        wrapper.appendChild(div);
    });
}

function showEventAdminMessage(text){

    document.getElementById("eventAdminMessage").innerText =
    text;
}