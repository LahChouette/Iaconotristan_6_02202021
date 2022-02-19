/***********************************/
/*** Import des module nécessaires */
const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth')
const multer = require('../middleware/multer-config');
const ctrlSauce = require('../controllers/sauce');

/**********************************/
/*** Routage de la ressource Sauce */
router.get('/', auth, ctrlSauce.getAllSauces);
router.get('/:id', auth, ctrlSauce.getSauce);
router.post('/', auth, multer, ctrlSauce.addSauce);
router.put('/:id', auth, multer, ctrlSauce.updateSauce);
router.delete('/:id', auth, ctrlSauce.deleteSauce);
router.post('/:id/like', auth, ctrlSauce.likeSauce);


module.exports = router;