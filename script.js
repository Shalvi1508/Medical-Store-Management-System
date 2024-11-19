
let editingCustomerId = null; // Track the customer being edited

document.addEventListener("DOMContentLoaded", function () {
  loadCustomers();

  const customerForm = document.getElementById("customerForm");
  customerForm.addEventListener("submit", addOrUpdateCustomer);
});

// Fetch and display all customers
async function loadCustomers() {
  try {
    const response = await fetch("/customers");
    if (!response.ok) throw new Error("Failed to load customers");

    const customers = await response.json();
    const customerTable = document.getElementById("customerTable");
    customerTable.innerHTML = "";

    customers.forEach((customer) => {
      const row = document.createElement("tr");
      row.innerHTML = `
                <td>${customer.customer_id}</td>
                <td>${customer.customer_name}</td>
                <td>${customer.phone_number}</td>
                <td>${customer.email_id}</td>
                <td>
                    <button onclick="editCustomer('${customer._id}')">Edit</button>
                    <button onclick="deleteCustomer('${customer._id}')">Delete</button>
                </td>
            `;
      customerTable.appendChild(row);
    });
  } catch (error) {
    console.error(error);
  }
}

// Validate form inputs
function validateForm(customer_id, phone_number, email_id, customers) {
  const idRegex = /^CUST\d{3}$/; // Matches 'CUST' followed by exactly 3 digits
  const phoneRegex = /^\d{10}$/; // Matches exactly 10 digits
  // Matches typical email pattern: abc@gmail.com
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!idRegex.test(customer_id)) {
    alert("Customer ID must be in the format CUST001.");
    return false;
  }

  if (
    customers.some(
      (customer) =>
        customer.customer_id === customer_id &&
        customer._id !== editingCustomerId
    )
  ) {
    alert("Customer ID already exists.");
    return false;
  }

  if (!phoneRegex.test(phone_number)) {
    alert("Phone number must be a 10-digit number.");
    return false;
  }

  // Updated email validation
  if (!emailRegex.test(email_id)) {
    alert("Email must be in the format abc@gmail.com.");
    return false;
  }

  return true;
}

// Add or Update a customer
async function addOrUpdateCustomer(event) {
  event.preventDefault();

  const customer_id = document.getElementById("customer_id").value;
  const customer_name = document.getElementById("customer_name").value;
  const phone_number = document.getElementById("phone_number").value;
  const email_id = document.getElementById("email_id").value;

  const customer = { customer_id, customer_name, phone_number, email_id };

  try {
    // Fetch all customers to validate the ID
    const response = await fetch("/customers");
    const customers = await response.json();

    if (!validateForm(customer_id, phone_number, email_id, customers)) {
      return; // Validation failed, exit the function
    }

    let saveResponse;
    if (editingCustomerId) {
      // UPDATE existing customer
      saveResponse = await fetch(`/customers/${editingCustomerId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(customer),
      });
    } else {
      // CREATE new customer
      saveResponse = await fetch("/customers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(customer),
      });
    }

    if (saveResponse.ok) {
      loadCustomers();
      document.getElementById("customerForm").reset(); // Reset form
      editingCustomerId = null; // Clear editing state
    } else {
      console.log("Failed to save customer.");
    }
  } catch (error) {
    console.error(error);
  }
}

// Edit customer - populate the form with the selected customer data
async function editCustomer(id) {
  try {
    const response = await fetch(`/customers/${id}`);
    if (!response.ok) throw new Error("Failed to fetch customer data");

    const customer = await response.json();

    document.getElementById("customer_id").value = customer.customer_id;
    document.getElementById("customer_name").value = customer.customer_name;
    document.getElementById("phone_number").value = customer.phone_number;
    document.getElementById("email_id").value = customer.email_id;

    editingCustomerId = customer._id; // Set the ID for update operation
  } catch (error) {
    console.error(error);
  }
}

// Delete a customer
async function deleteCustomer(id) {
  try {
    const response = await fetch(`/customers/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      loadCustomers();
    } else {
      console.log("Failed to delete customer.");
    }
  } catch (error) {
    console.error(error);
  }
}
