const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
require("dotenv").config();

// middleware
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;

const uri = process.env.DB_URL;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function dbConnect() {
  try {
    await client.connect();
    console.log("Database Connected Successfully");
  } catch (error) {
    console.log(error.name, error.message);
  }
}

dbConnect();

const Service = client.db("healthcoach").collection("services");
const Review = client.db("healthcoach").collection("reviews");

// all services

app.get("/services", async (req, res) => {
  try {
    const cursor = Service.find({});
    const services = await cursor.toArray();

    res.send({
      success: true,
      message: "Successfully get the Data",
      data: services,
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

app.post("/services", async (req, res) => {
  try {
    const services = req.body;
    const service = await Service.insertOne(services);
    res.send({
      success: true,
      message: "Successfully Review",
      data: service,
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

// single Service

app.get("/service/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const query = { _id: ObjectId(id) };
    const service = await Service.findOne(query);
    res.send({
      success: true,
      message: "Successfully get the data",
      data: service,
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});
// review get all data
app.get("/reviews", async (req, res) => {
  try {
    let query = {};
    if (req.query.email) {
      query = {
        email: req.query.email,
      };
    }
    const cursor = Review.find(query);
    const reviews = await cursor.toArray();

    res.send({
      success: true,
      message: "Successfully get the Data",
      data: reviews,
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

// Reviews create
app.post("/reviews", async (req, res) => {
  try {
    const reviews = req.body;
    const review = await Review.insertOne(reviews);
    res.send({
      success: true,
      message: "Successfully Review",
      data: review,
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

app.get("/", (req, res) => {
  res.send("Health coatch server is running");
});

app.listen(port, () => {
  console.log(`Healthcoach app listening on port: ${port}`);
});
