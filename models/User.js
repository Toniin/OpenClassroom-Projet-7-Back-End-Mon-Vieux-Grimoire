const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true }, // - adresse e-mail de l’utilisateur [unique]
  password: { type: String, required: true }, // - mot de passe haché de l’utilisateur
});

userSchema.plugin(uniqueValidator); // - Affiche une erreur plus parlante que E11000 => Erreur: E-mail doit être unique

module.exports = mongoose.model("User", userSchema);
