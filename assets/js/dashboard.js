document.addEventListener("DOMContentLoaded", () => {
    initDashboard();
});

async function initDashboard(){

    const profile = await getCurrentProfile();

    if(!profile){
        window.location.href = "../index.html";
        return;
    }

    if(profile.is_blocked || !profile.active){
        await supabaseClient.auth.signOut();
        window.location.href = "../index.html";
        return;
    }

    document.getElementById("playerInfo").innerText =
        profile.username + " | Rolle: " + profile.role;

    document.getElementById("energyText").innerText =
        profile.energy + " / 100";

    document.getElementById("energyFill").style.width =
        profile.energy + "%";

    const logoutBtn = document.getElementById("logoutBtn");

    if(logoutBtn){
        logoutBtn.addEventListener("click", async (event) => {
            event.preventDefault();
            await logoutUser();
        });
    }
}
