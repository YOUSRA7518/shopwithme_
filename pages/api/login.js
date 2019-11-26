import connectDb from "../../utils/connectDb";
import User from "../../models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

connectDb();

export default async (req, res) => {
  const { email, password } = req.body;
  try {
    // 1) vérifier si un utilisateur existe avec le courrier électronique fourni
    const user = await User.findOne({ email }).select("+password");
    // 2) sinon, retourne l'erreur
    if (!user) {
      return res.status(404).send("Aucun utilisateur n'existe avec cet email");
    }
    // 3) vérifier si le mot de passe des utilisateurs correspond à celui de la base de données
    const passwordsMatch = await bcrypt.compare(password, user.password);
    // 4) si oui, générer un token
    if (passwordsMatch) {
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d"
      });
      // 5) envoyer ce token au client
      res.status(200).json(token);
    } else {
      res.status(401).send("Les mots de passe ne correspondent pas");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Erreur de connexion de l'utilisateur");
  }
};
