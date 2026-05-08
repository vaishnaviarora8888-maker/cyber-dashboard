const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

/* =========================
   MONGODB CONNECTION
========================= */

mongoose.connect("mongodb://127.0.0.1:27017/userdata")
.then(() => {
    console.log("✅ MongoDB Connected Successfully");
})
.catch((err) => {
    console.log("❌ MongoDB Connection Error:", err);
});

/* =========================
   USER SCHEMA
========================= */

const userSchema = new mongoose.Schema({
    oid: String,
    mobile: String,
    name: String,
    fname: String,
    address: String,
    alt: String,
    circle: String,
    id: String,
    email: String
});

/* =========================
   COLLECTION NAME
========================= */

const User = mongoose.model("User", userSchema, "users");

/* =========================
   SEARCH API
========================= */

app.get("/search", async (req, res) => {

    const q = (req.query.q || "").trim();

    try {

        const data = await User.find({
            $or: [
                { mobile: { $regex: q, $options: "i" } },
                { name: { $regex: q, $options: "i" } },
                { fname: { $regex: q, $options: "i" } },
                { address: { $regex: q, $options: "i" } },
                { alt: { $regex: q, $options: "i" } },
                { email: { $regex: q, $options: "i" } },
                { id: { $regex: q, $options: "i" } },
                { circle: { $regex: q, $options: "i" } }
            ]
        }).limit(100);

        console.log("Search:", q);
        console.log("Results:", data.length);

        res.json(data);

    } catch (error) {

        console.log("❌ Search Error:", error);

        res.status(500).json({
            message: "Server Error"
        });

    }

});

/* =========================
   SERVER START
========================= */

app.listen(5000, () => {
    console.log("🚀 Server Running On Port 5000");
});