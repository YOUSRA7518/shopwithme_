import mongoose from "mongoose";
const connection = {};

async function connectDb() {
  if (connection.isConnected) {
    // Utiliser la connexion à la base de données existanten
    console.log("Utiliser la connexion existante");
    return;
  }

  let mongoUrl;

  if (process.env.ENV === "production") {
    mongoUrl = process.env.MONGO_LAB;
  } else {
    mongoUrl = process.env.MONGO_SRV;
  }

  // Utiliser une nouvelle connexion à la base de données
  const db = await mongoose.connect(mongoUrl, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  console.log("DB Connected");
  connection.isConnected = db.connections[0].readyState;
}

export default connectDb;
