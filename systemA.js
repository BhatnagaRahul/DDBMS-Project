const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const mongoose = require('mongoose');

const app = express();
const port = 5001;

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/systemADB');

//mongoose.connect('mongodb://localhost:27017/systemADB');

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

const PurchaseOrder = mongoose.model('systemAcollection', purchaseOrderSchema, 'systemAcollection');

app.use(bodyParser.json());

// Endpoint to send data from System A to System B
app.post('/sendData', async (req, res) => {
  try {
    // Retrieve data from MongoDB
    const dataToSend = await PurchaseOrder.find();
    // const dataToSend = req.body;

    // Assuming the endpoint URL of System B
    const endpointUrl = 'http://localhost:5002/receiveData';

    // Simulate sending data to System B
    simulateSendData(endpointUrl, dataToSend);

    res.json({ message: 'Data sent successfully from System A to System B' });
  } catch (error) {
    console.error('Error retrieving and sending data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Function to simulate sending data to another system (in this case, System B)
function simulateSendData(url, data) {
  // Simulate sending data using HTTP POST request
  axios.post(url, data)
    .then(response => {
      console.log('Response from System B:', response.data);
    })
    .catch(error => {
      console.error('Error communicating with System B:', error.message);
    });
}

// Start the server
app.listen(port, () => {
  console.log(`System A is running on http://localhost:${port}`);
});
