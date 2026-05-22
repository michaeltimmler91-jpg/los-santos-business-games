async function getCooldown(actionId){

    const { data:sessionData } =
    await supabaseClient.auth.getSession();

    if(!sessionData.session){
        return null;
    }

    const userId =
    sessionData.session.user.id;

    const { data, error } =
    await supabaseClient
    .from("game_action_cooldowns")
    .select("*")
    .eq("user_id", userId)
    .eq("action_id", actionId)
    .maybeSingle();

    if(error){
        console.error(error);
        return null;
    }

    return data;
}

async function setCooldown(actionId){

    const { data:sessionData } =
    await supabaseClient.auth.getSession();

    if(!sessionData.session){
        return;
    }

    const userId =
    sessionData.session.user.id;

    const existing =
    await getCooldown(actionId);

    if(existing){

        await supabaseClient
        .from("game_action_cooldowns")
        .update({
            last_used:new Date().toISOString()
        })
        .eq("id", existing.id);

        return;
    }

    await supabaseClient
    .from("game_action_cooldowns")
    .insert({
        user_id:userId,
        action_id:actionId
    });
}

function getRemainingCooldownSeconds(cooldownData, cooldownSeconds){

    if(!cooldownData){
        return 0;
    }

    const lastUsed =
    new Date(cooldownData.last_used).getTime();

    const now =
    Date.now();

    const passedSeconds =
        Math.floor(
            (now - lastUsed) / 1000
        );

    const remaining =
        cooldownSeconds - passedSeconds;

    return Math.max(0, remaining);
}

function formatCooldown(seconds){

    const minutes =
    Math.floor(seconds / 60);

    const secs =
    seconds % 60;

    return `
        ${minutes}
        min
        ${secs}
        sek
    `;
}