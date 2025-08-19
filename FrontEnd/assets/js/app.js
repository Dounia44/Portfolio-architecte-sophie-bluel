import { getCategories, getWorks } from "./api.js";

function affichageWorks(works) {
    const gallery = document.querySelector(".gallery");
    gallery.replaceChildren();                                      //  Je vide la galerie en supprimant tous les enfants

    works.forEach((work) => {                                       //  Je fais une boucle sur le tableau works pour récupérer chaque travaux 1 par 1
    const figure = document.createElement("figure");                //  je crée un élément "figure"
    const img = document.createElement("img");                      //  je crée un élément "img"
    img.src = work.imageUrl;                                        //  je définit l'URL de l'image
    img.alt = work.title;                                           //  je définit le texte alternatif de l'image
    const caption = document.createElement("figcaption");           //  je crée un élément "figcaption" caption.textContent = work.title;
    caption.textContent = work.title;
    
    figure.appendChild(img);                                        // Ajoute (img) dans <figure>
    figure.appendChild(caption);                                    // Ajoute (caption) dans <figure>                                
    gallery.appendChild(figure);                                    // Ajoute le <figure> complet dans la galerie
    });
}

function affichageFilter(categories, works) {
    const filtresContainer = document.querySelector(".filters");
    
    // Nettoyer le container (pour éviter d’avoir le bouton "Modèle" affiché en plus)
    filtresContainer.replaceChildren();

    // Ajouter le bouton "Tous"
    const btnTous = document.createElement("button");                 // Crée une **copie complète** (true = avec tous les enfants et attributs) du bouton modèle templateButton et la stocke dans la variable btnTous.
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
    const buttons = filtresContainer.querySelectorAll("button");       // Sélectionne tous les boutons à l'intérieur du conteneur de filtres
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
    const works = await getWorks();
    const categories = await getCategories();

    affichageFilter(categories, works);
    affichageWorks(works);
    console.log(works, categories);
}

init();