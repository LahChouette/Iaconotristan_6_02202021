/***********************************/
/*** Import des module nécessaires */
const Sauce = require('../models/sauce');
const fs = require('fs');


/**************************************/
/*** Routage de la ressource Sauce */

// Création d'une sauce par un utilisateur //
exports.addSauce = (req, res) => {
    const sauceObject = JSON.parse(req.body.sauce);
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: []
    });
    sauce.save()
        .then(() => res.status(201).json({ message: 'Sauce enregistrée !' }))
        .catch(error => res.status(400).json({ error }));
};

// Renvoi toutes les sauces présente dans la DB //
exports.getAllSauces = (req, res) => {
    Sauce.find()
        .then(sauces => {
            res.status(200).json(sauces);
        })
        .catch(error => {
            res.status(404).json({ error })
        });
};

// Récupération de la Sauce dans la DB selon l'ID de la sauce //
exports.getSauce = (req, res) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            res.status(200).json(sauce);
        })
        .catch(error => res.status(404).json({ error }));
};

// Modification de la sauce //
exports.updateSauce = (req, res) => {

    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body }

    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
        .then(res.status(200).json({ message: "Sauce modifiée" }))
        .catch((error) => res.status(400).json({ error }))
};

// Suppression d'une sauce //
exports.deleteSauce = (req, res) => {
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {

            // Extrait nom du fichier a supprimer //
            const fileName = sauce.imageUrl.split('/images/')[1];
            // supprime avec fs.unlink //
            fs.unlink(`images/${fileName}`, () => {
                // Une fois supprimer de fs on le supprime de la DB //
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: "La sauce a été supprimée !" }))
                    .catch((error) => res.status(400).json({ error }));
            });

        })
        .catch((error) => res.status(400).json({ error }))
};

// gestion des likes //

exports.likeSauce = (req, res) => {

    // si like=1 on incrémente l'attribut likes de la sauce et on ajoute l'id de l'utilisateur dans le tableau usersLiked //
    if (req.body.like === 1) {
        Sauce.updateOne({ _id: req.params.id }, { $inc: { likes: req.body.like++ }, $push: { usersLiked: req.body.userId } })
            .then(() => res.status(200).json({ message: 'Like ajouté !' }))
            .catch(error => res.status(400).json({ error }))
    }

    //si like=-1 on incrémente l'attribut dislikes de la sauce et on ajoute l'id de l'utilisateur dans le tableau usersDisliked
    else if (req.body.like === -1) {
        Sauce.updateOne({ _id: req.params.id }, { $inc: { dislikes: (req.body.like++) * -1 }, $push: { usersDisliked: req.body.userId } })
            .then(() => res.status(200).json({ message: 'Dislike ajouté !' }))
            .catch(error => res.status(400).json({ error }))
    }
    // Récupération de la Sauce dans la DB selon l'ID de la sauce //
    else {
        Sauce.findOne({ _id: req.params.id })
            .then(sauce => {

                //décrémente l'attribut likes de la sauce et supprime l'userId du tableau usersLiked
                if (sauce.usersLiked.includes(req.body.userId)) {
                    Sauce.updateOne({ _id: req.params.id }, { $pull: { usersLiked: req.body.userId }, $inc: { likes: -1 } })
                        .then(() => { res.status(200).json({ message: 'Like supprimé !' }) })
                        .catch(error => res.status(400).json({ error }))
                }
                //décrémente l'attribut dislikes de la sauce et supprime l'userId du tableau usersDisliked
                else if (sauce.usersDisliked.includes(req.body.userId)) {
                    Sauce.updateOne({ _id: req.params.id }, { $pull: { usersDisliked: req.body.userId }, $inc: { dislikes: -1 } })
                        .then(() => { res.status(200).json({ message: 'Dislike supprimé !' }) })
                        .catch(error => res.status(400).json({ error }))
                }
            })
            .catch(error => res.status(400).json({ error }))
    }
}