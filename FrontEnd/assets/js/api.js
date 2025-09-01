// api.js

// Appels au serveur (fetch, gestion des erreurs, ..)
export async function getWorks () {
    const response = await fetch("http://localhost:5678/api/works");
    return response.json();
}
export async function getCategories () {
    const response = await fetch("http://localhost:5678/api/categories");
    return response.json();
}

export async function deleteProjectAPI(id, token) {
    const response = await fetch(`http://localhost:5678/api/works/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.ok;
}

export async function addProjectAPI(data, token) {
    const response = await fetch("http://localhost:5678/api/works", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: data // FormData, pas besoin de préciser Content-Type
    });
    return await response.json(); // renvoie le projet ajouté
}