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

app.get("/", (req, res) => {
  res.send("Health coatch server is running");
});

app.listen(port, () => {
  console.log(`Healthcoach app listening on port: ${port}`);
});
