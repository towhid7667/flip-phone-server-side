const express = require('express')
const cors = require('cors')
require("dotenv").config();   
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();


app.use(cors())
app.use(express.json())


app.get('/', async(req, res) =>{
    res.send('server is booming')
})

app.listen(port, () => {
    console.log(`Server running on ${port}`)
})