import { createButton, fetchData, getElement } from "./utils.js";

// DOM Elements
const foodItemsContainer = getElement("foodItems");
const cartButton = getElement("cart");
const closeCartButton = getElement("closeCart");
const cartItemsContainer = getElement("cartItems");
const cartTotalPriceElement = getElement("totalPrice");
const cartIndicator = getElement("cartIndicator");
const sidebarTitle = getElement("sidebarTitle");

let cartItems = getCart();

// Functions to create DOM Elements
const createFoodItemCard = (foodItem) => {
  const card = document.createElement("div");
  card.className = "bg-gray-50 p-3 sm:p-2 rounded-md shadow-md";

  const photo = document.createElement("img");
  photo.className = "w-full";
  photo.src = foodItem.photoURL;

  const name = document.createElement("h2");
  name.className = "text-lg font-semibold mt-3";
  name.textContent = foodItem.name;

  const price = document.createElement("p");
  price.className = "text-gray-600 font-bold";
  price.textContent = `${foodItem.price.toFixed(2)}$/each`;

  const description = document.createElement("p");
  description.className = "text-gray-600 text-[14px] mt-1";
  description.textContent = foodItem.description;

  const addToCartButton = createButton(
    "Add to Cart",
    "bg-red-500 text-white w-full h-8 mt-3 rounded-md",
    `addToCart${foodItem.id}`,
  );

  if (cartItems.find(({ id }) => id === foodItem.id))
    disableAddToCartButton(addToCartButton);

  const customizeButton = createButton(
    "Customize",
    "border-2 border-red-500 text-red-500 font-semibold w-full h-8 mt-2 rounded-md",
  );

  // Add the click event to the "Add to Cart" button
  addToCartButton.addEventListener("click", function () {
    addItemToCart(foodItem);
    showCartSidebar();
    disableAddToCartButton(this);
    displayCartTotalPrice();
    displayTotalSelectedItems();
  });

  // Append elements to the card
  card.appendChild(photo);
  card.appendChild(name);
  card.appendChild(price);
  card.appendChild(description);
  card.appendChild(addToCartButton);
  card.appendChild(customizeButton);

  // Append the card to the container
  foodItemsContainer.appendChild(card);
};

const createCartItemCard = (cartItem) => {
  const cartItemElement = document.createElement("div");
  cartItemElement.id = `item${cartItem.id}`;
  cartItemElement.className =
    "relative border-2 border-white p-2 rounded-md grid grid-cols-[1fr_2fr] gap-3 h-28";

  const itemImage = document.createElement("div");
  itemImage.style.backgroundImage = `url(${cartItem.photoURL})`;
  itemImage.className = `bg-no-repeat bg-cover bg-center`;

  const itemDetails = document.createElement("div");

  const itemName = document.createElement("h3");
  itemName.textContent = cartItem.name;
  itemName.className = "font-semibold";

  const itemPrice = document.createElement("p");
  itemPrice.textContent = `${cartItem.price?.toFixed(2)}$/each`;
  itemPrice.className = "text-xs mb-2";

  const quantityAdjustment = document.createElement("div");
  quantityAdjustment.className = "flex items-center";

  const decrementButton = createButton(
    "-",
    "bg-gray-300 text-black h-6 w-5 flex justify-center items-center",
  );

  const quantityDisplay = document.createElement("p");
  quantityDisplay.id = `quantity${cartItem.id}`;
  quantityDisplay.textContent = cartItem.quantity;
  quantityDisplay.className =
    "bg-white text-black text-center text-[13px] h-5 w-8";

  const incrementButton = createButton(
    "+",
    "bg-gray-300 text-black h-6 w-5 flex justify-center items-center",
  );

  const totalPrice = document.createElement("p");
  totalPrice.id = `totalPrice${cartItem.id}`;
  totalPrice.className = "absolute bottom-2 right-2 text-xs font-semibold";
  totalPrice.textContent = `${(cartItem.quantity * cartItem.price).toFixed(
    2,
  )}$`;

  const deleteButton = document.createElement("button");
  deleteButton.className =
    "absolute top-0 right-0 bg-white text-red-500 size-6 rounded-md p-[6px] translate-x-1/2 -translate-y-1/2";

  const deleteIcon = document.createElement("img");
  deleteIcon.src = "../images/trash.svg";
  deleteIcon.className = "w-full";

  // Event Listeners
  decrementButton.addEventListener("click", () => decreaseQuantity(cartItem));
  incrementButton.addEventListener("click", () => increaseQuantity(cartItem));
  deleteButton.addEventListener("click", () => deleteCartItem(cartItem));

  // Append icon to the delete button
  deleteButton.appendChild(deleteIcon);

  // Append adjustment elements to the quantityAdjustment element
  quantityAdjustment.appendChild(decrementButton);
  quantityAdjustment.appendChild(quantityDisplay);
  quantityAdjustment.appendChild(incrementButton);

  // Append elements to the item details
  itemDetails.appendChild(itemName);
  itemDetails.appendChild(itemPrice);
  itemDetails.appendChild(quantityAdjustment);

  // Append image and details to the cart item element
  cartItemElement.appendChild(itemImage);
  cartItemElement.appendChild(itemDetails);
  cartItemElement.appendChild(totalPrice);
  cartItemElement.appendChild(deleteButton);

  // Append the cart item element to the container
  cartItemsContainer.appendChild(cartItemElement);
};

// Functions to handle cart operations
function addItemToCart(item) {
  const _item = {
    ...item,
    quantity: 1,
  };

  cartItems.push(_item);
  updateCart(cartItems);
  createCartItemCard(_item);
}

function deleteCartItem(cartItem) {
  // Delete from the state
  cartItems = cartItems.filter((item) => item !== cartItem);
  updateCart(cartItems);

  // Delete from the UI
  const cartItemElement = getElement(`item${cartItem.id}`);
  cartItemElement.parentNode.removeChild(cartItemElement);

  // Update corresponding UI changes
  const addToCartButton = getElement(`addToCart${cartItem.id}`);
  enableAddToCartButton(addToCartButton);
  displayCartTotalPrice();
  displayTotalSelectedItems();
}

function increaseQuantity(cartItem) {
  // Increase in the state
  cartItem.quantity++;
  updateCart(cartItems);

  // Update other UI changes
  displayQuantity(cartItem);
  displayItemTotalPrice(cartItem);
  displayCartTotalPrice();
}

function decreaseQuantity(cartItem) {
  if (cartItem.quantity > 1) {
    // Decrease in the state
    cartItem.quantity--;
    updateCart(cartItems);

    // Update corresponding UI changes
    displayQuantity(cartItem);
    displayItemTotalPrice(cartItem);
    displayCartTotalPrice();
  }
}

// Functions to update UI based on changes in the corresponding state.
function enableAddToCartButton(button) {
  button.removeAttribute("disabled");
  button.classList.remove("bg-gray-700");
  button.classList.add("bg-red-500");
  button.textContent = "Add to Cart";
}

function disableAddToCartButton(button) {
  button.setAttribute("disabled", "true");
  button.classList.remove("bg-red-500");
  button.classList.add("bg-gray-700");
  button.textContent = "Added to Cart";
}

function showCartSidebar() {
  cartSidebar.style.transform = "translateX(0)";
}

function hideCartSidebar() {
  cartSidebar.style.transform = "translateX(100%)";
}

function toggleCartSidebar() {
  if (cartSidebar.style.transform === "translateX(0px)") {
    hideCartSidebar();
  } else {
    showCartSidebar();
  }
}

function displayQuantity(cartItem) {
  const quantityElement = getElement(`quantity${cartItem.id}`);
  quantityElement.textContent = cartItem.quantity;
}

function displayItemTotalPrice(cartItem) {
  const totalPrice = getElement(`totalPrice${cartItem.id}`);
  totalPrice.textContent = `${(cartItem.quantity * cartItem.price).toFixed(
    2,
  )}$`;
}

function displayCartTotalPrice() {
  const total = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  cartTotalPriceElement.textContent = `${total.toFixed(2)} $`;
}

function displayTotalSelectedItems() {
  const totalSelectedItems = cartItems.length;
  cartIndicator.textContent = totalSelectedItems;
  sidebarTitle.textContent = `${totalSelectedItems} item${
    totalSelectedItems > 1 ? "s" : ""
  }`;
}

// Function to update the cart in local storage
async function updateCart(cartItems) {
  const cartItemsJSON = JSON.stringify(cartItems);
  localStorage.setItem("cart", cartItemsJSON);
}

// Function to get the cart from local storage
function getCart() {
  const cartItemsJSON = localStorage.getItem("cart");
  const cartItems = JSON.parse(cartItemsJSON) || [];
  return cartItems;
}

// Global Event Listeners
document.addEventListener("DOMContentLoaded", async function () {
  const foodItems = await fetchData("./../data/foodItems.json");

  foodItems.forEach(createFoodItemCard);
  cartItems.forEach(createCartItemCard);

  displayTotalSelectedItems();
  displayCartTotalPrice();
});

closeCartButton.addEventListener("click", hideCartSidebar);

cartButton.addEventListener("click", toggleCartSidebar);
