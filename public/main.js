// Intercepter le soumission du formulaire d'ajout
document.getElementById('addForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const formData = {
        nom: document.getElementById('nom').value,
        profession: document.getElementById('profession').value,
        age: parseInt(document.getElementById('age').value),
        cheveux: document.getElementById('cheveux').value,
        yeux: document.getElementById('yeux').value,
        corpulence: {
            hauteur: parseInt(document.getElementById('hauteur').value),
            poids: parseInt(document.getElementById('poids').value)
        }
    };

    // Envoyer les données au serveur
    fetch('/data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        // Afficher un message de confirmation ou effectuer une autre action si nécessaire
        console.log('Document ajouté avec succès:', data);
    })
    .catch(error => console.error('Erreur lors de l\'ajout du document:', error));
});

// Fonction pour récupérer les données depuis le serveur et les afficher dans des balises p
function fetchData() {
    fetch('/data')
    .then(response => response.json())
    .then(data => {
        const dataElement = document.getElementById('data');
        dataElement.innerHTML = ''; // Nettoyer le contenu précédent
        data.forEach(entry => {
            const entryElement = document.createElement('div');
            // Exclure l'ID de l'affichage
            const { _id, ...entryWithoutId } = entry;
            for (const [key, value] of Object.entries(entryWithoutId)) {
                if (typeof value === 'object') {
                    // Si la valeur est un objet, afficher chaque propriété de l'objet
                    for (const [subKey, subValue] of Object.entries(value)) {
                        const propertyElement = document.createElement('p');
                        propertyElement.textContent = `${subKey}: ${subValue}`;
                        entryElement.appendChild(propertyElement);
                    }
                } else {
                    // Si la valeur n'est pas un objet, afficher directement la propriété et sa valeur
                    const propertyElement = document.createElement('p');
                    propertyElement.textContent = `${key}: ${value}`;
                    entryElement.appendChild(propertyElement);
                }
            }

            // Ajouter un bouton supprimer
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Supprimer';
            deleteButton.addEventListener('click', () => {
                deleteEntry(entry._id, entryElement); // Passer l'élément de l'interface utilisateur à la fonction deleteEntry
            });
            
            entryElement.appendChild(deleteButton);

            dataElement.appendChild(entryElement);
        });
    })
    .catch(error => console.error('Erreur lors de la récupération des données:', error));
}


// Appeler la fonction fetchData pour charger les données lors du chargement de la page
window.addEventListener('load', fetchData);

// Fonction pour supprimer une entrée
function deleteEntry(id, entryElement) {
    console.log('ID du document à supprimer :', id); // Ajout d'un log pour vérifier l'ID du document à supprimer
    fetch(`/data/${id}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (response.ok) {
            console.log('Document supprimé avec succès');
            entryElement.remove(); // Supprimer l'élément de l'interface utilisateur après la suppression réussie
        } else {
            throw new Error('Erreur lors de la suppression du document');
        }
    })
    .catch(error => console.error(error.message));
}
