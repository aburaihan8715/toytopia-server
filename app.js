const express = require("express");
require("dotenv").config();
const app = express();
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

// middleware
app.use(cors());
app.use(express.json());

// connection string
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster1.eujox13.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// database connection function
const run = async () => {
  try {
    const toyTopiaDb = client.db("toyTopiaDb");
    const toyCollection = toyTopiaDb.collection("toys");

    /*===================================
    toys api
    ====================================*/
    //  post toys
    app.post("/toys", async (req, res) => {
      const postedData = req.body;
      const result = await toyCollection.insertOne(postedData);
      console.log(result);
      res.send(result);
    });
    // get all toys
    app.get("/toys", async (req, res) => {
      const query = {};
      const cursor = toyCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    // get specific toys
    app.get("/toys/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await toyCollection.findOne(query);
      res.send(result);
    });

    // delete toys
    app.delete("/toys/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await toyCollection.deleteOne(query);
      res.send(result);
    });

    // update toys
    app.put("/toys/:id", async (req, res) => {
      res.json({ message: "coming....." });
    });
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close()
  }
};
// call the database connection function
run().catch((err) => {
  console.log(err.message);
});

// home route
app.get("/", async (req, res) => {
  res.json({ message: "Hello from home route!" });
});

// route not found error
app.use((req, res, next) => {
  res.json({ message: "Ops route not found!" });
});
// server error
app.use((err, req, res, next) => {
  res.json({ message: "Ops something went wrong!" });
});

module.exports = app;
