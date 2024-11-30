// server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Person = require('./models/person');
const app = express();
const port = 3000;

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/peopleDB', { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// GET /person: Get all people
app.get('/person', async (req, res) => {
  try {
    const people = await Person.find();
    res.status(200).json(people);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching people', error: err.message });
  }
});

// POST /person: Create a new person
app.post('/person', async (req, res) => {
  const { name, age, gender, mobile } = req.body;

  // Check if the required fields are provided
  if (!name || !age || !gender || !mobile) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const newPerson = new Person({ name, age, gender, mobile });
    const savedPerson = await newPerson.save();
    res.status(201).json(savedPerson);
  } catch (err) {
    res.status(500).json({ message: 'Error creating person', error: err.message });
  }
});

// PUT /person/{id}: Update a person by ID
app.put('/person/:id', async (req, res) => {
  const { id } = req.params;
  const { name, age, gender, mobile } = req.body;

  try {
    const updatedPerson = await Person.findByIdAndUpdate(id, { name, age, gender, mobile }, { new: true });
    if (!updatedPerson) {
      return res.status(404).json({ message: 'Person not found' });
    }
    res.status(200).json(updatedPerson);
  } catch (err) {
    res.status(500).json({ message: 'Error updating person', error: err.message });
  }
});

// DELETE /person/{id}: Delete a person by ID
app.delete('/person/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedPerson = await Person.findByIdAndDelete(id);
    if (!deletedPerson) {
      return res.status(404).json({ message: 'Person not found' });
    }
    res.status(200).json({ message: 'Person deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting person', error: err.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
