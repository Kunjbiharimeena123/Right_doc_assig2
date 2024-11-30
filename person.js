// models/person.js
const mongoose = require('mongoose');

// Define the schema for the Person collection
const personSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  mobile: { type: String, required: true }
});

module.exports = mongoose.model('Person', personSchema);
