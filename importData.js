const { MongoClient } = require("mongodb");
const fs = require("fs");
require("dotenv").config();

const uri = process.env.MONGO_URI;

async function importData() {
  try {
    const client = new MongoClient(uri);
    await client.connect();

    console.log("MongoDB Connected");

    const db = client.db("userdata");
    const collection = db.collection("users");

    const filePath = "C:/Users/vaish/Downloads/mongodb_50000_users.json";

    const data = JSON.parse(fs.readFileSync(filePath, "utf8"));

    await collection.deleteMany({});
    console.log("Old data deleted");

    const chunkSize = 1000;

    for (let i = 0; i < data.length; i += chunkSize) {
      const chunk = data.slice(i, i + chunkSize);

      await collection.insertMany(chunk);

      console.log(`Inserted ${i + chunk.length} records`);
    }

    console.log("All data imported successfully");

    await client.close();

  } catch (error) {
    console.log("Import Error:", error);
  }
}

importData();