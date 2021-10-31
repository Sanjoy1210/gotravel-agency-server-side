// require express, cors, mongoClient, dotenv
const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;

// create express app
const app = express();

// server running on port
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// mongodb connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wirgo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
  try {
    // connect to the client
    await client.connect();

    // create database
    const database = client.db('go_travel_agency');

    // create collection
    const planCollection = database.collection('plans');
    const reviewCollection = database.collection('reviews');
    const bookingCollection = database.collection('booking');

    // POST API for plans
    app.post('/addplans', async (req, res) => {
      const plan = req.body;
      const result = await planCollection.insertOne(plan);
      res.json(result);
    });

    // GET API to get plans
    app.get('/plans', async (req, res) => {
      const cursor = planCollection.find({});
      const result = await cursor.toArray();
      res.send(result);
    });

    // get single plan
    app.get('/plan/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };

      const result = await planCollection.findOne(query);
      res.send(result);
    });

    // Get reviews
    app.get('/reviews', async (req, res) => {
      const cursor = reviewCollection.find({});
      const result = await cursor.toArray();
      res.send(result);
    });

    // Post Booking
    app.post('/booking', async (req, res) => {
      const data = req.body;
      const result = await bookingCollection.insertOne(data);
      res.json(result);
    });

    // get all booking
    app.get('/allbooking', async (req, res) => {
      const cursor = bookingCollection.find({});
      const result = await cursor.toArray();
      res.send(result);
    });

    // delete booking
    app.delete('/allbooking/:id', async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: ObjectId(id) };
      const result = await bookingCollection.deleteOne(query);
      res.json(result);
    });

    // update api
    app.put('/booking/:id', async (req, res) => {
      const id = req.params.id;
      const options = { upsert: true };
      const filter = { _id: ObjectId(id) };
      const booking = req.body;

      const updateDoc = {
        $set: {
          status: booking.status,
        },
      };

      const result = await bookingCollection.updateOne(filter, updateDoc, options);
      console.log(result);
      res.json(result);
    });
  }
  finally {
    // await client.close();
  }
}

run().catch(console.dir);

// default route/api
app.get('/', (req, res) => {
  res.send('Go travel server is running');
});

// app listen port
app.listen(port, () => {
  console.log('Running server on port', port);
});