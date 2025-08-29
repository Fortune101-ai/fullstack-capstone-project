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

router.post('/login', async (req, res) => {
    try {
        // Task 1: Connect to `giftsdb` in MongoDB through `connectToDatabase` in `db.js`.
        const db = await connectToDatabase();
        // Task 2: Access MongoDB `users` collection
        const usersCollection = db.collection('users');
        // Task 3: Check for user credentials in database
        const user = await usersCollection.findOne({ email: req.body.email });
        if (!user) {
            return res.status(400).send('Invalid email or password');
        }
        // Task 4: Task 4: Check if the password matches the encrypyted password and send appropriate message on mismatch
        const isMatch = await bcryptjs.compare(req.body.password, user.password);
        if (!isMatch) {
            return res.status(400).send('Invalid email or password');
        }
        // Task 5: Fetch user details from database
        const userName = user.firstName;
        const userEmail = user.email;
        // Task 6: Create JWT authentication if passwords match with user._id as payload
        const authtoken = jwt.sign({ id: user._id }, JWT_SECRET);
        res.json({ authtoken, userName, userEmail });
        // Task 7: Send appropriate message if user not found
        
    } catch (e) {
         return res.status(500).send('Internal server error');

    }
});
