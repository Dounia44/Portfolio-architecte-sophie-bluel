//Ecouter l'événement global submit du formulaire 
const form = document.querySelector("form");    //Je selectionne le formulaire dans la page login.html
const monEmail = document.getElementById("email");         //j'identifie les champs input
const monPassword = document.getElementById("password");    //j'identifie les champs password
const divError = document.querySelector(".error"); // Sélection une seule fois

form.addEventListener("submit", async (event) => {    //Écoute du submit
    event.preventDefault();                     //Bloque le chargement automatique 
    divError.textContent = ""; // Reset du message d’erreur

//on récupère ce que l'utilisateur a tapé
    const emailValue = monEmail.value;      
    const passwordValue = monPassword.value;

    try {
        // 2.Envoyer la requête POST avec fetch() :
        const response = await fetch("http://localhost:5678/api/users/login", {
            method: "POST",                          // méthode HTTP : POST
            headers: {
                "content-type": "application/json"   // indique qu'on envoie du JSON
            },
            body: JSON.stringify({                  // conversion objet JS en JSON
                email: emailValue,
                password: passwordValue
            })
        });
        // 3. Vérifier que la réponse est correcte 
        if (! response.ok) {
           if (response.status === 401 || response.status === 404) {
                divError.textContent = "Email ou mot de passe incorrect.";
            } else {
                divError.textContent = "Erreur lors de la connexion. Veuillez réessayer.";
            }
            return; // stoppe ici, pas besoin de throw
        }

        // 4. Lire la réponse JSON de l'API 
        const data = await response.json();      // on attend la réponse convertie en JSON

        // Stocker le token
        localStorage.setItem("token", data.token);

        // Rediriger vers la page d'accueil
        window.location.href = "./index.html";

        // 5. Gérer les erreurs réseau ou de traitement :
    } catch (error) {
        console.error("Erreur :", error);
        divError.textContent = "Erreur réseau. Veuillez réessayer.";
    }
});