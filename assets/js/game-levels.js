function getRequiredXpForLevel(level){

    return level * 100;
}

async function addCompanyXp(teamId, amount){

    const company =
    await getCompanyById(teamId);

    if(!company){
        return null;
    }

    let xp =
        company.xp + amount;

    let level =
        company.level;

    let leveledUp =
        false;

    while(
        xp >= getRequiredXpForLevel(level)
    ){

        xp -= getRequiredXpForLevel(level);

        level++;

        leveledUp = true;
    }

    const { error } =
    await supabaseClient
    .from("game_teams")
    .update({
        xp:xp,
        level:level
    })
    .eq("id", company.id);

    if(error){
        console.error(error);
        return null;
    }

    return {
        level:level,
        xp:xp,
        leveledUp:leveledUp
    };
}