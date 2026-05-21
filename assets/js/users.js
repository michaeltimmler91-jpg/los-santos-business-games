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
        energy:100
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

    setCurrentUser(user);

    return {
        success:true,
        user:user
    };
}

function updateCurrentUser(updatedUser){
    const users = getUsers();

    const index = users.findIndex(user => {
        return user.id === updatedUser.id;
    });

    if(index !== -1){
        users[index] = updatedUser;
        saveUsers(users);
        setCurrentUser(updatedUser);
    }
}

