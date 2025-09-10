// Vérifier si un token existe
const token = localStorage.getItem("token");

// Si connecté → afficher la barre édition et changer login en logout
if (token) {

    // Afficher la barre "Mode édition"
    const barreEdition = document.getElementById("barre-edition");
    const navLogin = document.querySelector(".nav-login");
    const navLogout = document.querySelector(".nav-logout");
    const filters = document.querySelector(".filters");
    const btnEdition = document.getElementById("btn-edition");

    barreEdition.classList.remove("hidden");
    navLogin.classList.add("hidden");
    navLogout.classList.remove("hidden");
    filters.classList.add("hidden");
    btnEdition.classList.remove("hidden");

    navLogout.addEventListener("click", (event) => {
        event.preventDefault();
        localStorage.removeItem("token");
        navLogin.classList.remove("hidden");
        navLogout.classList.add("hidden");
        filters.classList.remove("hidden");
        btnEdition.classList.add("hidden");
        barreEdition.classList.add("hidden");
    });
}






