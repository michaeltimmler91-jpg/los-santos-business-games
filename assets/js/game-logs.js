async function createActivityLog(logData){

    console.log("LOG DATA:", logData);

    const { error } =
    await supabaseClient
    .from("game_activity_logs")
    .insert({
        user_id:logData.userId,
        team_id:logData.teamId,
        action_id:logData.actionId,
        action_title:logData.actionTitle,
        points:logData.points,
        base_points:
    logData.basePoints !== undefined
    ? logData.basePoints
    : logData.points,

bonus_points:
    logData.bonusPoints !== undefined
    ? logData.bonusPoints
    : 0
    });

    if(error){
        console.error("Log konnte nicht gespeichert werden:", error);
    }
}

async function loadCompanyLogs(teamId){

    const { data, error } =
    await supabaseClient
    .from("game_activity_logs")
    .select(`
        *,
        profile:game_profiles(username)
    `)
    .eq("team_id", teamId)
    .order("created_at", {
        ascending:false
    })
    .limit(20);

    if(error){
        console.error(error);
        return [];
    }

    return data;
}