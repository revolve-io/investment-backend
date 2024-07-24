const express = require('express');
const bodyParser = require("body-parser")
const mongoose = require('mongoose');
const User = require('./Model/user.model'); // Import user model
const cors = require('cors'); // optional for enabling CORS
const bcrypt = require('bcrypt'); // for password hashing
const jwt = require('jsonwebtoken'); // for generating tokens

const app = express();
const port = process.env.PORT || 5000; // Setting the port which the backend runs on

//Connecting to mongodb
// database connection string
const mongoURI = 'mongodb+srv://kim:60388449oO@cluster0.7436gtj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

const connectionURL = mongoURI;

mongoose.connect(connectionURL)
.then(() => {
  console.log('Connected to MongoDB!');
})
.catch(error => {
  console.error('Error connecting to MongoDB:', error);
});

//JSON Middleware
app.use(express.json()); // Parse incoming JSON data
//bodyparser middleware
app.use(cors()); // enable CORS (optional)
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/register', async (req, res) => {
  try {
    const { username, firstname, lastname, email, mobileNumber, password } = req.body;

    // Check for existing user
    const existingUser = await User.findOne({ username:req.body.username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Create new user
    const newUser = new User({username, firstname, lastname, email, mobileNumber, password});
    //user's name and password
    await newUser.save();

      const clientData = {
      clientName: username,
      clientFirstName: firstname,
      clientLastName: lastname,
      clientEmail: email,
      clientMobileNumber: mobileNumber,
      clientPassword: password
    };

    res.status(201).json([{ message: 'User created successfully' }, {clientData}]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating user' });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Compare password hashes
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Generate JWT token (optional)
    const token = jwt.sign({ userId: user._id }, 'your_secret_key'); // replace with your secret key
    res.json({ token, message: 'Login successful' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error logging in' });
  }
});

app.get('/',(req, res, clientData) => {
  res.json({clientData});
})

app.listen(port, () => console.log(`Server listening on port ${port}`));




