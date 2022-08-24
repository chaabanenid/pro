const mongoose = require("mongoose");

const connString = "mongodb+srv://nidhalchaabane:nidoking1995@cluster0.2xro2j0.mongodb.net/?retryWrites=true&w=majority"

const connectDB = async () => {
  try {
    await mongoose.connect(connString, {
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    console.log("Mongodb connection SUCCESS ✅");
  } catch (error) {
    console.log("Mongodb connection FAIL ⚠️");
    console.log(error);
    process.exit(1);
  }
};

module.exports = connectDB;
