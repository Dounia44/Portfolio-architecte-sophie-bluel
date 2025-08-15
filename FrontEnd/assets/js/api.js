// Appels au serveur (fetch, gestion des erreurs, ..)
export async function getWorks () {
    const response = await fetch("http://localhost:5678/api/works");
    return response.json();
}
export async function getCategories () {
    const response = await fetch("http://localhost:5678/api/categories");
    return response.json();
}