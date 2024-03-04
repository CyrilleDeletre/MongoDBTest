const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const path = require('path');

const app = express();
const port = 3000;

const url = 'mongodb+srv://admin:admin@testmongodbafcibdd.twrcoz8.mongodb.net/';
const client = new MongoClient(url);

// Connexion à MongoDB
async function connectToMongoDB() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}

// Middleware pour analyser le corps de la requête en JSON
app.use(express.json());

// Configuration pour servir des fichiers statiques
app.use(express.static(path.join(__dirname, 'public')));

// Routes pour les opérations CRUD

// Lire tous les documents
app.get('/data', async (req, res) => {
    const database = client.db('testDB');
    const collection = database.collection('testCollection');

    try {
        const documents = await collection.find({}).toArray();
        res.json(documents);
    } catch (error) {
        console.error('Error fetching documents from MongoDB:', error);
        res.status(500).send('Internal Server Error');
    }
});


// Ajouter un document
app.post('/data', async (req, res) => {
    const database = client.db('testDB');
    const collection = database.collection('testCollection');

    try {
        const result = await collection.insertOne(req.body);
        res.json(result.ops);
    } catch (error) {
        console.error('Error adding document to MongoDB:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Mettre à jour un document
app.put('/data/:id', async (req, res) => {
    const database = client.db('testDB');
    const collection = database.collection('testCollection');

    try {
        const result = await collection.updateOne(
            { _id: new ObjectId(req.params.id) },
            { $set: req.body }
        );
        res.json(result);
    } catch (error) {
        console.error('Error updating document in MongoDB:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Supprimer un document
app.delete('/data/:id', async (req, res) => {
    const database = client.db('testDB');
    const collection = database.collection('testCollection');

    try {
        const result = await collection.deleteOne({ _id: new ObjectId(req.params.id) });
        if (result.deletedCount === 1) {
            res.json({ message: 'Document supprimé avec succès' });
        } else {
            res.status(404).json({ message: 'Document non trouvé' });
        }
    } catch (error) {
        console.error('Error deleting document from MongoDB:', error);
        res.status(500).send('Internal Server Error');
    }
});


// Servir le fichier HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Middleware pour gérer les erreurs 404
app.use((req, res, next) => {
    res.status(404).send("Page not found");
});

// Lancement du serveur
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});

// Connexion à MongoDB au démarrage du serveur
connectToMongoDB();
