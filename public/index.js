
AOS.init();



// document.addEventListener("contextmenu", (event) => {
//   event.preventDefault();
// });


document.addEventListener("keydown", (event) => {
  // Disable F12
  if (event.key === "F12") {
    event.preventDefault();
  }
  // Disable Ctrl+Shift+I (Inspect Element)


});






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





