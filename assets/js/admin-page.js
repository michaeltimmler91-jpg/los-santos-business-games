document.addEventListener("DOMContentLoaded", () => {
    initAdminPage();
});

async function initAdminPage(){

    const profile =
    await getCurrentProfile();

    if(!profile){

        window.location.href =
        "../index.html";

        return;
    }

    if(
        profile.role !== "admin" &&
        profile.role !== "owner"
    ){

        document.querySelector("main").innerHTML = `
            <section class="panel">
                <h2>Kein Zugriff</h2>

                <p class="info-text">
                    Du bist kein Admin.
                </p>
            </section>
        `;

        return;
    }

    renderAdminUsers();
}

async function renderAdminUsers(){

    const users =
    await loadAllUsers();

    const wrapper =
    document.getElementById(
        "adminUsersList"
    );

    wrapper.innerHTML = "";

    users.forEach(user => {

        const div =
        document.createElement("div");

        div.className =
        "admin-user-card";

        const activeText =
            user.active
            ? "Aktiv"
            : "Wartet";

        const blockedText =
            user.is_blocked
            ? "Gesperrt"
            : "Nicht gesperrt";

        div.innerHTML = `
            <div class="admin-user-head">

                <div>
                    <h3>${user.username}</h3>

                    <p>
                        ${activeText}
                        |
                        ${blockedText}
                    </p>
                </div>

            </div>

            <div class="admin-user-actions">

                <button class="activate-btn">
                    Aktivieren
                </button>

                <button class="block-btn">
                    Sperren
                </button>

                <button class="unblock-btn">
                    Entsperren
                </button>

                <select class="role-select">

                    <option value="user">
                        User
                    </option>

                    <option value="moderator">
                        Moderator
                    </option>

                    <option value="admin">
                        Admin
                    </option>

                    <option value="owner">
                        Owner
                    </option>

                </select>

            </div>
        `;

        div
        .querySelector(".activate-btn")
        .addEventListener("click", () => {
            activateUser(user.id);
        });

        div
        .querySelector(".block-btn")
        .addEventListener("click", () => {
            blockUser(user.id);
        });

        div
        .querySelector(".unblock-btn")
        .addEventListener("click", () => {
            unblockUser(user.id);
        });

        const select =
        div.querySelector(".role-select");

        select.value = user.role;

        select.addEventListener("change", () => {
            setUserRole(
                user.id,
                select.value
            );
        });

        wrapper.appendChild(div);
    });
}
