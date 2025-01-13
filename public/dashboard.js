

if (window.history && window.history.pushState) {
  window.history.pushState(null, null, document.URL);
  window.addEventListener('popstate', () => {
    window.location.href = '/partner/login';
  });
}


// ------------------acordin code------------------//
function toggleAccordion(header) {
  const allItems = document.querySelectorAll('.accordion-item');
  allItems.forEach(item => {
    if (item.contains(header)) {
      item.classList.toggle('active');
    } else {
      item.classList.remove('active');
    }
  });
}

// -----------------------end----------------- // 

function previewPhoto(input) {
  const file = input.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      document.getElementById('photoPreview').src = e.target.result;
    };
    reader.readAsDataURL(file);
  }
}
  
  
// Function to filter the table rows based on search input
// Function to filter table rows based on search input
function filterTable(inputId, tableId) {
  const input = document.getElementById(inputId);
  const filter = input.value.toLowerCase();
  const table = document.getElementById(tableId);
  const rows = table.getElementsByTagName("tr");

  // Loop through all table rows (except headers)
  for (let i = 1; i < rows.length; i++) {
      const cells = rows[i].getElementsByTagName("td");
      let rowMatch = false;

      // Check each cell in the row
      for (let j = 0; j < cells.length; j++) {
          const cellValue = cells[j].textContent || cells[j].innerText;
          if (cellValue.toLowerCase().indexOf(filter) > -1) {
              rowMatch = true;
              break;
          }
      }

      // Show or hide the row based on the match result
      rows[i].style.display = rowMatch ? "" : "none";
  }
}



