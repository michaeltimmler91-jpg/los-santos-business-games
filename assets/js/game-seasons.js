async function getCurrentSeason(){

    const { data, error } =
    await supabaseClient
    .from("game_seasons")
    .select("*")
    .eq("active", true)
    .single();

    if(error){
        console.error(error);
        return null;
    }

    return data;
}

async function loadSeasonHistory(){

    const { data, error } =
    await supabaseClient
    .from("game_season_history")
    .select(`
        *,
        team:game_teams(name,color)
    `)
    .order("season_number", {
        ascending:false
    })
    .order("rank", {
        ascending:true
    });

    if(error){
        console.error(error);
        return [];
    }

    return data;
}

async function executeSeasonReset(){

    const season =
    await getCurrentSeason();

    if(!season){
        return;
    }

    const teams =
    await loadGameTeams();

    for(let i = 0; i < teams.length; i++){

        const team =
        teams[i];

        await supabaseClient
        .from("game_season_history")
        .insert({
            season_number:season.season_number,
            team_id:team.id,
            rank:i + 1,
            points:team.points
        });
    }

    await supabaseClient
    .from("game_teams")
    .update({
        points:0
    })
    .neq("id", "00000000-0000-0000-0000-000000000000");

    await supabaseClient
    .from("game_seasons")
    .update({
        active:false,
        ended_at:new Date().toISOString()
    })
    .eq("id", season.id);

    await supabaseClient
    .from("game_seasons")
    .insert({
        season_number:season.season_number + 1,
        active:true
    });

    return true;
}