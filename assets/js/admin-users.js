async function loadAllUsers(){

    const { data, error } =
    await supabaseClient
    .from("game_profiles")
    .select("*")
    .order("created_at", {
        ascending:false
    });

    if(error){
        console.error(error);
        return [];
    }

    return data;
}

async function activateUser(userId){

    const { error } =
    await supabaseClient
    .from("game_profiles")
    .update({
        active:true
    })
    .eq("id", userId);

    if(error){
        console.error(error);
        return;
    }

    renderAdminUsers();
}

async function blockUser(userId){

    const { error } =
    await supabaseClient
    .from("game_profiles")
    .update({
        is_blocked:true
    })
    .eq("id", userId);

    if(error){
        console.error(error);
        return;
    }

    renderAdminUsers();
}

async function unblockUser(userId){

    const { error } =
    await supabaseClient
    .from("game_profiles")
    .update({
        is_blocked:false
    })
    .eq("id", userId);

    if(error){
        console.error(error);
        return;
    }

    renderAdminUsers();
}

async function setUserRole(userId, role){

    const { error } =
    await supabaseClient
    .from("game_profiles")
    .update({
        role:role
    })
    .eq("id", userId);

    if(error){
        console.error(error);
        return;
    }

    renderAdminUsers();
}
