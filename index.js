const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.c0svav3.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        const serviceCollection = client.db('photograpy').collection('services');
        const commentCollection = client.db('photograpy').collection('comments')
        
        app.get('/services', async(req, res) =>{
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);

        })

        app.get('/services/:id', async(req, res) =>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const service = await serviceCollection.findOne(query);
            res.send(service);
        })


        // comment api

        app.get('/comment', async(req, res) =>{
            let query = {}
            if(req.query.service){
                query = {
                    service : req.query.service
                }
            }
            const cursor = commentCollection.find(query);
            const comments = await cursor.toArray()
            res.send(comments)
        })

        app.post('/comment', async(req, res) =>{
            const comment = req.body;
            const result = await commentCollection.insertOne(comment);
            res.send(result)
        })
    }
    finally{
        
    }
}

run().catch(err => console.error(err))

app.get('/', (req, res) => {
    res.send('assignment 11 is runnig here')
})

app.listen(port, () => {
    console.log(`Server is running for assignment ${port}`)
});