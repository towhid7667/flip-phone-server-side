const express = require('express')
const cors = require('cors')
const jwt = require('jsonwebtoken');
const port = process.env.PORT || 5000
require("dotenv").config();   
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();


app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.blm4ehx.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const verifyJWT = (req, res, next) =>{
    const authHeader = req.headers.authorization;
    if(!authHeader){
        return res.send(401).send('unauthorized access')
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.ACCESS_TOKEN, function(err, decoded){
        if(err){
            return res.status(403).send({message: 'forbidden access'})
        }

        req.decoded = decoded;
        next();
    })
}

async function run() {
    try{
        const bestdealsDatabase = client.db("FlipPhone").collection("bestDeals");
        const androidDatabase = client.db("FlipPhone").collection("android");
        const appleDatabase = client.db("FlipPhone").collection("AppleProducts");
        const gamingphonesDatabase = client.db("FlipPhone").collection("gamingphones");
        const usersDatabase = client.db("FlipPhone").collection("users");
        const productDatabase = client.db("FlipPhone").collection("AllProducts");



        const verifyAdmin = async (req, res, next) =>{
            const decodedEmail = req.decoded.email;
            const query = { email: decodedEmail };
            const user = await usersDatabase.findOne(query);

            if (user?.role !== 'admin') {
                return res.status(403).send({ message: 'forbidden access' })
            }
            next();
        }
        const verifyBuyer = async (req, res, next) =>{
            const decodedEmail = req.decoded.email;
            const query = { email: decodedEmail };
            const user = await usersDatabase.findOne(query);

            if (user?.role !== 'Buyer') {
                return res.status(403).send({ message: 'forbidden access' })
            }
            next();
        }
        const verifySeller = async (req, res, next) =>{
            const decodedEmail = req.decoded.email;
            const query = { email: decodedEmail };
            const user = await usersDatabase.findOne(query);

            if (user?.role !== "Seller") {
                return res.status(403).send({ message: 'forbidden access' })
            }
            next();
        }






        app.get('/bestDeals', async(req, res) => {
            const query = {};
            const result = await bestdealsDatabase.find(query).toArray();
            res.send(result);
        })
  
        app.post('/users', async(req, res) => {
            const user = req.body;
            const result = await usersDatabase.insertOne(user);
            res.send(result);
        })
        // app.get('/users/:email',  async(req, res) => {
        //     const email = req.params.email;
        //     const query = {email: email};
        //     const result = await usersDatabase.findOne(query);
        //     res.send(result);
        // })

        app.delete('/users/:id',verifyJWT, verifyAdmin, async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const result = await usersDatabase.deleteOne(filter);
            res.send(result);
        })


        app.get('/users/buyers', verifyJWT, verifyAdmin, async(req, res) => {
            const query = {role: "Buyer"};
            const result = await usersDatabase.find(query).toArray();
            res.send(result);
        })
        app.get('/users/sellers', verifyJWT, verifyAdmin, async(req, res) => {
            const query = {role: "Seller"};
            const result = await usersDatabase.find(query).toArray();
            res.send(result);
        })


        app.get('/jwt', async(req, res) => {
            const email = req.query.email;
            const query = {email : email};
            const user = await usersDatabase.findOne(query);

            if(user){
                const token = jwt.sign({email}, process.env.ACCESS_TOKEN, {expiresIn : '3h'})
                return res.send({accessToken : token})
            }
            res.status(403).send({accessToken : ''})

        })

        app.get('/users/admin/:email',verifyJWT, verifyAdmin, async(req, res) => {
            const email = req.params.email;
            const query = {email};
            const user = await usersDatabase.findOne(query)
            res.send({isAdmin: user?.role === "admin"})

        })
        app.get('/users/buyer/:email',verifyJWT, verifyBuyer, async(req, res) => {
            const email = req.params.email;
            const query = {email};
            const user = await usersDatabase.findOne(query)
            res.send({isBuyer: user?.role === 'Buyer'})

        })
        app.get('/users/seller/:email',verifyJWT, verifySeller, async(req, res) => {
            const email = req.params.email;
            const query = {email};
            const user = await usersDatabase.findOne(query)
            res.send({isSeller: user?.role === 'Seller'})

        })

        

        app.post('/allproducts',verifyJWT, async(req, res) => {
            const product = req.body;
            const result = await productDatabase.insertOne(product);
            res.send(result);
        })

        app.get('/allproducts', async(req, res) => {
            const query = {};
            const result = await productDatabase.find(query).toArray();
            res.send(result);
        })



        app.get('/androids', async(req, res) => {
            const query = {category: "Android"};
            const result = await productDatabase.find(query).toArray();
            res.send(result);
        })
        app.get('/appleproducts', async(req, res) => {
            const query = {category: "Apple"};
            const result = await productDatabase.find(query).toArray();
            res.send(result);
        })
        app.get('/gamingphones', async(req, res) => {
            const query = {category: "Gaming Phone"};
            const result = await productDatabase.find(query).toArray();
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