const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');

//------------------------------------------------------->

const postsRoutes = require("./routes/posts");
const userRoutes = require("./routes/user");

//------------------------------------------------------->

const app = express();

//------------------------------------------------------->

mongoose.connect("mongodb+srv://JSattler:zcx1znFUCEu1dOnA@cluster0-dkddt.mongodb.net/db-projekt?retryWrites=true&w=majority")
.then(() => {
  console.log('Mit Datenbank verbunden')
})
.catch(() => {
  console.log('Datenbankverbindung fehlgeschlagen!')
});


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));
app.use("/bilder", express.static(path.join("backend/bilder"))); 

// damit verschiedene Host interagieren können

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");

  next();
});



//------------------------------------------------------->

app.use("/api/posts", postsRoutes);
app.use("/api/user", userRoutes);


module.exports = app;


// zcx1znFUCEu1dOnA  -> MongoDB Passwort