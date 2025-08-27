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