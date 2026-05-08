const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

/* STATIC FILES */

app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "Index.html"));
});

app.get("/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "Dashboard.html"));
});

/* MONGODB CONNECTION */

mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log("MongoDB Connected");
})
.catch((err) => {
  console.log(err);
});

/* SCHEMA */

const UserSchema = new mongoose.Schema({

  mobile: String,
  name: String,
  fname: String,
  address: String,
  alt: String,
  email: String,
  id: String

});

const User = mongoose.model("users", UserSchema);

/* SEARCH API */

app.get("/search", async (req, res) => {

  try {

    const q = req.query.q;

    const data = await User.find({

      $or: [

        { mobile: { $regex: q, $options: "i" } },
        { name: { $regex: q, $options: "i" } },
        { email: { $regex: q, $options: "i" } }

      ]

    }).limit(50);

    res.json(data);

  } catch (error) {

    console.log(error);

    res.status(500).send("Server Error");

  }

});

/* SERVER */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

  console.log(`Server Running On Port ${PORT}`);

});