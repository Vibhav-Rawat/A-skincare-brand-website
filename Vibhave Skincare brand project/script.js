// MELORA mini project: simple JavaScript interactions

// Show the saved cart count on every page.
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("meloraCart")) || [];
  const count = cart.reduce((total, item) => total + item.quantity, 0);
  document.querySelectorAll("#cart-count").forEach((element) => {
    element.textContent = count;
  });
}

// Add a product to the cart and save it in the browser.
function addToCart(name, price) {
  const cart = JSON.parse(localStorage.getItem("meloraCart")) || [];
  const existingItem = cart.find((item) => item.name === name);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ name: name, price: price, quantity: 1 });
  }

  localStorage.setItem("meloraCart", JSON.stringify(cart));
  updateCartCount();
  showCart();
}

// Display cart items on the shop page.
function showCart() {
  const cartArea = document.getElementById("cart-items");
  if (!cartArea) return;

  const cart = JSON.parse(localStorage.getItem("meloraCart")) || [];
  const totalArea = document.getElementById("cart-total");

  if (cart.length === 0) {
    cartArea.innerHTML = '<p class="muted">Your bag is empty for now. Add something you like.</p>';
    totalArea.textContent = "₹0";
    return;
  }

  cartArea.innerHTML = "";
  let total = 0;

  cart.forEach((item, index) => {
    total += item.price * item.quantity;
    const row = document.createElement("div");
    row.className = "cart-item";
    row.innerHTML = `<span>${item.name} × ${item.quantity}</span>
      <span>₹${item.price * item.quantity}
      <button class="remove-item" data-index="${index}">Remove</button></span>`;
    cartArea.appendChild(row);
  });

  totalArea.textContent = "₹" + total;
}

// Set up add-to-cart buttons.
document.querySelectorAll(".add-button").forEach((button) => {
  button.addEventListener("click", () => {
    addToCart(button.dataset.name, Number(button.dataset.price));
  });
});

// Remove one product from the cart.
document.addEventListener("click", (event) => {
  if (event.target.classList.contains("remove-item")) {
    const cart = JSON.parse(localStorage.getItem("meloraCart")) || [];
    const index = Number(event.target.dataset.index);
    cart.splice(index, 1);
    localStorage.setItem("meloraCart", JSON.stringify(cart));
    updateCartCount();
    showCart();
  }
});

// Clear the whole cart.
const clearButton = document.getElementById("clear-cart");
if (clearButton) {
  clearButton.addEventListener("click", () => {
    localStorage.removeItem("meloraCart");
    updateCartCount();
    showCart();
  });
}

// Filter products by category.
const filterButtons = document.querySelectorAll(".filter-btn");
filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((item) => item.classList.remove("selected"));
    button.classList.add("selected");

    const category = button.dataset.filter;
    document.querySelectorAll(".shop-product").forEach((product) => {
      product.style.display =
        category === "all" || product.dataset.category === category ? "" : "none";
    });
  });
});

// Sort products by price.
const sortSelect = document.getElementById("sort-products");
if (sortSelect) {
  sortSelect.addEventListener("change", () => {
    const list = document.getElementById("product-list");
    const products = Array.from(list.querySelectorAll(".shop-product"));

    products.sort((a, b) => {
      const priceA = Number(a.dataset.price);
      const priceB = Number(b.dataset.price);

      if (sortSelect.value === "low") return priceA - priceB;
      if (sortSelect.value === "high") return priceB - priceA;
      return 0;
    });

    products.forEach((product) => list.appendChild(product));
  });
}

// Validate the contact form. This is a front-end demo; it does not send email.
const contactForm = document.getElementById("contact-form");
if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();
    const feedback = document.getElementById("form-message");

    if (name === "" || email === "" || message === "") {
      feedback.style.color = "#b45d50";
      feedback.textContent = "Please fill in all three fields.";
      return;
    }

    if (!email.includes("@") || !email.includes(".")) {
      feedback.style.color = "#b45d50";
      feedback.textContent = "Please enter a valid email address.";
      return;
    }

    feedback.style.color = "#648264";
    feedback.textContent = "Thanks, " + name + "! Your demo message is ready.";
    contactForm.reset();
  });
}

// Run shared page setup.
updateCartCount();
showCart();
