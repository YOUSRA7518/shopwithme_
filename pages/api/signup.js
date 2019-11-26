import connectDb from "../../utils/connectDb";
import User from "../../models/User";
import Cart from "../../models/Cart";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import isEmail from "validator/lib/isEmail";
import isLength from "validator/lib/isLength";

connectDb();

export default async (req, res) => {
  const { name, email, password } = req.body;
  try {
    // 1) Valider nom / email / mot de passe
    if (!isLength(name, { min: 3, max: 10 })) {
      return res
        .status(422)
        .send("Le nom doit comporter entre 3 et 10 caractères.");
    } else if (!isLength(password, { min: 6 })) {
      return res
        .status(422)
        .send("Le mot de passe doit être au moins de 6 caractères");
    } else if (!isEmail(email)) {
      return res.status(422).send("L'email doit être valide");
    }
    // 2) Vérifier si l'utilisateur existe déjà dans la base de données
    const user = await User.findOne({ email });
    if (user) {
      return res
        .status(422)
        .send(`L'utilisateur existe déjà avec email ${email}`);
    }
    // 3) si non, crypter leur mot de passe
    const hash = await bcrypt.hash(password, 10);
    // 4) Créer un utilisateur
    const newUser = await new User({
      name,
      email,
      password: hash
    }).save();
    console.log({ newUser });
    // 5) créer un panier pour un nouvel utilisateur
    await new Cart({ user: newUser._id }).save();
    // 6) créer un token pour le nouvel utilisateur
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d"
    });
    // 7) renvoyer le  token
    res.status(201).json(token);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send(
        "Erreur lors de l'inscription de l'utilisateur. Veuillez réessayer plus tard"
      );
  }
};
