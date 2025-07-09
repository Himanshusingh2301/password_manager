/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

const express = require('express')
const dotenv = require('dotenv')
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const cors = require('cors');
dotenv.config()
const app = express()
const port = 3000
const url = process.env.MONGO_URI || 'mongodb://localhost:27017'
const client = new MongoClient(url)
app.use(bodyParser.json()); // Middleware to parse JSON bodies
//database name
app.use(cors());
const dbName = 'pass_manager'

// console.log(process.env.MONGO_URI)



app.post('/', async (req, res) => {
    const { id, site, username, password } = req.body;

    if ( !site || !username || !password) {
        return res.status(400).json({ error: 'All fields are required.' });
    }
    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection('passwords');

        const newPass = { id, site, username, password };
        const result = await collection.insertOne(newPass);

        res.status(201).json({ message: 'Password added successfully', id: result.insertedId });
    } catch (error) {
        console.error('Error adding password:', error);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        await client.close();
    }

})

app.get('/', async (req, res) => {
    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection('passwords');

        const passwords = await collection.find({}).toArray();
        res.status(200).json(passwords);
    } catch (error) {
        console.error('Error fetching passwords:', error);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        await client.close();
    }

})

app.delete('/', async (req, res) => {
    const password = req.body;
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection('passwords');
    const result = await collection.deleteOne(password);
    res.send({ message: 'Password deleted successfully', result });

})


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
