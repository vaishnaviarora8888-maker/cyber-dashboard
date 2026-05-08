const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();

/* =========================
   MIDDLEWARE
========================= */

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

/* =========================
   ROUTES
========================= */

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "Index.html"));
});

app.get("/index.html", (req, res) => {
  res.sendFile(path.join(__dirname, "Index.html"));
});

app.get("/Index.html", (req, res) => {
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

/* =========================
   MONGODB CONNECTION
========================= */

mongoose.connect(process.env.MONGO_URI)

.then(() => {

  console.log("MongoDB Connected");

})

.catch((err) => {

  console.log("MongoDB Error:", err);

});

/* =========================
   SCHEMA
========================= */

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

/* =========================
   SEARCH API
========================= */

app.get("/search", async (req, res) => {

  try {

    const q = String(req.query.q || "").trim();

    if (!q) {

      return res.json([]);

    }

    const data = await User.aggregate([

      {

        $addFields: {

          mobileText: {

            $toString: {

              $ifNull: ["$mobile", ""]

            }

          },

          altText: {

            $toString: {

              $ifNull: ["$alt", ""]

            }

          },

          idText: {

            $toString: {

              $ifNull: ["$id", ""]

            }

          },

          nameText: {

            $toString: {

              $ifNull: ["$name", ""]

            }

          },

          fnameText: {

            $toString: {

              $ifNull: ["$fname", ""]

            }

          },

          addressText: {

            $toString: {

              $ifNull: ["$address", ""]

            }

          },

          emailText: {

            $toString: {

              $ifNull: ["$email", ""]

            }

          }

        }

      },

      {

        $match: {

          $or: [

            {

              mobileText: {

                $regex: q,
                $options: "i"

              }

            },

            {

              altText: {

                $regex: q,
                $options: "i"

              }

            },

            {

              idText: {

                $regex: q,
                $options: "i"

              }

            },

            {

              nameText: {

                $regex: q,
                $options: "i"

              }

            },

            {

              fnameText: {

                $regex: q,
                $options: "i"

              }

            },

            {

              addressText: {

                $regex: q,
                $options: "i"

              }

            },

            {

              emailText: {

                $regex: q,
                $options: "i"

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

    res.status(500).json({

      error: "Server Error",
      message: error.message

    });

  }

});

/* =========================
   SERVER
========================= */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

  console.log(`Server Running On Port ${PORT}`);

});