app.js
import { getCategories, getWorks } from "./api.js";

function affichageWorks(works) {
    const gallery = document.querySelector(".gallery");
    works.forEach((work) => {                           // Je fais une boucle sur le tableau works pour récupérer chaque travaux 1 par 1

    gallery.innerHTML += `
        <figure>
            <img src="${work.imageUrl}" alt="${work.title}">
            <figcaption>${work.title}</figcaption>
        </figure>
    `;
});
}
async function init() {
   const works = await getWorks();
   const categories = await getCategories();
   affichageWorks(works);
   console.log(works, categories);
}

init();