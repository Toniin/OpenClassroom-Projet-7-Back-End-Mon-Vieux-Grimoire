const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const booksRoutes = require("./routes/books");
const path = require('path')

require("dotenv").config();
const PORT = process.env.PORT;
const app = express();
app.use(express.json());
app.use("/images", express.static(path.join(__dirname, 'images')));

mongoose
  .connect(process.env.MONGO_URL, { dbName: "DB-Mon_Vieux_Grimoire" })
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

// Permettre de résoudre les problèmes de CORS => Définir les origines auxquelles on répond
app.use((request, response, next) => {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  response.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  next();
});

app.use("/api/auth", authRoutes);
app.use("/api/books", booksRoutes);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
