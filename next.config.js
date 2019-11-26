// doit redémarrer le serveur chaque fois que vous apportez des modifications dans next.config
module.exports = {
  env: {
    MONGO_SRV:
      "mongodb+srv://ShopWithMe:2904Yousra@shopwithme-3owhm.mongodb.net/test?retryWrites=true&w=majority",
    JWT_SECRET: "2904Yousra",
    CLOUDINARY_URL: "https://api.cloudinary.com/v1_1/shopwithme/image/upload",
    STRIPE_SECRET_KEY: "sk_test_kBVNTpWaqFmZ2LE8HJvgAW2300pvlQJxD8"
  }
};
