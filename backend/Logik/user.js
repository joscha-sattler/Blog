const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");



// Benutzer registrieren ----------------------->

exports.registerBentzer = (req, res, next) => {
    bcrypt.hash(req.body.password, 10).then(hash => {  // damit das Passwort nicht unverschlüsselt gespeichert wird
        const user = new User({
            username: req.body.username,
            email: req.body.email,
            password: hash
    });
    user.save().then(result => {
        res.status(201).json({
            message: "Benutzer wurde angelegt",
            result: result
        });

    })
        .catch(err => {
            res.status(500).json({
               message: "Die E-Mail und/oder der Benutzername scheinen bereits vergeben, versuche es erneut!"
            });
        });
    });

 }

// Benutzer einloggen ----------------------->

exports.loginBenutzer =  (req, res, next) => {
    let speicherUser;
    User.findOne({username: req.body.username })
    .then(user => {
       if (!user) { // wenn kein user gefunden wurde, error
           return res.status(401).json({
               message: "Keine korrekten Eingaben, versuche es erneut!"
           });
       }
       speicherUser = user;
       return bcrypt.compare(req.body.password, user.password); //passwort ist verschlüsselt durch Hashcode, daher Hascode vergleichen
    })
    .then(result => {
       if (!result) {
           return res.status(401).json({
               message: "Authentifizierung ist fehlgeschlagen"
        });
       }
       // ein Token wird erstellt
       const token = jwt.sign({ username: speicherUser.username, userId: speicherUser._id }, 'einGeheimnisZuHabenIstImmerGut-HierIstMeinGeheimnis', {expiresIn: "1h"});
       res.status(200).json({
           message: "Erfolgreich authentifiziert!",
           token: token,
           expiresIn: 3600, //token läuft nach 1h aus, -> User wird ausgeloggt
           userId: speicherUser._id
       })
   })
    .catch(err => {
       return res.status(401).json({
           message: "Authentifizierung ist fehlgeschlagen"
    });
 });
}