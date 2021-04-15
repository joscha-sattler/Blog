const express = require("express");
const multer = require("multer"); // um mit Image-Files arbeiten zu können

const postLogikController = require("../Logik/posts");

const pruefeAuth = require("../middleware/prüfe-auth");

const router = express.Router();

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg"
};

//------------------------------------------------------->

//verarbeitung von Files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {  //cbS für callback
    const isValid = MIME_TYPE_MAP[file.mimetype]; //null, wenn es kein jpg/png ist
    let error = new Error("Invalid mime type");
    if (isValid) {
      error = null;
    }
    cb(error, "backend/bilder");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(" ").join("-");
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + "-" + Date.now() + "." + ext);
  }
});

//--------------------------------------------------------------------------------->

// Einen Post erstellen

router.post("", pruefeAuth, multer({storage: storage}).single("image"), postLogikController.erstellePost );

// Alle Posts abrufen / erhalten

router.get("", postLogikController.bekommeAllePosts);

// Einen Post über Id finden

router.get("/:id", postLogikController.findeEinenPost);

// Einen Post bearbeiten

router.put("/:id", pruefeAuth,  multer({storage: storage}).single("image"), postLogikController.bearbeitePost );

// Einen Post über Id löschen

router.delete("/:id", pruefeAuth, postLogikController.loeschePost );


//------------------------------------------------------->

  module.exports = router;
