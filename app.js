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

/* ROUTES */

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "Index.html"));
});

app.get("/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "Dashboard.html"));
});

app.get("/dashboard.html", (req, res) => {
  res.sendFile(path.join(__dirname, "Dashboard.html"));
});

app.get("/Dashboard.html", (req, res) => {
  res.sendFile(path.join(__dirname, "Dashboard.html"));
});

app.get("/index.html", (req, res) => {
  res.sendFile(path.join(__dirname, "Index.html"));
});

app.get("/Index.html", (req, res) => {
  res.sendFile(path.join(__dirname, "Index.html"));
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

  mobile: mongoose.Schema.Types.Mixed,
  name: String,
  fname: String,
  address: String,
  alt: mongoose.Schema.Types.Mixed,
  email: String,
  id: mongoose.Schema.Types.Mixed

});

const User = mongoose.model("users", UserSchema);

/* SEARCH API */

app.get("/search", async (req, res) => {

  try {

    const q = String(req.query.q || "").trim();

    if (!q) {

      return res.json([]);

    }

    const data = await User.aggregate([

      {

        $match: {

          $or: [

            {

              name: {

                $regex: q,
                $options: "i"

              }

            },

            {

              fname: {

                $regex: q,
                $options: "i"

              }

            },

            {

              address: {

                $regex: q,
                $options: "i"

              }

            },

            {

              email: {

                $regex: q,
                $options: "i"

              }

            },

            {

              $expr: {

                $regexMatch: {

                  input: {

                    $toString: "$mobile"

                  },

                  regex: q,
                  options: "i"

                }

              }

            },

            {

              $expr: {

                $regexMatch: {

                  input: {

                    $toString: "$alt"

                  },

                  regex: q,
                  options: "i"

                }

              }

            },

            {

              $expr: {

                $regexMatch: {

                  input: {

                    $toString: "$id"

                  },

                  regex: q,
                  options: "i"

                }

              }

            }

          ]

        }

      },

      {

        $limit: 50

      }

    ]);

    res.json(data);

  } catch (error) {

    console.log("SEARCH ERROR:", error);

    res.status(500).send("Server Error");

  }

});

/* SERVER */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

  console.log(`Server Running On Port ${PORT}`);

});