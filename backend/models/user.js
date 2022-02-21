/********************************************************/
//*********** Import des module nécessaires ***********//

const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

/********************************************************/
//******************* Schéma user *********************//
const SchemaUser = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});


//******* Plugin 'mongoose-unique-validator' pour garantir que email est unique *******//

SchemaUser.plugin(uniqueValidator);

/*******************************************/
/********** export du modéle  *************/
module.exports = mongoose.model('User', SchemaUser);