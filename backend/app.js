/********************************************************/
//*********** Import des module nécessaires ***********//

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');


const routesSauces = require('./routes/sauces');
const routesUsers = require('./routes/users');



/********************************************************/
//********** Connexion à la base de données ***********//

mongoose.connect('mongodb+srv://' + process.env.DB_USER + ':' + process.env.DB_PASSWORD + '@cluster.rmctn.mongodb.net/' + process.env.DB_NAME + '?retryWrites=true&w=majority',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

/*********************************************************/
//********* Ajout des headers pour les requêtes *********/

const app = express();

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

/********************************************************/
//* Utiliser pour parse le corps des réponses en JSON **/

app.use(express.json());

/********************************************************/
//********************* Route **************************/


app.use('/api/sauces', routesSauces);
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/auth', routesUsers);

/********************************************************/
module.exports = app;