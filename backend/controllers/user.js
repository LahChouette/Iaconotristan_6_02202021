/*************************************/
/*** Import des module nécessaires **/

const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');


/***********************************/
//** Création d'un utilisateur ***//

exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, parseInt(process.env.BCRYPT_SALT_ROUND))
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash
            });
            user.save()
                .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};

/************************************************/
//**** Se connecter a un compte utilisateur ***//

exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({ error: 'Utilisateur non trouvé !' });
            }

            // Vérification du mot de passe //
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error: 'Mot de passe incorrect !' });
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign({ userId: user._id },
                            process.env.JWT_SECRET, { expiresIn: process.env.JWT_DURING }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};