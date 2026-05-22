async function loadDailyTasks(teamId){

    const today =
    new Date().toISOString().split("T")[0];

    const { data, error } =
    await supabaseClient
    .from("game_daily_tasks")
    .select("*")
    .eq("team_id", teamId)
    .eq("task_date", today)
    .order("created_at", {
        ascending:true
    });

    if(error){
        console.error(error);
        return [];
    }

    return data;
}

async function createDailyTasksIfNeeded(company){

    const existing =
    await loadDailyTasks(company.id);

    if(existing.length > 0){
        return existing;
    }

    const actions =
    getActionsForCompany(company);

    const selectedActions =
    actions.slice(0, 2);

    const inserts =
    selectedActions.map(action => {
        return {
            team_id:company.id,
            action_id:action.id,
            target_count:1,
            current_count:0,
            reward_points:50,
            completed:false
        };
    });

    if(inserts.length === 0){
        return [];
    }

    const { error } =
    await supabaseClient
    .from("game_daily_tasks")
    .insert(inserts);

    if(error){
        console.error(error);
        return [];
    }

    return await loadDailyTasks(company.id);
}

async function updateDailyTaskProgress(teamId, actionId){

    const tasks =
    await loadDailyTasks(teamId);

    const task =
    tasks.find(t => {
        return t.action_id === actionId;
    });

    if(!task || task.completed){
        return null;
    }

    const newCount =
    task.current_count + 1;

    const completed =
    newCount >= task.target_count;

    const { error } =
    await supabaseClient
    .from("game_daily_tasks")
    .update({
        current_count:newCount,
        completed:completed
    })
    .eq("id", task.id);

    if(error){
        console.error(error);
        return null;
    }

    if(completed){
        await addPointsToCompany(
            teamId,
            task.reward_points
        );
    }

    return {
        completed:completed,
        rewardPoints:task.reward_points
    };
}