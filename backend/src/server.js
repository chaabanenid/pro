require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const bodyParser = require("body-parser");
const corsOptions = {
  Credential: "true",
};
const app = express();
const authRouter = require("./api/routes/authRouter");
const userRouter = require("./api/routes/userRouter");
const awsRouter = require("./api/routes/userRouter");
const reclamationRouter = require("./api/routes/reclamationRouter");
connectDB();
app.use(bodyParser.json());
app.use(express.json());
app.options("*", cors(corsOptions));
app.use("/users", express.static("users"));
app.use(cors(corsOptions));
app.use(cookieParser());
//Routes
app.get("/", (req, res) => {
  res.send("Kandle Backend Working Fine!");
});
app.use("/api", awsRouter);
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/reclamation", reclamationRouter);

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    success: false,
    message: err.message,
  });
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log("Listening on on ", port);
});
