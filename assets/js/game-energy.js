const MAX_ENERGY = 100;
const ENERGY_REGEN_SECONDS = 300;
const ENERGY_REGEN_AMOUNT = 10;

function calculateRegeneratedEnergy(profile){

    if(!profile.last_energy_update){
        profile.last_energy_update = new Date().toISOString();
    }

    const lastUpdate =
    new Date(profile.last_energy_update).getTime();

    const now =
    Date.now();

    const secondsPassed =
    Math.floor((now - lastUpdate) / 1000);

    const regenSteps =
    Math.floor(secondsPassed / ENERGY_REGEN_SECONDS);

    if(regenSteps <= 0){
        return profile;
    }

    const newEnergy =
    Math.min(
        MAX_ENERGY,
        profile.energy + regenSteps * ENERGY_REGEN_AMOUNT
    );

    const newLastUpdate =
    new Date(
        lastUpdate + regenSteps * ENERGY_REGEN_SECONDS * 1000
    ).toISOString();

    profile.energy = newEnergy;
    profile.last_energy_update = newLastUpdate;

    return profile;
}

async function syncEnergy(profile){

    const updatedProfile =
    calculateRegeneratedEnergy(profile);

    const { error } =
    await supabaseClient
    .from("game_profiles")
    .update({
        energy:updatedProfile.energy,
        last_energy_update:updatedProfile.last_energy_update
    })
    .eq("id", updatedProfile.id);

    if(error){
        console.error(error);
    }

    return updatedProfile;
}