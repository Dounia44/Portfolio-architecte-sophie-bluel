/* ---------------------------------------------------------
   Gestion de la fenêtre modale (ouverture, fermeture, contenu)
--------------------------------------------------------- */

// Sélection des éléments du DOM
const btnEdition = document.getElementById("btn-edition");
const modal = document.getElementById("modal");
const modalGallery = document.querySelector(".modal-gallery");
const btnClose = document.querySelector(".modal-close");

// -------------------- Ouverture de la modale --------------------
btnEdition.addEventListener("click", async () => {
	modal.classList.remove("hidden");                   // Affiche la modale (en retirant "hidden")
	modal.classList.add("active");                      // Ajoute la classe active pour afficher
	modal.setAttribute("aria-hidden", "false");        	// Accessibilité : indique que la modale est visible
	 try {
		// Récupère les images depuis l’API
        const works = await getWorks(); 	

		// Affiche les images dans la galerie de la modale
        afficherPhotos(works);
		addDeleteListeners();

    } catch (error) {
        console.error("Erreur lors du chargement des photos :", error);
    }
});

// -------------------- Fermeture avec la croix --------------------

btnClose.addEventListener("click", () => {
	modal.classList.add("hidden");               	// Cache la modale
	modal.classList.remove("active");             	// Supprime la classe "active"
	modal.setAttribute("aria-hidden", "true");		// Accessibilité : indique que la modale est cachée
});


// -------------------- Fermeture au clic sur le backdrop --------------------
modal.addEventListener("click", (e) => {
	if (e.target === modal) {           		// Vérifie si le clic est sur l’arrière-plan (et pas à l’intérieur)
		modal.classList.add("hidden");
		modal.classList.remove("active");
		modal.setAttribute("aria-hidden", "true");
	}
});


/* ---------------------------------------------------------
   Gestion de l'affichage des photos dans la galerie
--------------------------------------------------------- */

// Import de la fonction API (récupération des œuvres depuis le serveur)
import {getWorks } from "./api.js";		

function afficherPhotos(photos) {
	modalGallery.replaceChildren();		// vide la galerie avant de remplir

		photos.forEach(photo => {
			// Création du conteneur figure
			const figure = document.createElement("figure");
			figure.dataset.id = photo.id;

			// Création et configuration de l'image
			const img = document.createElement("img");
			img.src = photo.imageUrl;
			img.alt = photo.title;
			img.classList.add("photo-modal-gallery")

			// Création du bouton "Supprimer"
			const btnDelete = document.createElement("button");
			btnDelete.classList.add("btn-delete");
			btnDelete.setAttribute("aria-label", "Supprimer la photo");
			// Icône trash dans le bouton
			const icone = document.createElement("img");
			icone.src = "./assets/icons/trash.svg";  
			icone.alt = "Supprimer";

			// Assemble les éléments
			btnDelete.appendChild(icone);
			figure.appendChild(img);
			figure.appendChild(btnDelete);
			modalGallery.appendChild(figure);
	});
}

// ------Clic sur "Ajouter une photo" : bascule de la galerie vers le formulaire-----*/

// Sélection des éléments du DOM 
const btnAdd = document.querySelector(".btn.add-photo");
const modalGalleryView = document.querySelector(".modal-gallery-view");
const modalForm  = document.querySelector(".modal-form");
const btnBack = document.querySelector(".modal-back");
const modalTitle = document.getElementById("titlemodal")

// Gestion du clic sur le bouton "Ajouter une photo"
btnAdd.addEventListener("click", () => {
	modalGalleryView.classList.add("hidden");           // cache la galerie
	modalForm.classList.remove("hidden");              // affiche le formulaire
	btnBack.classList.remove("hidden");					// Rend le bouton Retour visible

	modalTitle.textContent = "Ajout photo"; // CHANGE le titre pour le formulaire
});

// ------Clic sur "Retour" : bascule du formulaire vers la galerie----------*/

// Écoute du clic sur le bouton Retour
btnBack.addEventListener("click", () => {
	modalForm.classList.add("hidden");			  		//cacher le formulaire
	modalGalleryView.classList.remove("hidden");		//afficher la galerie
	btnBack.classList.add("hidden");					// Cache le bouton Retour

	modalTitle.textContent = "Galerie photo"; 
});

// ------Clic sur "btn-delete" : supprime un projet ----------*/
import { deleteProjectAPI } from "./api.js";

// Ajout des écouteurs pour supprimer
function addDeleteListeners() {
    const btnsDelete = document.querySelectorAll(".btn-delete"); // Tous les boutons

    btnsDelete.forEach(btn => {
        btn.addEventListener("click", () => {
            const figure = btn.closest("figure");     // Récupère la figure correspondante
            const id = figure.dataset.id;             // Récupère l'id du projet
            const token = localStorage.getItem("token");          // Remplace par ton token réel
            deleteProject(id, figure, token);         // Supprime le projet
        });
    });
}

// Suppression projet API + DOM
async function deleteProject(id, figure, token) {
    try {
        const ok = await deleteProjectAPI(id, token);  // Appel API DELETE

        if (ok) {
            figure.remove();  // Supprime l'élément du DOM si réussi

			// Supprime aussi dans la galerie principale
            const mainFigure = document.querySelector(`.gallery figure[data-id="${id}"]`);
            if(mainFigure) mainFigure.remove();

        } else {
            alert("La suppression a échoué côté serveur.");
        }

    } catch (error) {
        console.error("Erreur réseau :", error);
        alert("Impossible de contacter le serveur.");
    }
}

