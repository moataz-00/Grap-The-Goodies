

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




const decreaseBtn = document.getElementById('decrease');
const increaseBtn = document.getElementById('increase');
const quantityInput = document.getElementById('quantity');
const maxQuantity = parseInt(quantityInput.getAttribute('max'), 10);


const pricePerBag = parseFloat(document.getElementById('pricePerBag').textContent);
const totalPriceElement = document.querySelectorAll('.totalPrice');


console.log(totalPriceElement);





  // Function to update total price
  function updateTotalPrice() {
    const quantity = parseInt(quantityInput.value, 10);
    const totalPrice = quantity * pricePerBag;
    totalPriceElement[0].value = totalPrice.toFixed(2); // Show price with two decimal points
    totalPriceElement[1].textContent = totalPrice.toFixed(2);
  }

// Decrease quantity
decreaseBtn.addEventListener('click', () => {
    let currentQuantity = parseInt(quantityInput.value, 10);
    if (currentQuantity > 1) {
      quantityInput.value = currentQuantity - 1;
    }
    updateTotalPrice();
  });

// Increase quantity
increaseBtn.addEventListener('click', () => {
      let currentQuantity = parseInt(quantityInput.value, 10);
      if (currentQuantity < maxQuantity) {
        quantityInput.value = currentQuantity + 1;
      }
      updateTotalPrice();
    });



