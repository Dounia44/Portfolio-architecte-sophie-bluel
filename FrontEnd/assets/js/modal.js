/**Ouverture de la modal au clique sur Modifier */
const btnEdition = document.getElementById("btn-edition");
const modal = document.getElementById("modal");


btnEdition.addEventListener("click", () => {
	modal.classList.remove("hidden");                   // je retire la classe hidden
	modal.classList.add("active");                      // j'ajoute la classe active pour afficher
	modal.setAttribute("aria-hidden", "false");         // accessibilité
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
	if (e.target === modal) {           // si le clic est sur le backdrop
		modal.classList.add("hidden");
		modal.classList.remove("active");
		modal.setAttribute("aria-hidden", "true");
	}
});