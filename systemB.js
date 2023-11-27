const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const port = 5002;

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/systemBD');

// Check for successful connection
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB!');
});

// Define the schema for the data
const itemSchema = new mongoose.Schema({
  EBELP: String,
  MATNR: Number,
  MAKTX: String,
  MENGE: String,
  MEINS: String,
  WERKS: Number,
  WERKS_NAME: String,
  NETPR: String,
});

const customerSchema = new mongoose.Schema({
  NAME: String,
  STREET: String,
  STR_SUPPL1: String,
  STR_SUPPL2: String,
  STR_SUPPL3: String,
  POST_CODE1: String,
  CITY1: String,
  TEL_NUMBER: String,
});

const salesOrderSchema = new mongoose.Schema({
  VBELN: String,
  KUNNR: String,
  BSTKD_E: String,
  VKBUR: String,
  VKBUR_BEZ: String,
  Items: [itemSchema],
  CUSTOMER: customerSchema,
});

const purchaseOrderSchema = new mongoose.Schema({
  EBELN: Number,
  LIFNR: Number,
  LIFNR_NAME: String,
  BEDAT: Number,
  UNSEZ: String,
  WAERS: String,
  Items: [itemSchema],
  SalesOrders: [salesOrderSchema],
});

// Top-level schema for the entire data
const dataSchema = new mongoose.Schema({
  PurchaseOrders: [purchaseOrderSchema],
});

// Create a Mongoose model using the schema
const DataModel = mongoose.model('systemBcollection', dataSchema, 'systemBcollection');

// Export the model for use in other files
module.exports = DataModel;

app.use(bodyParser.json());

// Endpoint to receive data in System B
app.post('/receiveData', async (req, res) => {
  try {
    const receivedData = req.body;

    // Dump the received data into the database
    await DataModel.create(receivedData);

    console.log('Received and Saved Data in System B:', receivedData);
    res.json({ message: 'Data received and saved successfully in System B' });
  } catch (error) {
    console.error('Error saving data:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`System B is running on http://localhost:${port}`);
});
