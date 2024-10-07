const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const port = 3033;

const app = express();
app.use(express.static(__dirname));
app.use(express.urlencoded({ extended: true }));

mongoose.connect("mongodb://127.0.0.1:27017/Medical_Store");
const db = mongoose.connection;
db.once("open", () => {
  console.log("Mongodb connection successful");
});

const customerSchema = new mongoose.Schema({
  Customer_ID: Number,
  Customer_name: String,
  Phone_number: Number,
  Email_ID: String,
});

const Customer = mongoose.model("Customer", customerSchema);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "create-customer.html"));
});

app.post("/post", async (req, res) => {
  const { Customer_ID, Customer_name, Phone_number, Email_ID } = req.body;
  const customer = new Customer({
    Customer_ID,
    Customer_name,
    Phone_number,
    Email_ID,
  });
  await customer.save();
  console.log(customer);
  res.send("Customer created sucessfully");
});

app.listen(port, () => {
  console.log("Server started");
  console.log(`Server started at http://localhost:${port}`);
});
