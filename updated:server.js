const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const port = 3042;

const app = express();
app.use(express.static(__dirname));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/Medical_Store_Management_System", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.once("open", () => {
  console.log("Mongodb connection successful");
});

// Define the Customer schema
const customerSchema = new mongoose.Schema({
  Customer_ID: String,
  Customer_name: String,
  Phone_number: Number,
  Email_ID: String,
});

// Create Customer model
const Customer = mongoose.model("Customer", customerSchema);

// Serve the Customer Menu as the homepage
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "menu.html"));
});

// Handle form POST request for creating customer
app.post("/post-customer", async (req, res) => {
  try {
    const { Customer_ID, Customer_name, Phone_number, Email_ID } = req.body;

    const customer = new Customer({
      Customer_ID,
      Customer_name,
      Phone_number,
      Email_ID,
    });

    await customer.save();
    console.log("Customer created:", customer);
    res.status(200).send("Customer created successfully");
  } catch (err) {
    console.error("Error creating customer:", err);
    res.status(500).send("Failed to create customer");
  }
});

// Handle POST request for updating customer data
app.post("/update-customer", async (req, res) => {
  try {
    const { Customer_ID, Customer_name, Phone_number, Email_ID } = req.body;

    // Find the customer by Customer_ID and update their details
    const updatedCustomer = await Customer.findOneAndUpdate(
      { Customer_ID },
      { Customer_name, Phone_number, Email_ID },
      { new: true } // Return the updated document
    );

    if (!updatedCustomer) {
      return res.status(404).send("Customer not found.");
    }

    console.log("Customer updated:", updatedCustomer);
    res.status(200).send("Customer updated successfully");
  } catch (err) {
    console.error("Error updating customer:", err);
    res.status(500).send("Failed to update customer");
  }
});

//Handle GET request for retrieving customer by both ID and name
app.get("/retrieve-customer-by-id-and-name/:id/:name", async (req, res) => {
  try {
    const customerID = req.params.id;
    const customerName = req.params.name;

    // Find customer by both Customer_ID and Customer_name
    const customer = await Customer.findOne({
      Customer_ID: customerID,
      Customer_name: customerName,
    });

    if (!customer) {
      return res
        .status(404)
        .send("Customer not found with the provided ID and name");
    }

    res.status(200).json(customer); // Send the customer details as JSON
  } catch (err) {
    console.error("Error retrieving customer by ID and name:", err);
    res.status(500).send("Failed to retrieve customer");
  }
});

app.get("/retrieve-customer-by-id-and-name/:id/:name", async (req, res) => {
  try {
    const customerID = req.params.id.trim();
    const customerName = req.params.name.trim();

    // Case-insensitive and trim search for both Customer_ID and Customer_name
    const customer = await Customer.findOne({
      Customer_ID: customerID,
      Customer_name: { $regex: new RegExp("^" + customerName + "$", "i") },
    });

    if (!customer) {
      return res
        .status(404)
        .send("Customer not found with the provided ID and name");
    }

    res.status(200).json(customer);
  } catch (err) {
    console.error("Error retrieving customer by ID and name:", err);
    res.status(500).send("Failed to retrieve customer");
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});
