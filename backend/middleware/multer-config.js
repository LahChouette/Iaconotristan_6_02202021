/*************************************/
/*** Import des module nécessaires **/
const multer = require('multer');


// Dictionnaire des different fichier d'image //
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

const storage = multer.diskStorage({
    // Destination des fichier dans le dossier images //
    destination: (req, file, callback) => {
        callback(null, 'images');
    },
    // Création d'un nom de fichier unique pour les image //
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + '.' + extension);
    }
});



module.exports = multer({ storage: storage }).single('image');