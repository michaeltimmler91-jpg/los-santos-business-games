function getUsers(){
    return loadData("users") || [];
}

function saveUsers(users){
    saveData("users", users);
}

function getCurrentUser(){
    return loadData("currentUser");
}

function setCurrentUser(user){
    saveData("currentUser", user);
}

function logoutUser(){
    localStorage.removeItem("currentUser");
    window.location.href = "../index.html";
}

function createUser(username, password){
    const users = getUsers();

    const exists = users.some(user => {
        return user.username.toLowerCase() === username.toLowerCase();
    });

    if(exists){
        return {
            success:false,
            message:"Dieser Benutzername existiert bereits."
        };
    }

    const newUser = {
        id:"user_" + Date.now(),
        username:username,
        password:password,
        teamId:null,
        role:"user",
        energy:GAME_CONFIG.maxEnergy,
        lastEnergyUpdate:Date.now()
    };

    users.push(newUser);
    saveUsers(users);

    return {
        success:true,
        user:newUser
    };
}

function loginUser(username, password){
    const users = getUsers();

    const user = users.find(user => {
        return user.username === username && user.password === password;
    });

    if(!user){
        return {
            success:false,
            message:"Benutzername oder Passwort falsch."
        };
    }

    if(typeof user.energy !== "number"){
        user.energy = GAME_CONFIG.maxEnergy;
    }

    if(!user.lastEnergyUpdate){
        user.lastEnergyUpdate = Date.now();
    }

    const updatedUser = regenerateEnergy(user);

    setCurrentUser(updatedUser);
    updateUserInList(updatedUser);

    return {
        success:true,
        user:updatedUser
    };
}

function updateCurrentUser(updatedUser){
    updateUserInList(updatedUser);
    setCurrentUser(updatedUser);
}

function updateUserInList(updatedUser){
    const users = getUsers();

    const index = users.findIndex(user => {
        return user.id === updatedUser.id;
    });

    if(index !== -1){
        users[index] = updatedUser;
        saveUsers(users);
    }
}

function regenerateEnergy(user){
    const now = Date.now();

    if(!user.lastEnergyUpdate){
        user.lastEnergyUpdate = now;
    }

    const secondsPassed =
        Math.floor((now - user.lastEnergyUpdate) / 1000);

    const regenSteps =
        Math.floor(secondsPassed / GAME_CONFIG.energyRegenSeconds);

    if(regenSteps <= 0){
        return user;
    }

    const energyToAdd =
        regenSteps * GAME_CONFIG.energyRegenAmount;

    user.energy = Math.min(
        GAME_CONFIG.maxEnergy,
        user.energy + energyToAdd
    );

    user.lastEnergyUpdate =
        user.lastEnergyUpdate +
        regenSteps *
        GAME_CONFIG.energyRegenSeconds *
        1000;

    return user;
}
