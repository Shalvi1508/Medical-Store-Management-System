
let editingPharmacistId = null; // Track which pharmacist is being edited

document.addEventListener("DOMContentLoaded", function () {
  loadPharmacists();

  const pharmacistForm = document.getElementById("pharmacistForm");
  pharmacistForm.addEventListener("submit", addOrUpdatePharmacist);
});

// Fetch and display all pharmacists
async function loadPharmacists() {
  const response = await fetch("/pharmacists");
  const pharmacists = await response.json();

  const pharmacistTable = document.getElementById("pharmacistTable");
  pharmacistTable.innerHTML = "";

  pharmacists.forEach((pharmacist) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${pharmacist.pharmacist_id}</td>
            <td>${pharmacist.pharmacist_name}</td>
            <td>${pharmacist.phone_number}</td>
            <td>${pharmacist.address}</td>
            <td>
                <button onclick="editPharmacist('${pharmacist._id}')">Edit</button>
                <button onclick="deletePharmacist('${pharmacist._id}')">Delete</button>
            </td>
        `;
    pharmacistTable.appendChild(row);
  });
}

// Validate pharmacist form inputs
function validatePharmacistForm(pharmacist_id, phone_number, pharmacists) {
  const idRegex = /^PHARM\d{3}$/; // Matches 'PHAR' followed by exactly 3 digits
  const phoneRegex = /^\d{10}$/; // Matches exactly 10 digits

  if (!idRegex.test(pharmacist_id)) {
    alert("Pharmacist ID must be in the format PHAR001.");
    return false;
  }

  if (
    pharmacists.some(
      (pharmacist) =>
        pharmacist.pharmacist_id === pharmacist_id &&
        pharmacist._id !== editingPharmacistId
    )
  ) {
    alert("Pharmacist ID already exists.");
    return false;
  }

  if (!phoneRegex.test(phone_number)) {
    alert("Phone number must be a 10-digit positive number.");
    return false;
  }

  return true;
}

// Add or Update a pharmacist
async function addOrUpdatePharmacist(event) {
  event.preventDefault();

  const pharmacist_id = document.getElementById("pharmacist_id").value;
  const pharmacist_name = document.getElementById("pharmacist_name").value;
  const phone_number = document.getElementById("phone_number").value;
  const address = document.getElementById("address").value;

  const pharmacist = { pharmacist_id, pharmacist_name, phone_number, address };

  try {
    // Fetch all pharmacists to validate the ID
    const response = await fetch("/pharmacists");
    const pharmacists = await response.json();

    if (!validatePharmacistForm(pharmacist_id, phone_number, pharmacists)) {
      return; // Validation failed, exit the function
    }

    let saveResponse;
    if (editingPharmacistId) {
      // UPDATE existing pharmacist
      saveResponse = await fetch(`/pharmacists/${editingPharmacistId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(pharmacist),
      });
    } else {
      // CREATE new pharmacist
      saveResponse = await fetch("/pharmacists", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(pharmacist),
      });
    }

    if (saveResponse.ok) {
      loadPharmacists();
      pharmacistForm.reset();
      editingPharmacistId = null; // Clear the editing state
    } else {
      console.log("Failed to save pharmacist.");
    }
  } catch (error) {
    console.error(error);
  }
}

// Edit pharmacist - populate the form with the selected pharmacist data
async function editPharmacist(id) {
  const response = await fetch(`/pharmacists/${id}`);
  const pharmacist = await response.json();

  document.getElementById("pharmacist_id").value = pharmacist.pharmacist_id;
  document.getElementById("pharmacist_name").value = pharmacist.pharmacist_name;
  document.getElementById("phone_number").value = pharmacist.phone_number;
  document.getElementById("address").value = pharmacist.address;

  editingPharmacistId = pharmacist._id; // Set the pharmacist ID for the update operation
}

// Delete a pharmacist
async function deletePharmacist(id) {
  const response = await fetch(`/pharmacists/${id}`, {
    method: "DELETE",
  });

  if (response.ok) {
    loadPharmacists();
  }
}