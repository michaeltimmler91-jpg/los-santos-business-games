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
function getCompanyLevelBonus(company){

    if(!company){
        return 0;
    }

    if(company.level >= 10){
        return 0.20;
    }

    if(company.level >= 5){
        return 0.10;
    }

    if(company.level >= 3){
        return 0.05;
    }

    return 0;
}

function calculateLevelBonus(points, company){

    const bonus =
    getCompanyLevelBonus(company);

    return Math.floor(points * bonus);
}