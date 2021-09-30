const mongoose = require("mongoose");
require("dotenv").config({path: "variables.env"});
 
const conectarDB = async () => {
  try {
    await mongoose.connect( process.env.DB_MONGO);
    console.log("Data Base connected");

  } catch (error) {
    console.log(error)
   process.exit(1) //detener la app
  };
};

module.exports = conectarDB;