import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import Cart from "../../models/Cart";
import connectDb from "../../utils/connectDb";

connectDb();

const { ObjectId } = mongoose.Types;

export default async (req, res) => {
  switch (req.method) {
    case "GET":
      await handleGetRequest(req, res);
      break;
    case "PUT":
      await handlePutRequest(req, res);
      break;
    case "DELETE":
      await handleDeleteRequest(req, res);
      break;
    default:
      res.status(405).send(`Method ${req.method} not allowed`);
      break;
  }
};

async function handleGetRequest(req, res) {
  if (!("authorization" in req.headers)) {
    return res.status(401).send("Pas de token autoriser");
  }
  try {
    const { userId } = jwt.verify(
      req.headers.authorization,
      process.env.JWT_SECRET
    );
    const cart = await Cart.findOne({ user: userId }).populate({
      path: "products.product",
      model: "Product"
    });
    res.status(200).json(cart.products);
  } catch (error) {
    console.error(error);
    return res.status(403).send("Veuillez vous reconnecter");
  }
}

async function handlePutRequest(req, res) {
  const { quantity, productId } = req.body;
  if (!("authorization" in req.headers)) {
    return res.status(401).send("Pas de token autoriser");
  }
  try {
    const { userId } = jwt.verify(
      req.headers.authorization,
      process.env.JWT_SECRET
    );
    // Obtenir le panier de l'utilisateur basé sur userId
    const cart = await Cart.findOne({ user: userId });
    // Vérifier si le produit existe déjà dans le panier
    const productExists = cart.products.some(doc =>
      ObjectId(productId).equals(doc.product)
    );
    // Si oui, incrémenter la quantité (par le nombre fourni à la demande)
    if (productExists) {
      await Cart.findOneAndUpdate(
        { _id: cart._id, "products.product": productId },
        { $inc: { "products.$.quantity": quantity } }
      );
    } else {
      // Si non, ajouter un nouveau produit avec la quantité donnée
      const newProduct = { quantity, product: productId };
      await Cart.findOneAndUpdate(
        { _id: cart._id },
        { $addToSet: { products: newProduct } }
      );
    }
    res.status(200).send("Mis à jour du panier");
  } catch (error) {
    console.error(error);
    return res.status(403).send("Veuillez vous reconnecter");
  }
}

async function handleDeleteRequest(req, res) {
  const { productId } = req.query;
  if (!("authorization" in req.headers)) {
    return res.status(401).send("Pas de token autoriser");
  }
  try {
    const { userId } = jwt.verify(
      req.headers.authorization,
      process.env.JWT_SECRET
    );
    const cart = await Cart.findOneAndUpdate(
      { user: userId },
      { $pull: { products: { product: productId } } },
      { new: true }
    ).populate({
      path: "products.product",
      model: "Product"
    });
    res.status(200).json(cart.products);
  } catch (error) {
    console.error(error);
    return res.status(403).send("Veuillez vous reconnecter");
  }
}
