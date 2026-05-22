document.addEventListener("DOMContentLoaded", () => {
    renderNavigation();
});

async function renderNavigation(){

    const nav =
    document.querySelector("nav");

    if(!nav){
        return;
    }

    const profile =
    await getCurrentProfile();

    if(!profile){
        nav.innerHTML = "";
        return;
    }

    const isAdmin =
        profile.role === "admin" ||
        profile.role === "owner";

    const isOwner =
        profile.role === "owner";

    let isCompanyLeader = false;

    const membership =
    typeof getMyMembership === "function"
        ? await getMyMembership()
        : null;

    if(membership && membership.team){
        isCompanyLeader =
            membership.team.leader_id === profile.id;
    }

    let html = `
        <a href="dashboard.html">Spiel</a>
        <a href="teams.html">Firmen</a>
        <a href="ranking.html">Rangliste</a>
        <a href="seasons.html">Seasons</a>
    `;

    if(isCompanyLeader || isAdmin){
        html += `
            <a href="team-admin.html">Firmenleitung</a>
        `;
    }

    if(isAdmin){
        html += `
            <a href="admin.html">User-Admin</a>
            <a href="admin-teams.html">Firmen-Admin</a>
        `;
    }

    if(isOwner){
        html += `
            <a href="admin-events.html">Event-Admin</a>
        `;
    }

    nav.innerHTML = html;
}