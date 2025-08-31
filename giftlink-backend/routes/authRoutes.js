const jwt = require("jsonwebtoken");
const express = require("express");
const bcryptjs = require("bcryptjs");
const { body, validationResult } = require("express-validator");
const connectToDatabase = require("../models/db");
const router = express.Router();
const pino = require("pino");

const logger = pino();

const JWT_SECRET = process.env.JWT_SECRET;

router.post("/register", async (req, res) => {
  try {
    // Task 1: Connect to `giftsdb` in MongoDB through `connectToDatabase` in `db.js`
    // {{insert code here}}
    const db = await connectToDatabase();

    // Task 2: Access MongoDB collection
    const usersCollection = db.collection("users");

    //Task 3: Check for existing email
    const existingUser = await usersCollection.findOne({
      email: req.body.email,
    });

    const salt = await bcryptjs.genSalt(10);
    const hash = await bcryptjs.hash(req.body.password, salt);
    const email = req.body.email;

    // {{insert code here}} //Task 4: Save user details in database
    if (existingUser) {
      logger.warn("User already exists");
      return res.status(400).send("User already exists");
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
    logger.info("User registered successfully");
    res.json({ authtoken, email });
  } catch (e) {
    return res.status(500).send("Internal server error");
  }
});

router.post("/login", async (req, res) => {
  try {
    // Task 1: Connect to `giftsdb` in MongoDB through `connectToDatabase` in `db.js`.
    const db = await connectToDatabase();
    // Task 2: Access MongoDB `users` collection
    const usersCollection = db.collection("users");
    // Task 3: Check for user credentials in database
    const user = await usersCollection.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).send("Invalid email or password");
    }
    // Task 4: Task 4: Check if the password matches the encrypyted password and send appropriate message on mismatch
    const isMatch = await bcryptjs.compare(req.body.password, user.password);
    if (!isMatch) {
      return res.status(400).send("Invalid email or password");
    }
    // Task 5: Fetch user details from database
    const userName = user.firstName;
    const userEmail = user.email;
    // Task 6: Create JWT authentication if passwords match with user._id as payload
    const authtoken = jwt.sign({ id: user._id }, JWT_SECRET);
    res.json({ authtoken, userName, userEmail });
    // Task 7: Send appropriate message if user not found
  } catch (e) {
    return res.status(500).send("Internal server error");
  }
});

router.put("/update", async (req, res) => {
  // Task 2: Validate the input using `validationResult` and return approiate message if there is an error.
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.error("Validation errors in update request", errors.array());
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    // Task 3: Check if `email` is present in the header and throw an appropriate error message if not present.
    const email = req.headers["email"];
    if (!email) {
      logger.error("Email not found in request headers");
      return res.status(400).send("Email not found");
    }
    // Task 4: Connect to MongoDB
    const db = await connectToDatabase();
    // Task 5: find user credentials in database
    const existingUser = await db.collection("users").findOne({ email });
    if (!existingUser) {
      logger.error("User not found");
      return res.status(404).send("User not found");
    }
    existingUser.updatedAt = new Date();

    // Task 6: update user credentials in database
    await db
      .collection("users")
      .updateOne(
        { email },
        { $set: existingUser },
        { returnDocument: "after" }
      );
    // Task 7: create JWT authentication using secret key from .env file
    const authtoken = jwt.sign({ id: existingUser._id }, JWT_SECRET);
    res.json({ authtoken });
  } catch (e) {
    return res.status(500).send("Internal server error");
  }
});

module.exports = router;