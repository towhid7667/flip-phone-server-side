const express = require('express')
const cors = require('cors')
require("dotenv").config();   
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();


app.use(cors())
app.use(express.json())

const uri = "mongodb+srv://<username>:<password>@cluster0.blm4ehx.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try{
        const besdealsDatabase = client.db("FlipPhone").collection("bestDeals");

        app.get('/bestDeals', async(req, res) => {
            const query = {};
            const result = await besdealsDatabase.find(query);
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