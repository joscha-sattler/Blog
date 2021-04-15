const express = require("express");

const benutzerLogikController = require("../Logik/user");

const router = express.Router();

//------------------------------------------------------->

// User anlegen / registrieren

router.post("/signup", benutzerLogikController.registerBentzer);

 // User Authtentifizierung / einloggen

 router.post("/login", benutzerLogikController.loginBenutzer);



//------------------------------------------------------->


// exportieren
module.exports = router;
