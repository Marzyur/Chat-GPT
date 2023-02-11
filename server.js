const express = require('express');
const connectDB = require('./database/db');
const bodyParser = require('body-parser');
const app = express();
require('dotenv').config()

app.use(express.json({ limit: "100mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "100mb" }));

app.use(
  express.urlencoded({ extended: true })
);

const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
app.use("/api/user", userRoutes)
app.use("/api/chat", chatRoutes)
connectDB();

const port  = process.env.PORT || 4000;

app.listen(port , function(){
    console.log("Server Started");
});