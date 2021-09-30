const mongoose = require("mongoose");
require("dotenv").config({path: "variables.env"});
 
const conectarDB = () => {
  // try {
  //   await mongoose.connect( process.env.DB_MONGO);
  //   console.log("Data Base connected");

  // } catch (error) {
  //   console.log(error)
  //   process.exit(1) //detener la app
  // };
  mongoose
     .connect( process.env.DB_MONGO)
     .then(() => console.log( 'Database Connected' ))
     .catch(err => console.log( err ));

};



module.exports = conectarDB;