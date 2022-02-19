/***********************************/
/*** Import des module nécessaires */

const express = require('express');
const router = express.Router();

const ctrlUser = require('../controllers/user');

/**********************************/
/*** Routage de la ressource User */

router.post('/signup', ctrlUser.signup);
router.post('/login', ctrlUser.login);

module.exports = router;