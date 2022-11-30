const express = require('express')
const cors = require('cors')
const port = process.env.PORT || 5000
require("dotenv").config();   
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();


app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.blm4ehx.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try{
        const bestdealsDatabase = client.db("FlipPhone").collection("bestDeals");
        const androidDatabase = client.db("FlipPhone").collection("android");
        const appleDatabase = client.db("FlipPhone").collection("AppleProducts");

        app.get('/bestDeals', async(req, res) => {
            const query = {};
            const result = await bestdealsDatabase.find(query).toArray();
            res.send(result);
        })
        app.get('/androids', async(req, res) => {
            const query = {};
            const result = await androidDatabase.find(query).toArray();
            res.send(result);
        })
        app.get('/appleproducts', async(req, res) => {
            const query = {};
            const result = await appleDatabase.find(query).toArray();
            res.send(result);
        })




    }
    finally{

    }
}
run().catch(err => console.error(err))

app.get('/', async(req, res) =>{
    res.send('server is booming')
})

app.listen(port, () => {
    console.log(`Server running on ${port}`)
})