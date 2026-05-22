async function getActiveEvent(){

    const now =
    new Date().toISOString();

    const { data, error } =
    await supabaseClient
    .from("game_events")
    .select("*")
    .eq("active", true)
    .or(`ends_at.is.null,ends_at.gt.${now}`)
    .order("created_at", {
        ascending:false
    })
    .limit(1)
    .maybeSingle();

    if(error){
        console.error(error);
        return null;
    }

    return data;
}

function companyMatchesEvent(company, event){

    if(!company || !event){
        return false;
    }

    if(!event.target_types || event.target_types.length === 0){
        return true;
    }

    return event.target_types.includes(company.type);
}

function calculateEventBonus(points, company, event){

    if(!companyMatchesEvent(company, event)){
        return 0;
    }

    return Math.floor(
        points * (event.bonus_multiplier - 1)
    );
}