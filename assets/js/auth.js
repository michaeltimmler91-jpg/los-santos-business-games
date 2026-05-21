async function registerUser(username, password){

    const fakeEmail =
        username.toLowerCase() + "@game.local";

    const { data, error } =
    await supabaseClient.auth.signUp({
        email:fakeEmail,
        password:password
    });

    if(error){
        return {
            success:false,
            message:error.message
        };
    }

    const userId = data.user.id;

    const { error:profileError } =
    await supabaseClient
    .from("game_profiles")
    .insert({
        id:userId,
        username:username,
        active:false,
        is_blocked:false,
        role:"user",
        energy:100
    });

    if(profileError){
        return {
            success:false,
            message:profileError.message
        };
    }
    await supabaseClient.auth.signOut();
    return {
        success:true,
        message:"Account erstellt. Bitte warte auf Admin-Freischaltung."
    };
}

async function loginUser(username, password){

    const fakeEmail =
        username.toLowerCase() + "@game.local";

    const { data, error } =
    await supabaseClient.auth.signInWithPassword({
        email:fakeEmail,
        password:password
    });

    if(error){
        return {
            success:false,
            message:"Login fehlgeschlagen."
        };
    }

    const userId = data.user.id;

    const { data:profile, error:profileError } =
    await supabaseClient
    .from("game_profiles")
    .select("*")
    .eq("id", userId)
    .single();

    if(profileError){
        return {
            success:false,
            message:"Profil konnte nicht geladen werden."
        };
    }

    if(profile.is_blocked){
        await supabaseClient.auth.signOut();

        return {
            success:false,
            message:"Dieser Account wurde gesperrt."
        };
    }

    if(!profile.active){
        await supabaseClient.auth.signOut();

        return {
            success:false,
            message:"Dein Account wartet noch auf Admin-Freischaltung."
        };
    }

    return {
        success:true,
        profile:profile
    };
}

async function logoutUser(){
    await supabaseClient.auth.signOut();
    window.location.href = "../index.html";
}

async function getCurrentProfile(){

    const { data:sessionData } =
    await supabaseClient.auth.getSession();

    if(!sessionData.session){
        return null;
    }

    const userId =
    sessionData.session.user.id;

    const { data:profile, error } =
    await supabaseClient
    .from("game_profiles")
    .select("*")
    .eq("id", userId)
    .single();

    if(error){
        return null;
    }

    return profile;
}
