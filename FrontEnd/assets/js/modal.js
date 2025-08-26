/*Ouverture de la modal au clique sur Modifier */
const btnEdition = document.getElementById("btn-edition");
const modal = document.getElementById("modal");

// **Sélection du conteneur de la galerie dans la modale**
const modalGallery = document.querySelector(".modal-gallery");

btnEdition.addEventListener("click", async () => {
	modal.classList.remove("hidden");                   // je retire la classe hidden
	modal.classList.add("active");                      // j'ajoute la classe active pour afficher
	modal.setAttribute("aria-hidden", "false");         // accessibilité

	 try {
        const works = await getWorks(); 			// récupère les médias via api.js
        afficherPhotos(works);           			// injecte les images dans la modale
    } catch (error) {
        console.error("Erreur lors du chargement des photos :", error);
    }
});

// Fermeture au clic sur la croix
const btnClose = document.querySelector(".modal-close");

btnClose.addEventListener("click", () => {
	modal.classList.add("hidden");               // je  remet hidden
	modal.classList.remove("active");            // je retire active
	modal.setAttribute("aria-hidden", "true");
});

// Fermeture au clic en dehors de la modale (sur le backdrop)
modal.addEventListener("click", (e) => {
	if (e.target === modal) {           		// si le clic est sur le backdrop
		modal.classList.add("hidden");
		modal.classList.remove("active");
		modal.setAttribute("aria-hidden", "true");
	}
});

/*Affichage galerie*/ 
// Import des fonctions API
import { getCategories, getWorks } from "./api.js";		// getWorks récupère toutes les œuvres depuis le serveur

function afficherPhotos(photos) {
	modalGallery.replaceChildren();				// vide la galerie avant de remplir

		photos.forEach(photo => {
			const figure = document.createElement("figure");

			const img = document.createElement("img");
			img.src = photo.imageUrl;
			img.alt = photo.title;
			img.classList.add("photo-modal-gallery")

			const btnDelete = document.createElement("button");
			btnDelete.classList.add("btn-delete");
			btnDelete.setAttribute("aria-label", "Supprimer la photo");

			const icone = document.createElement("img");
			icone.src = "./assets/icons/trash.svg";  
			icone.alt = "Supprimer";

			btnDelete.appendChild(icone);

			figure.appendChild(img);
			figure.appendChild(btnDelete);
			modalGallery.appendChild(figure);
	});
}