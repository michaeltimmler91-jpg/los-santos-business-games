async function loadGameTeams(){

    const { data, error } =
    await supabaseClient
    .from("game_teams")
    .select(`
        *,
        leader:game_profiles(username)
    `)
    .order("points", {
        ascending:false
    });

    if(error){
        console.error(error);
        return [];
    }

    return data;
}

async function createGameTeam(teamData){

    const { error } =
    await supabaseClient
    .from("game_teams")
    .insert({
        name:teamData.name,
        short_name:teamData.shortName,
        type:teamData.type,
        description:teamData.description,
        color:teamData.color,
        points:0
    });

    if(error){
        return {
            success:false,
            message:error.message
        };
    }

    return {
        success:true,
        message:"Firma wurde erstellt."
    };
}

async function deleteGameTeam(teamId){

    const { error } =
    await supabaseClient
    .from("game_teams")
    .delete()
    .eq("id", teamId);

    if(error){
        return {
            success:false,
            message:error.message
        };
    }

    return {
        success:true,
        message:"Firma wurde gelöscht."
    };
}

async function updateGameTeamLeader(teamId, leaderId){

    const { error } =
    await supabaseClient
    .from("game_teams")
    .update({
        leader_id:leaderId || null
    })
    .eq("id", teamId);

    if(error){
        return {
            success:false,
            message:error.message
        };
    }

    return {
        success:true,
        message:"Leitung wurde gespeichert."
    };
}
