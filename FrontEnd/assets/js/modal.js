/* ---------------------------------------------------------
   Imports
--------------------------------------------------------- */
import { getWorks, getCategories, deleteProjectAPI, addProjectAPI } from "./api.js";

/* ---------------------------------------------------------
   Sélecteurs DOM globaux
--------------------------------------------------------- */
// Modale et boutons
const btnEdition = document.getElementById("btn-edition");
const modal = document.getElementById("modal");
const modalGallery = document.querySelector(".modal-gallery");
const btnClose = document.querySelector(".modal-close");
const btnAdd = document.querySelector(".btn.add-photo");
const modalGalleryView = document.querySelector(".modal-gallery-view");
const modalForm  = document.querySelector(".modal-form");
const btnBack = document.querySelector(".modal-back");
const modalTitle = document.getElementById("titlemodal")

// Formulaire d'ajout
const form = document.querySelector(".upload-form");	// le formulaire complet
const fileInput = document.querySelector("#image");			// l’input file
const titleInput = document.querySelector("#title");		// champ titre
const categorySelect = document.querySelector("#category");		 // select catégorie
const imagePreview = document.querySelector(".image-preview");
const uploadInfo = document.querySelector(".upload-info");

/* ---------------------------------------------------------
   Fonction utilitaire pour réinitialiser la preview
--------------------------------------------------------- */
function resetPreview() {
	imagePreview.src = ""; 						// vide la preview
	imagePreview.classList.add("hidden"); 		// cache l'image
	uploadInfo.classList.remove("hidden"); 		// réaffiche le texte
	fileInput.value = ""; 						// reset aussi l’input file
}

/* ---------------------------------------------------------
   Gestion ouverture/fermeture modale
--------------------------------------------------------- */
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

/* ---------------------------------------------------------
   Gestion formulaire "Ajouter une photo"
--------------------------------------------------------- */
btnAdd.addEventListener("click", () => {
	modalGalleryView.classList.add("hidden");           // cache la galerie
	modalForm.classList.remove("hidden");              // affiche le formulaire
	btnBack.classList.remove("hidden");					// Rend le bouton Retour visible
	modalTitle.textContent = "Ajout photo"; // CHANGE le titre pour le formulaire

	populateCategories();
});

btnBack.addEventListener("click", () => {
	modalForm.classList.add("hidden");			  		//cacher le formulaire
	modalGalleryView.classList.remove("hidden");		//afficher la galerie
	btnBack.classList.add("hidden");					// Cache le bouton Retour

	modalTitle.textContent = "Galerie photo"; 
});

/* ---------------------------------------------------------
   Remplir dynamiquement les catégories
--------------------------------------------------------- */
async function populateCategories() {
    categorySelect.replaceChildren();

    //On recrée l’option par défaut
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "";
    defaultOption.hidden = true;
    categorySelect.appendChild(defaultOption);

    try {
        // 3️ On récupère les catégories depuis l’API
        const categories = await getCategories();

        // 4️ On crée une option par catégorie
        categories.forEach(cat => {
            const option = document.createElement("option");
            option.value = cat.id;         // ID utilisé par l’API
            option.textContent = cat.name; // Nom affiché
            categorySelect.appendChild(option);
        });
    } catch (error) {
        console.error("Erreur lors du chargement des catégories :", error);
    }
}
	
/* ---------------------------------------------------------
   Gestion suppression projet
--------------------------------------------------------- */
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
            // Supprime l'élément de la galerie modale si réussi
            figure.remove();

			// Et supprime aussi dans la galerie principale
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
/* ---------------------------------------------------------
   Prévisualisation image
--------------------------------------------------------- */

fileInput.addEventListener("change", (e) => {	//On écoute quand l'utilisateur sélectionne un fichier
	 // 2️ Récupère le premier fichier choisi (s'il y en a)
	const file = fileInput.files[0];	 
	 // 3️ Si aucun fichier n'est sélectionné, on quitte
    if (!file)  return resetPreview();
        // dans le cas où l'utilisateur annule la sélection
        // on quitte le listener

    // 4️ Crée une URL temporaire pour afficher l'image dans le navigateur
    const imageURL = URL.createObjectURL(file);

    // 5️ Remplace la source de l'image preview par ce fichier
    imagePreview.src = imageURL;

    // 6️ Affiche l'image preview si elle était cachée (par exemple via la classe "hidden")
    imagePreview.classList.remove("hidden");

    // 7️ Optionnel : cache le texte/icone d'instructions
	uploadInfo.classList.add("hidden");
});
