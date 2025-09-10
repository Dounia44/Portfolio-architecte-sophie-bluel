import { getCategories, getWorks } from "./api.js";

//Affichage des projets :
function affichageWorks(works) {
    const gallery = document.querySelector(".gallery");
    gallery.replaceChildren();                                     

    works.forEach((work) => {                                       
    const figure = document.createElement("figure");               
    figure.dataset.id = work.id;

    const img = document.createElement("img");                      
    img.src = work.imageUrl;
    img.alt = work.title;
    const caption = document.createElement("figcaption");
    caption.textContent = work.title;
    
    figure.appendChild(img);
    figure.appendChild(caption);
    gallery.appendChild(figure);
    });
}

//Filtrage des projets :
function affichageFilter(categories, works) {
    const filtresContainer = document.querySelector(".filters");
    
    // Nettoyer le container des boutons précédemment créés restent affichés
    filtresContainer.replaceChildren();

    // Ajouter le bouton "Tous"
    const btnTous = document.createElement("button");                 
    btnTous.textContent = "Tous";
    btnTous.classList.add("filter", "active");
    filtresContainer.appendChild(btnTous);
    
    // Ajouter les autres filtres   
    categories.forEach((category) => {
        const btn = document.createElement("button");
        btn.textContent = category.name;
        btn.classList.add("filter");
        filtresContainer.appendChild(btn);
    });

    // Écouteurs de clic sur tous les boutons
    const buttons = filtresContainer.querySelectorAll("button");       
    buttons.forEach((btn) => {
            btn.addEventListener("click", () => {
                // Retirer la classe "active" de tous les boutons
                buttons.forEach(button =>button.classList.remove("active"));
                btn.classList.add("active");

                // Filtrer les travaux
                if (btn.textContent === "Tous") {
                    affichageWorks(works);
                } else {
                    const filteredWorks = works.filter(work => work.category.name === btn.textContent);
                    affichageWorks(filteredWorks);
                }
            } )
    })
}
async function init() {
    let works = [];
    let categories = [];

    try {
        // throw new Error("Test d'erreur");
        works = await getWorks();
    } catch (error) {
        console.error("Erreur lors du chargement des projets :", error);
        alert("Impossible de charger les projets. Vérifiez votre connexion.");
    }

    try {
        // throw new Error("Test d'erreur");
        categories = await getCategories();
    } catch (error) {
        console.error("Erreur lors du chargement des catégories :", error);

        // Vérifie si on est en mode invité (pas de token)
        const token = localStorage.getItem("token");
        if (!token) {
        alert("Impossible de charger les catégories. Vérifiez votre connexion.");
        }
    }
    
    // Si on a récupéré au moins les works, on peut afficher
    if (works.length > 0) {
        affichageWorks(works);
    }

    // Si on a aussi les catégories, on active les filtres
    if (categories.length > 0 && works.length > 0) {
        affichageFilter(categories, works);
    }
}

init();