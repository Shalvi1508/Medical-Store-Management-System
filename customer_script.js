// Function to go back to the Customer Management menu
function goBack() {
  window.location.href = "menu-customer.html";
}

// Regular expression to match the format "CUST" followed by 3 digits
const customerIdPattern = /^CUST\d{3}$/;

// Validate Customer ID function
function validateCustomerId(customerId) {
  return customerIdPattern.test(customerId);
}

// Create Customer Form
document
  .getElementById("create-form")
  ?.addEventListener("submit", function (event) {
    event.preventDefault();

    let customerId = document.getElementById("create_customer_id").value.trim();
    let phoneNumber = document.getElementById("create_phone_number").value;
    let email = document.getElementById("create_email").value;

    let customerIdError = document.getElementById("create_customer_id_error");
    let phoneError = document.getElementById("create_phone_error");
    let emailError = document.getElementById("create_email_error");
    let errorMessage = document.getElementById("create_error-message");

    // Reset previous error messages
    customerIdError.textContent = "";
    phoneError.textContent = "";
    emailError.textContent = "";
    errorMessage.textContent = "";

    let isValid = true;

    // Validate Customer ID
    if (!validateCustomerId(customerId)) {
      customerIdError.textContent =
        'Customer ID must be in the format "CUST001".';
      isValid = false;
    }

    // Validate Phone Number
    if (!/^\d{10}$/.test(phoneNumber)) {
      phoneError.textContent = "Phone number must be exactly 10 digits.";
      isValid = false;
    }

    // Validate Email
    if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email)) {
      emailError.textContent = "Email must be in the format abc@gmail.com.";
      isValid = false;
    }

    if (isValid) {
      alert("Customer information is valid and ready for submission.");
      // Proceed with form submission or further processing
    } else {
      errorMessage.textContent = "Please correct the errors above.";
    }
  });

// Update Customer Form
document
  .getElementById("update-form")
  ?.addEventListener("submit", function (event) {
    event.preventDefault();

    let customerId = document.getElementById("update_customer_id").value.trim();
    let phoneNumber = document.getElementById("update_phone_number").value;
    let email = document.getElementById("update_email").value;

    let customerIdError = document.getElementById("update_customer_id_error");
    let phoneError = document.getElementById("update_phone_error");
    let emailError = document.getElementById("update_email_error");
    let errorMessage = document.getElementById("update_error-message");

    // Reset previous error messages
    customerIdError.textContent = "";
    phoneError.textContent = "";
    emailError.textContent = "";
    errorMessage.textContent = "";

    let isValid = true;

    // Validate Customer ID
    if (!validateCustomerId(customerId)) {
      customerIdError.textContent =
        'Customer ID must be in the format "CUST001".';
      isValid = false;
    }

    // Validate Phone Number (optional for update)
    if (phoneNumber && !/^\d{10}$/.test(phoneNumber)) {
      phoneError.textContent = "Phone number must be exactly 10 digits.";
      isValid = false;
    }

    // Validate Email (optional for update)
    if (email && !/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email)) {
      emailError.textContent = "Email must be in the format abc@gmail.com.";
      isValid = false;
    }

    if (isValid) {
      alert("Customer information is valid and ready for update.");
      // Proceed with form submission or further processing
    } else {
      errorMessage.textContent = "Please correct the errors above.";
    }
  });

// Retrieve Customer Form
document
  .getElementById("retrieve-form")
  ?.addEventListener("submit", function (event) {
    event.preventDefault();

    let customerId = document
      .getElementById("retrieve_customer_id")
      .value.trim();
    let customerIdError = document.getElementById("retrieve_customer_id_error");
    let errorMessage = document.getElementById("retrieve_error-message");

    // Reset previous error messages
    customerIdError.textContent = "";
    errorMessage.textContent = "";

    let isValid = true;

    // Validate Customer ID
    if (!validateCustomerId(customerId)) {
      customerIdError.textContent =
        'Customer ID must be in the format "CUST001".';
      isValid = false;
    }

    if (isValid) {
      alert("Customer information is valid and ready for retrieval.");
      // Proceed with form submission or further processing
    } else {
      errorMessage.textContent = "Please correct the errors above.";
    }
  });

// Delete Customer Form
document
  .getElementById("delete-form")
  ?.addEventListener("submit", function (event) {
    event.preventDefault();

    let customerId = document.getElementById("delete_customer_id").value.trim();
    let customerIdError = document.getElementById("delete_customer_id_error");
    let errorMessage = document.getElementById("delete_error-message");

    // Reset previous error messages
    customerIdError.textContent = "";
    errorMessage.textContent = "";

    let isValid = true;

    // Validate Customer ID
    if (!validateCustomerId(customerId)) {
      customerIdError.textContent =
        'Customer ID must be in the format "CUST001".';
      isValid = false;
    }

    if (isValid) {
      alert("Customer information is valid and ready for deletion.");
      // Proceed with form submission or further processing
    } else {
      errorMessage.textContent = "Please correct the errors above.";
    }
  });
