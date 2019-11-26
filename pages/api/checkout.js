import Stripe from "stripe";
import uuidv4 from "uuid/v4";
import jwt from "jsonwebtoken";
import Cart from "../../models/Cart";
import Order from "../../models/Order";
import calculateCartTotal from "../../utils/calculateCartTotal";

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

export default async (req, res) => {
  const { paymentData } = req.body;
  try {
    //1) Vérifier et obtenir l'ID utilisateur du token
    const { userId } = jwt.verify(
      req.headers.authorization,
      process.env.JWT_SECRET
    );
    //2) Trouver le panier en fonction de l'ID utilisateur
    const cart = await Cart.findOne({ user: userId }).populate({
      path: "products.product",
      model: "Product"
    });
    //3) Calculer à nouveau les totaux du panier à partir des produits du panier
    const { cartTotal, stripeTotal } = calculateCartTotal(cart.products);
    //4) Obtenir des e-mails à partir des données de paiement, voir si un e-mail est lié à un client existant
    const prevCustomer = await stripe.customers.list({
      email: paymentData.email,
      limit: 1
    });
    const isExistingCustomer = prevCustomer.data.length > 0;
    //5) Si client non existant, créez-les en fonction de leur email
    let newCustomer;
    if (!isExistingCustomer) {
      newCustomer = await stripe.customers.create({
        email: paymentData.email,
        source: paymentData.id
      });
    }
    const customer =
      (isExistingCustomer && prevCustomer.data[0].id) || newCustomer.id;
    //6) Créer des frais avec le total, envoyer un email de confirmation
    const charge = await stripe.charges.create(
      {
        currency: "usd",
        amount: stripeTotal,
        receipt_email: paymentData.email,
        customer,
        description: `Checkout | ${paymentData.email} | ${paymentData.id}`
      },
      {
        idempotency_key: uuidv4()
      }
    );
    //7) Ajouter des données de commande à la base de données
    await new Order({
      user: userId,
      email: paymentData.email,
      total: cartTotal,
      products: cart.products
    }).save();
    //8) Effacer les produits dans le panier
    await Cart.findOneAndUpdate({ _id: cart._id }, { $set: { products: [] } });
    //9) Réponse de retour de succès (200)
    res.status(200).send("Commander réussi");
  } catch (error) {
    console.error(error);
    res.status(500).send("Erreur de traitement des frais");
  }
};
