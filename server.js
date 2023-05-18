const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const booksRoutes = require("./routes/books");

require("dotenv").config();
const app = express();
const PORT = process.env.PORT;

mongoose
  .connect(process.env.MONGO_URL, { dbName: "DB-Mon_Vieux_Grimoire" })
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

// Permettre de résoudre les problèmes de CORS => Définir les origines auxquelles on répond
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  next();
});

app.use("/api/auth", authRoutes);
app.use("/api/books", booksRoutes);

// Pour utiliser toutes les données d'un dossier
app.use(express.static("../frontend/public/data"));

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

// MULTER
// Pour upload des fichiers vers le front

// BCRYPT
// Pour hasher le mdp

// MONGODB - MONGOOSE
// Base de donnée - Permet de faire des modèles d'objets

// JWT
// Le serveur transmet un TOKEN avec une signature,
// grâce à la signature, le serveur permet de reconnaître 
// si le TOKEN transmit par l'utilisateur est un TOKEN 
// fourni par le serveur
