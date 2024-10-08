const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const port = 3040;

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

// Define the Pharmacist schema
const pharmacistSchema = new mongoose.Schema({
  Pharmacist_ID: String,
  Pharmacist_name: String,
  Phone_number: Number,
  Address: String,
});

// Create Pharmacist model
const Pharmacist = mongoose.model("Pharmacist", pharmacistSchema);

// Serve the Customer Menu as the homepage
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "menu.html"));
});

// Serve the Create Customer form
app.get("/create-customer", (req, res) => {
  res.sendFile(path.join(__dirname, "create-customer.html"));
});

// Serve the Create Pharmacist form
app.get("/create-pharmacist", (req, res) => {
  res.sendFile(path.join(__dirname, "create-pharmacist.html"));
});

// Serve the Update Pharmacist form
app.get("/update-pharmacist", (req, res) => {
  res.sendFile(path.join(__dirname, "update-pharmacist.html"));
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

// Handle GET request for retrieving customer by both ID and name
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

// Handle form POST request for creating pharmacist
app.post("/post-pharmacist", async (req, res) => {
  try {
    const { Pharmacist_ID, Pharmacist_name, Phone_number, Address } = req.body;

    // Validate Pharmacist_ID
    const pharmacistIdRegex = /^PHARM\d{3,}$/;
    if (!pharmacistIdRegex.test(Pharmacist_ID)) {
      return res
        .status(400)
        .send(
          "Invalid Pharmacist ID format. It should start with 'PHARM' followed by at least 3 digits (e.g., PHARM001)."
        );
    }

    // Validate Phone_number
    const phoneNumberRegex = /^\d{10}$/;
    if (!phoneNumberRegex.test(Phone_number)) {
      return res
        .status(400)
        .send("Invalid phone number. It should be a 10-digit number.");
    }

    const pharmacist = new Pharmacist({
      Pharmacist_ID,
      Pharmacist_name,
      Phone_number,
      Address,
    });

    await pharmacist.save();
    console.log("Pharmacist created:", pharmacist);
    res.status(200).send("Pharmacist created successfully");
  } catch (err) {
    console.error("Error creating pharmacist:", err);
    res.status(500).send("Failed to create pharmacist");
  }
});

// Handle form POST request for updating customer
app.post("/update-customer", async (req, res) => {
  try {
    const { Customer_ID, Customer_name, Phone_number, Email_ID } = req.body;

    const customer = await Customer.findOne({ Customer_ID });

    if (!customer) {
      return res.status(404).send("Customer not found");
    }

    // Update the customer fields if provided
    if (Customer_name) customer.Customer_name = Customer_name;
    if (Phone_number) customer.Phone_number = Phone_number;
    if (Email_ID) customer.Email_ID = Email_ID;

    await customer.save();
    console.log("Customer updated:", customer);
    res.status(200).send("Customer updated successfully");
  } catch (err) {
    console.error("Error updating customer:", err);
    res.status(500).send("Failed to update customer");
  }
});

// Handle form POST request for updating pharmacist
app.post("/update-pharmacist", async (req, res) => {
  try {
    const { Pharmacist_ID, Pharmacist_name, Phone_number, Address } = req.body;

    // Find the pharmacist by ID
    const pharmacist = await Pharmacist.findOne({ Pharmacist_ID });

    if (!pharmacist) {
      return res.status(404).send("Pharmacist not found");
    }

    // Update the pharmacist fields if provided
    if (Pharmacist_name) pharmacist.Pharmacist_name = Pharmacist_name;
    if (Phone_number) pharmacist.Phone_number = Phone_number;
    if (Address) pharmacist.Address = Address;

    await pharmacist.save();
    console.log("Pharmacist updated:", pharmacist);
    res.status(200).send("Pharmacist updated successfully");
  } catch (err) {
    console.error("Error updating pharmacist:", err);
    res.status(500).send("Failed to update pharmacist");
  }
});

/// Handle GET request for retrieving pharmacist by ID
app.get("/retrieve-pharmacist/:id", async (req, res) => {
  try {
    const pharmacistID = req.params.id;
    const pharmacist = await Pharmacist.findOne({
      Pharmacist_ID: pharmacistID,
    });

    if (!pharmacist) {
      return res.status(404).send("Pharmacist not found");
    }

    res.status(200).json(pharmacist); // Send the pharmacist details as JSON
  } catch (err) {
    console.error("Error retrieving pharmacist:", err);
    res.status(500).send("Failed to retrieve pharmacist");
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});
