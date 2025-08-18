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

async function init() {
    const works = await getWorks();
    const categories = await getCategories();
    affichageWorks(works);
    console.log(works, categories);
}

init(); 