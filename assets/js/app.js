document.addEventListener("DOMContentLoaded", () => {

    document
    .getElementById("loginBtn")
    .addEventListener("click", handleLogin);

    document
    .getElementById("registerBtn")
    .addEventListener("click", handleRegister);
});

async function handleLogin(){

    const username =
    document.getElementById("usernameInput").value.trim();

    const password =
    document.getElementById("passwordInput").value.trim();

    if(!username || !password){
        showAuthMessage("Bitte Benutzername und Passwort eingeben.");
        return;
    }

    showAuthMessage("Login wird geprüft...");

    const result =
    await loginUser(username, password);

    if(!result.success){
        showAuthMessage(result.message);
        return;
    }

    window.location.href =
    "pages/dashboard.html";
}

async function handleRegister(){

    const username =
    document.getElementById("usernameInput").value.trim();

    const password =
    document.getElementById("passwordInput").value.trim();

    if(!username || !password){
        showAuthMessage("Bitte Benutzername und Passwort eingeben.");
        return;
    }

    showAuthMessage("Account wird erstellt...");

    const result =
    await registerUser(username, password);

    showAuthMessage(result.message);
}

function showAuthMessage(text){
    document.getElementById("authMessage").innerText = text;
}
