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
const fileInput = document.querySelector("#image");
const titleInput = document.querySelector("#title");
const categorySelect = document.querySelector("#category");
const imagePreview = document.querySelector(".image-preview");
const uploadInfo = document.querySelector(".upload-info");
const fileErrorMsg = document.querySelector(".file-error-msg");

// Bouton Valider
const submitButton = document.querySelector(".btn.upload");
submitButton.disabled = true;

/* ---------------------------------------------------------
   Fonction utilitaire pour réinitialiser la preview
--------------------------------------------------------- */
function resetPreview() {
	imagePreview.src = "";
	imagePreview.classList.add("hidden");
	uploadInfo.classList.remove("hidden");
	fileInput.value = "";
}

/* ---------------------------------------------------------
   Fonction utilitaire pour fermer la modale
--------------------------------------------------------- */
function closeModal() {
    modal.classList.add("hidden");
    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
    btnEdition.focus();
}

/* ---------------------------------------------------------
   Fonction utilitaire pour fermer la modale et tout reset
--------------------------------------------------------- */
function closeModalWithReset() {
    // Ferme la modale
    modal.classList.add("hidden");
    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
    btnEdition.focus();

    // Réinitialise le formulaire
    resetPreview();             // vide l'image preview
    titleInput.value = "";      // reset titre
    categorySelect.value = "";  // reset catégorie
    checkFormValidity();        // update le bouton Valider
}

/* ---------------------------------------------------------
   Vérifie si tous les champs sont remplis pour activer le bouton
--------------------------------------------------------- */
function checkFormValidity() {
    const file = fileInput.files[0];
    let fileValid = false;

    if (file) {
        const allowedTypes = ["image/jpeg", "image/png"];
        const maxSize = 4 * 1024 * 1024; // 4 Mo

        if (!allowedTypes.includes(file.type)) {
            fileErrorMsg.textContent = "Le fichier doit être au format JPEG ou PNG.";
            fileErrorMsg.classList.remove("hidden");
        } else if (file.size > maxSize) {
            fileErrorMsg.textContent = "Le fichier ne doit pas dépasser 4 Mo.";
            fileErrorMsg.classList.remove("hidden");
        } else {
            fileErrorMsg.textContent = "";
            fileErrorMsg.classList.add("hidden");
            fileValid = true;
        }
    }

    const titleFilled = titleInput.value.trim() !== "";
    const categorySelected = categorySelect.value !== "";

    // Active/désactive le bouton Valider
    submitButton.disabled = !(fileValid && titleFilled && categorySelected);
}

/* ---------------------------------------------------------
   Gestion ouverture/fermeture modale
--------------------------------------------------------- */
btnEdition.addEventListener("click", async () => {
	modal.classList.remove("hidden");
	modal.classList.add("active");
	modal.setAttribute("aria-hidden", "false");
	 try {
		// Récupère les images depuis l’API
        // throw new Error("Test d'erreur");
        const works = await getWorks(); 	
		// Affiche les images dans la galerie de la modale
        afficherPhotos(works);
		addDeleteListeners();
    } catch (error) {
        console.error("Erreur lors du chargement des photos :", error);
        alert("Impossible de charger les projets. Vérifiez votre connexion.");
    }
});

// -------------------- Fermeture avec la croix --------------------

btnClose.addEventListener("click", closeModalWithReset);

// -------------------- Fermeture au clic sur le backdrop --------------------
modal.addEventListener("click", (e) => {
	if (e.target === modal) closeModal();         		
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

	modalGalleryView.classList.add("hidden");
	modalForm.classList.remove("hidden");
	btnBack.classList.remove("hidden");
	modalTitle.textContent = "Ajout photo";

	populateCategories();
});

btnBack.addEventListener("click", () => {
	modalForm.classList.add("hidden");
	modalGalleryView.classList.remove("hidden");
	btnBack.classList.add("hidden");

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
        //throw new Error("Test d'erreur");

        //On récupère les catégories depuis l’API
        const categories = await getCategories();
        //On crée une option par catégorie
        categories.forEach(cat => {
            const option = document.createElement("option");
            option.value = cat.id;         
            option.textContent = cat.name;
            categorySelect.appendChild(option);
        });
    } catch (error) {
        console.error("Erreur lors du chargement des catégories :", error);
        alert("Impossible de charger les catégories. Vérifiez votre connexion.");
    }
    checkFormValidity();
}
	
/* ---------------------------------------------------------
   Gestion suppression projet
--------------------------------------------------------- */
function addDeleteListeners() {
    const btnsDelete = document.querySelectorAll(".btn-delete");
    btnsDelete.forEach(btn => {
        btn.addEventListener("click", () => {
            const figure = btn.closest("figure");
            const id = figure.dataset.id;
            const token = localStorage.getItem("token");
            deleteProject(id, figure, token);
        });
    });
}

// Suppression projet API + DOM
async function deleteProject(id, figure, token) {
    try {
        // throw new Error("Test d'erreur");
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
fileInput.addEventListener("change", (e) => {
	const file = fileInput.files[0];	 
    if (!file) {
        resetPreview();
        fileErrorMsg.classList.add("hidden");
        checkFormValidity();
        return;
        }
    const imageURL = URL.createObjectURL(file);
    imagePreview.src = imageURL;
    imagePreview.classList.remove("hidden");
	uploadInfo.classList.add("hidden");

    checkFormValidity(); // <-- vérifie validité à chaque changement
});

/* ---------------------------------------------------------
   Saisie du titre et choix de la catégorie
--------------------------------------------------------- */

// Vérifier validité du formulaire à chaque saisie du titre
titleInput.addEventListener("input", checkFormValidity);

// Vérifie la validité à chaque changement de catégorie
categorySelect.addEventListener("change", checkFormValidity);

/* ---------------------------------------------------------
   Validation du formulaire
--------------------------------------------------------- */

export function addAddProjectListeners() {
    const formAdd = document.getElementById("form-add");
    if (!formAdd) return;
    formAdd.addEventListener("submit", async (e) => {
        e.preventDefault();
        const data = new FormData(formAdd);
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("Utilisateur non connecté !");
            return;
        }
        await addProjectToGalleries(data, token);
        formAdd.reset();
        resetPreview();
    });
}

/* ---------------------------------------------------------
   Envoi à l’API et mise à jour des galeries
--------------------------------------------------------- */
async function addProjectToGalleries(data, token) {
   let newProject;
    try {
        // throw new Error("Test d'erreur");
        newProject = await addProjectAPI(data, token);
    } catch (error) {
        console.error("Erreur lors de l'ajout du projet :", error);
        alert("Impossible d'ajouter le projet. Vérifiez votre connexion.");
        return;
    }
    if (!newProject) {
        console.error("Erreur lors de l'ajout du projet");
        return;
    }

    // Galerie principale
    const gallery = document.querySelector(".gallery");

    const figureMain = document.createElement("figure");
    figureMain.dataset.id = newProject.id;

    const imgMain = document.createElement("img");

    imgMain.src = newProject.imageUrl;
    imgMain.alt = newProject.title;

    const captionMain = document.createElement("figcaption");
    captionMain.textContent = newProject.title;

    figureMain.appendChild(imgMain);
    figureMain.appendChild(captionMain);
    gallery.appendChild(figureMain);

    // Galerie modale
    const figureModal = document.createElement("figure");
    figureModal.dataset.id = newProject.id; 
    const imgModal = document.createElement("img");
    imgModal.src = newProject.imageUrl;
    imgModal.alt = newProject.title;
    imgModal.classList.add("photo-modal-gallery")

    // Création du bouton "Supprimer"
    const btnDelete = document.createElement("button");
    btnDelete.classList.add("btn-delete");
    btnDelete.setAttribute("aria-label", "Supprimer la photo");

    // Icône trash dans le bouton
    const icone = document.createElement("img");
    icone.src = "./assets/icons/trash.svg";  
    icone.alt = "Supprimer";

    btnDelete.appendChild(icone);
    figureModal.appendChild(imgModal);
    figureModal.appendChild(btnDelete);
    modalGallery.appendChild(figureModal);

    addDeleteListeners();
    closeModal();                      
    checkFormValidity();                
}
/* ---------------------------------------------------------
   Initialisation
--------------------------------------------------------- */
addAddProjectListeners();