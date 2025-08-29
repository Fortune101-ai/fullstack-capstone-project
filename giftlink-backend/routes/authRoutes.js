const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const express = require('express');
const bcryptjs = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const connectToDatabase = require('../models/db');
const router = express.Router();
const pino = require('pino');

const app = express();

const logger = pino();

const JWT_SECRET = process.env.JWT_SECRET;

router.post('/register', async (req, res) => {
    try {
        // Task 1: Connect to `giftsdb` in MongoDB through `connectToDatabase` in `db.js`
         // {{insert code here}}
         const db = await connectToDatabase();

        // Task 2: Access MongoDB collection
         const usersCollection = db.collection('users');

        //Task 3: Check for existing email
         const existingUser = await usersCollection.findOne({ email: req.body.email });

        const salt = await bcryptjs.genSalt(10);
        const hash = await bcryptjs.hash(req.body.password, salt);
        const email = req.body.email;

        // {{insert code here}} //Task 4: Save user details in database
        if (existingUser) {
            logger.warn('User already exists');
            return res.status(400).send('User already exists');
        }

                const newUser = await collection.insertOne({
            email: req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            password: hash,
            createdAt: new Date(),
        });

        await usersCollection.insertOne(newUser);

        // Task 5: Create JWT authentication with user._id as payload
        const authtoken = jwt.sign({ id: newUser._id }, JWT_SECRET);
        logger.info('User registered successfully');
        res.json({ authtoken, email });
    } catch (e) {
         return res.status(500).send('Internal server error');
    }
});
