async function getMyMembership(){

    const { data:sessionData } =
    await supabaseClient.auth.getSession();

    if(!sessionData.session){
        return null;
    }

    const userId =
    sessionData.session.user.id;

    const { data, error } =
    await supabaseClient
    .from("game_members")
    .select(`
        *,
        team:game_teams(*)
    `)
    .eq("user_id", userId)
    .maybeSingle();

    if(error){
        console.error(error);
        return null;
    }

    return data;
}

async function joinCompany(teamId){

    const { data:sessionData } =
    await supabaseClient.auth.getSession();

    if(!sessionData.session){
        return {
            success:false,
            message:"Nicht eingeloggt."
        };
    }

    const userId =
    sessionData.session.user.id;

    const existing =
    await getMyMembership();

    if(existing){
        return {
            success:false,
            message:"Du bist bereits in einer Firma."
        };
    }

    const { error } =
    await supabaseClient
    .from("game_members")
    .insert({
        user_id:userId,
        team_id:teamId
    });

    if(error){
        return {
            success:false,
            message:error.message
        };
    }

    return {
        success:true,
        message:"Du bist der Firma beigetreten."
    };
}

async function leaveCompany(){

    const { data:sessionData } =
    await supabaseClient.auth.getSession();

    if(!sessionData.session){
        return {
            success:false,
            message:"Nicht eingeloggt."
        };
    }

    const userId =
    sessionData.session.user.id;

    const { error } =
    await supabaseClient
    .from("game_members")
    .delete()
    .eq("user_id", userId);

    if(error){
        return {
            success:false,
            message:error.message
        };
    }

    return {
        success:true,
        message:"Du hast die Firma verlassen."
    };
}
async function loadCompanyMembers(teamId){

    const { data, error } =
    await supabaseClient
    .from("game_members")
    .select(`
        *,
        profile:game_profiles(*)
    `)
    .eq("team_id", teamId)
    .order("joined_at", {
        ascending:true
    });

    if(error){
        console.error(error);
        return [];
    }

    return data;
}

async function removeCompanyMember(userId){

    const { error } =
    await supabaseClient
    .from("game_members")
    .delete()
    .eq("user_id", userId);

    if(error){
        return {
            success:false,
            message:error.message
        };
    }

    return {
        success:true,
        message:"Mitglied wurde entfernt."
    };
}