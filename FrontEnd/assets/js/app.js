fetch("http://localhost:5678/api/works")        // On demande les données au serveur
    .then(function(response) {                  // Quand le serveur répond      =>    .then(response => response.json())
        return response.json();                 // On transforme la réponse en JSON                 
    })
    .then(function(data){                       // Quand le JSON est prêt       =>    .then(data => console.log(data))
        console.log(data);                      // On affiche les données
    })