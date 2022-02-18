const express = require('express')
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const app = express()
const ObjectId = require('mongodb').ObjectId;

const port = process.env.PORT || 5000;

//middleware

app.use(cors());
app.use(express.json()); 

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xqlz2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
         try{
                  await client.connect();
                  const database = client.db('tourx');
                  const tourCollection = database.collection('packages');
                  const reviewCollection = database.collection('reviews');
                  const orderCollection = database.collection('myOrders');
                  const blogCollection = database.collection('blog')
                  const destinationCollection = database.collection('destination')
                  const reviewsCollection = database.collection('userReviews');

                  //get all data
                  app.get('/packages', async(req, res) =>{
                    const result = await tourCollection.find({}).toArray();
                    res.send(result);
                  });
                  //get all blog
                  app.get('/blog', async(req, res) =>{
                    const result = await blogCollection.find({}).toArray();
                    res.send(result);
                  });
                  //get review data
                  app.get('/review', async(req, res) =>{
                    const result = await reviewCollection.find({}).toArray();
                    res.send(result);
                  });
                  //get destination data
                  app.get('/destination', async(req, res) =>{
                    const result = await destinationCollection.find({}).toArray();
                    res.send(result);
                  });

                  //Add a new service
                  app.post('/addPackage', async(req, res) =>{
                     const addPackage = await tourCollection.insertOne(req.body);
                     res.send(addPackage);
                  });
                  
                  //Add orders
                  app.post('/myOrder', async(req, res) =>{
                    const orders = await orderCollection.insertOne(req.body);
                    res.send(orders);
                  });

                  //get myOrder
                  app.get('/orders/:email', async(req, res) =>{
                    const result = await orderCollection.find({email: req.params.email}).toArray();
                    res.send(result);
                  })
                  //get All
                  app.get('/myOrder', async(req, res) =>{
                    const result = await orderCollection.find({}).toArray();
                    res.send(result);
                  })

                // delete myOder
                app.delete('/ordersInfo/:id', async(req, res) =>{
                  const deleteOrder = await orderCollection.deleteOne({_id: (req.params.id)})
                  res.send(deleteOrder)
                })
                // addUserReview Sections
                 app.get('/userReviews', async(req, res) =>{
                const result = await reviewsCollection.find({}).toArray();
                res.json(result);
                  });
                // add review on data base 
                app.post('/userReviews', async(req, res)=>{
                const user = req.body;
                const result = await reviewsCollection.insertOne(user);
                res.json(result);
                });

                  
         }
         finally{
                  // await client.close(); 
         }
}

run().catch(console.dir)

app.get('/', (req, res) => {
  res.send('TourX servering in runing in browser')
})

app.listen(port, () => {
  console.log('TourX server runing at port', port);
})