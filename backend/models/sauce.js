/********************************************************/
//*********** Import des module nécessaires ***********//

const mongoose = require('mongoose');

/********************************************************/
//******************* Schéma sauce ********************//

const SchemaSauce = mongoose.Schema({
    userId: { type: String, required: true },
    name: { type: String, required: true },
    manufacturer: { type: String, required: true },
    description: { type: String, required: true },
    mainPepper: { type: String, required: true },
    imageUrl: { type: String, required: true },
    heat: { type: Number, required: true },
    likes: { type: Number, required: true },
    dislikes: { type: Number, required: true },
    usersLiked: { type: ["String <userId>"], required: true },
    usersDisliked: { type: ["String <userId>"], required: true },
});

/*******************************************/
/********** Export du modéle  *************/
module.exports = mongoose.model('Sauce', SchemaSauce);