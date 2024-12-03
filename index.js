const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config()
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

app.use(express.json());
app.use(cors());





const uri = `mongodb+srv://${process.env.USER_ID}:${process.env.USER_PASS}@cluster0.y6uow.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    tls: true,
    serverSelectionTimeoutMS: 3000,
    autoSelectFamily: false,
});

async function run() {
    try {
        const scheduleCollection = client.db('scheduleDB').collection("schedule");



        //schedule post
        app.post('/schedule', async (req, res) => {
            const data = req.body;
            const result = await scheduleCollection.insertOne(data);
            res.send(result);
        })

        //schedules get
        app.get('/schedules', async (req, res) => {
            const cursor = scheduleCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })
        //schedule get
        app.get('/schedule/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await scheduleCollection.findOne(query);
            res.send(result);
        })

        //schedules delete
        app.delete('/schedule/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await scheduleCollection.deleteOne(query);
            res.send(result);
        })

        // schedules update
        app.patch('/schedule/:id', async (req, res) => {
            const id = req.params.id;
            const updatedInfo = req.body;
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true };
            const schedule = {
                $set: {
                    formatHour: updatedInfo?.hour,
                    formattedDate: updatedInfo?.fDate,
                    title: updatedInfo?.title,
                    day: updatedInfo?.day
                }
            }
            const result = await scheduleCollection.updateOne(filter, schedule, options);
            res.send(result);
        })

        //  update
        app.patch('/completed/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const schedule = {
                $set: {
                    isCompleted: true,

                }
            }
            const result = await scheduleCollection.updateOne(filter, schedule);
            res.send(result);
        })


        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {

    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Server is running');
})

app.listen(port, () => {
    console.log("running on port", port);
})