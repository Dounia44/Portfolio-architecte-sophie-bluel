/* ---------------------------------------------------------
   Gestion de la fenêtre modale (ouverture, fermeture, contenu)
--------------------------------------------------------- */

// Sélection des éléments du DOM
const btnEdition = document.getElementById("btn-edition");
const modal = document.getElementById("modal");
const modalGallery = document.querySelector(".modal-gallery");
const btnClose = document.querySelector(".modal-close");


/* -------- Fonction utilitaire pour réinitialiser la preview -------- */
function resetPreview() {
	imagePreview.src = ""; 						// vide la preview
	imagePreview.classList.add("hidden"); 		// cache l'image
	uploadInfo.classList.remove("hidden"); 		// réaffiche le texte
	fileInput.value = ""; 						// reset aussi l’input file
}

// -------------------- Ouverture de la modale --------------------
btnEdition.addEventListener("click", async () => {
	modal.classList.remove("hidden");                   // Affiche la modale (en retirant "hidden")
	modal.classList.add("active");                      // Ajoute la classe active pour afficher
	modal.setAttribute("aria-hidden", "false");        	// Accessibilité : indique que la modale est visible

		// Réinitialiser la preview quand on ouvre la modale
	resetPreview();

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
	btnEdition.focus();
	modal.classList.add("hidden");               	// Cache la modale
	modal.classList.remove("active");             	// Supprime la classe "active"
	modal.setAttribute("aria-hidden", "true");		// Accessibilité : indique que la modale est cachée
});


// -------------------- Fermeture au clic sur le backdrop --------------------
modal.addEventListener("click", (e) => {
	if (e.target === modal) {           		// Vérifie si le clic est sur l’arrière-plan (et pas à l’intérieur)
		btnEdition.focus();
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

// sélectionner les éléments dont on aura besoin
const uploadForm = document.querySelector(".upload-form");	// le formulaire complet
const fileInput = document.querySelector("#image");			// l’input file
const titleInput = document.querySelector("#title");		// champ titre
const categorySelect = document.querySelector("#category");		 // select catégorie
const imagePreview = document.querySelector(".image-preview");
const uploadInfo = document.querySelector(".upload-info");


fileInput.addEventListener("change", (e) => {	//On écoute quand l'utilisateur sélectionne un fichier
	 // 2️ Récupère le premier fichier choisi (s'il y en a)
	const file = fileInput.files[0];	 
	 // 3️ Si aucun fichier n'est sélectionné, on quitte
    if (!file) {
        // Cas où l'utilisateur annule la sélection
		resetPreview();
        return;                                    // on quitte le listener
    };

    // 4️ Crée une URL temporaire pour afficher l'image dans le navigateur
    const imageURL = URL.createObjectURL(file);

    // 5️ Remplace la source de l'image preview par ce fichier
    imagePreview.src = imageURL;

    // 6️ Affiche l'image preview si elle était cachée (par exemple via la classe "hidden")
    imagePreview.classList.remove("hidden");

    // 7️ Optionnel : cache le texte/icone d'instructions
	uploadInfo.classList.add("hidden");
});
