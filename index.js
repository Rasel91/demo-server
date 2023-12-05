const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;


// middleware

app.use(cors());
app.use(express.json());

// mongodb



const uri = "mongodb+srv://ueomehers:2o8eVOwte7zI6lk4@cluster0.jdjqxci.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();


    // const database = client.db("productDB");
    // const productCollection = database.collection("products");

    const productCollection = client.db("productDB").collection("products")


    // send data form server to client

    app.get('/product',async(req,res)=>{
          const cursor = productCollection.find();
          const result = await cursor.toArray();
          res.send(result)

    });


    //  delete data form client and server when delete the item Id must be use because it's unique 
    app.delete('/product/:id', async(req, res)=>{
      const id = req.params.id;
      // query is use for the mongodb 
      const query = {_id: new ObjectId(id) }
      result = await productCollection.deleteOne(query);
      res.send(result)
      console.log('please delete from database', id)

    })




    // get data from client side
    app.post('/product', async (req, res) => {
      const product = req.body;
      const result = await productCollection.insertOne(product);
      res.send(result);
      console.log('product form server5', product)
    })



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error


    //********** */ It must be Comment ==========================


    // await client.close();
  }
}
run().catch(console.dir);






app.get('/', (req, res) => {
  res.send('shop server is running')


});


app.listen(port, () => {
  console.log(`Shop Server is Running on the port:${port}`)
})