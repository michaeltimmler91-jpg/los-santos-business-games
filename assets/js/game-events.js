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
async function createGameEvent(eventData){

    const endsAt =
    new Date(
        Date.now() + eventData.durationHours * 60 * 60 * 1000
    ).toISOString();

    const { error } =
    await supabaseClient
    .from("game_events")
    .insert({
        title:eventData.title,
        description:eventData.description,
        active:true,
        bonus_multiplier:eventData.bonusMultiplier,
        target_types:eventData.targetTypes,
        ends_at:endsAt
    });

    if(error){
        return {
            success:false,
            message:error.message
        };
    }

    return {
        success:true,
        message:"Event wurde erstellt."
    };
}

async function loadGameEvents(){

    const { data, error } =
    await supabaseClient
    .from("game_events")
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

async function deactivateGameEvent(eventId){

    const { error } =
    await supabaseClient
    .from("game_events")
    .update({
        active:false
    })
    .eq("id", eventId);

    if(error){
        return {
            success:false,
            message:error.message
        };
    }

    return {
        success:true,
        message:"Event wurde deaktiviert."
    };
}