document.addEventListener("DOMContentLoaded", () => {
    const currentUser = getCurrentUser();

    if(currentUser){
        window.location.href = "pages/dashboard.html";
        return;
    }

    document
    .getElementById("loginBtn")
    .addEventListener("click", handleLogin);

    document
    .getElementById("registerBtn")
    .addEventListener("click", handleRegister);
});

function handleLogin(){
    const username = document.getElementById("usernameInput").value.trim();
    const password = document.getElementById("passwordInput").value.trim();

    if(!username || !password){
        showAuthMessage("Bitte Benutzername und Passwort eingeben.");
        return;
    }

    const result = loginUser(username, password);

    if(!result.success){
        showAuthMessage(result.message);
        return;
    }

    window.location.href = "pages/dashboard.html";
}

function handleRegister(){
    const username = document.getElementById("usernameInput").value.trim();
    const password = document.getElementById("passwordInput").value.trim();

    if(!username || !password){
        showAuthMessage("Bitte Benutzername und Passwort eingeben.");
        return;
    }

    const result = createUser(username, password);

    if(!result.success){
        showAuthMessage(result.message);
        return;
    }

    setCurrentUser(result.user);

    window.location.href = "pages/dashboard.html";
}

function showAuthMessage(text){
    document.getElementById("authMessage").innerText = text;
}

