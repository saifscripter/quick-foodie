const cartButton = document.getElementById('cart');
const closeCartButton = document.getElementById('closeCart');
const cartItemsContainer = document.getElementById('cartItems');
const cartTotalPriceElement = document.getElementById('totalPrice');
const cartIndicator = document.getElementById('cartIndicator');
const sidebarTitle = document.getElementById('sidebarTitle');

let cartItems = [];

document.addEventListener('DOMContentLoaded', function () {
    const foodItemsContainer = document.getElementById('foodItems');
  
    // Fetch data from the JSON file
    fetch('./../data/foodItems.json')
      .then(response => response.json())
      .then(data => {
        // Iterate through the food items and create HTML elements
        data.forEach(foodItem => {
          const card = document.createElement('div');
          card.className = 'bg-gray-50 p-4 rounded-md shadow-md';
  
          const photo = document.createElement('img');
          photo.className = 'w-full';
          photo.src = foodItem.photoURL;

          const name = document.createElement('h2');
          name.className = 'text-xl font-semibold mt-4';
          name.textContent = foodItem.name;
  
          const price = document.createElement('p');
          price.className = 'text-gray-600 font-bold';
          price.textContent = `${foodItem.price.toFixed(2)}$/each`;

          const description = document.createElement('p');
          description.className = 'text-gray-600 mt-4';
          description.textContent = foodItem.description;
  
          const addToCartButton = document.createElement('button');
          addToCartButton.id = `add-to-cart-${foodItem.id}`
          addToCartButton.className = 'bg-red-600 text-white w-full py-1 mt-4 rounded-md';
          addToCartButton.textContent = 'Add to Cart';
          
          const customizeButton = document.createElement('button');
          customizeButton.className = 'border-2 border-red-600 text-red-600 font-semibold w-full py-1 mt-2 rounded-md hover:text-red-700 hover:border-red-700';
          customizeButton.textContent = 'Customize';
  
          // Add the click event to the "Add to Cart" button
          addToCartButton.addEventListener('click', function () {
            addItemToCart(foodItem);
            showCartSidebar();
            disableAddToCartButton(this)
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
        });
      })
      .catch(error => console.error('Error fetching food items:', error));
  });


// Function to show the cart sidebar
function showCartSidebar() {
  cartSidebar.style.transform = 'translateX(0)';
}

// Function to hide the cart sidebar
function hideCartSidebar() {
  cartSidebar.style.transform = 'translateX(100%)';
}

function addItemToCart(item) {
    const _item = {
        ...item,
        quantity: 1
    }

    cartItems.push(_item)
    addItemToUI(_item);
}

function addItemToUI(cartItem) {
    const cartItemElement = document.createElement('div');
    cartItemElement.id = `item-${cartItem.id}`;
    cartItemElement.className = 'relative border-2 border-white p-2 rounded-md grid grid-cols-[1fr_2fr] gap-3 h-32';

    const itemImage = document.createElement('div');
    itemImage.style.backgroundImage = `url(${cartItem.photoURL})`;
    itemImage.className = `bg-no-repeat bg-cover bg-center`;

    const itemDetails = document.createElement('div');

    const itemName = document.createElement('h3');
    itemName.textContent = cartItem.name;
    itemName.className = 'font-semibold'

    const itemPrice = document.createElement('p');
    itemPrice.textContent = `${cartItem.price?.toFixed(2)}$/each`;
    itemPrice.className = 'text-xs mb-2'

    const quantityAdjustment = document.createElement('div');
    quantityAdjustment.className = 'flex items-center';

    const decrementButton = document.createElement('button');
    decrementButton.className = 'bg-gray-200 text-black h-8 w-6 flex justify-center items-center';
    decrementButton.innerHTML = '<span>-</span>';
    decrementButton.addEventListener('click', () => decreaseQuantity(cartItem));

    const quantityDisplay = document.createElement('p');
    quantityDisplay.id = `quantity-${cartItem.id}`
    quantityDisplay.textContent = cartItem.quantity;
    quantityDisplay.className = 'bg-white text-black text-center h-6 w-8'

    const incrementButton = document.createElement('button');
    incrementButton.className = 'bg-gray-200 text-black h-8 w-6 flex justify-center items-center';
    incrementButton.innerHTML = '<span>+</span>';
    incrementButton.addEventListener('click', () => increaseQuantity(cartItem));

    const totalPrice = document.createElement('p');
    totalPrice.id = `total-price-${cartItem.id}`;
    totalPrice.className = 'text-right'
    totalPrice.textContent = `${(cartItem.quantity * cartItem.price).toFixed(2)}$`;

    const deleteButton = document.createElement('button');
    deleteButton.className = 'absolute top-0 right-0 bg-white text-red-600 size-6 rounded-md p-[6px] translate-x-1/2 -translate-y-1/2';
    deleteButton.addEventListener('click', () => deleteCartItem(cartItem));
    
    const deleteIcon = document.createElement('img');
    deleteIcon.src = '../images/trash.svg'
    deleteIcon.className = 'w-full'

    // Append icon to the delete button
    deleteButton.appendChild(deleteIcon)

    // Append adjustment elements to the quantityAdjustment element
    quantityAdjustment.appendChild(decrementButton);
    quantityAdjustment.appendChild(quantityDisplay);
    quantityAdjustment.appendChild(incrementButton);

    // Append elements to the item details
    itemDetails.appendChild(itemName);
    itemDetails.appendChild(itemPrice);
    itemDetails.appendChild(quantityAdjustment);
    itemDetails.appendChild(totalPrice);
    itemDetails.appendChild(deleteButton);

    // Append image and details to the cart item element
    cartItemElement.appendChild(itemImage);
    cartItemElement.appendChild(itemDetails);

    // Append the cart item element to the container
    cartItemsContainer.appendChild(cartItemElement);
  }

// Function to increase the quantity of a cart item
function increaseQuantity(cartItem) {
    cartItem.quantity++;

    displayQuantity(cartItem);
    displayItemTotalPrice(cartItem);
    displayCartTotalPrice();
}

// Function to decrease the quantity of a cart item
function decreaseQuantity(cartItem) {
    if (cartItem.quantity > 1) {
      cartItem.quantity--;
      
      displayQuantity(cartItem);
      displayItemTotalPrice(cartItem);
      displayCartTotalPrice();
    }
}

// Function to display Quantity
function displayQuantity(cartItem) {
    const quantityElement = document.getElementById(`quantity-${cartItem.id}`);
    quantityElement.textContent = cartItem.quantity;
}

// Function to display item total price
function displayItemTotalPrice(cartItem)  {
    const totalPrice = document.getElementById(`total-price-${cartItem.id}`);
    totalPrice.textContent = `${(cartItem.quantity * cartItem.price).toFixed(2)}$`
}

// Function to display cart total price
function displayCartTotalPrice() {
    const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    cartTotalPriceElement.textContent = `${total.toFixed(2)} $`;
}

// Function to delete a cart item
function deleteCartItem(cartItem) {
    cartItems = cartItems.filter(item => item !== cartItem);

    const item = document.getElementById(`item-${cartItem.id}`);
    item.parentNode.removeChild(item);
    
    const addToCartButton = document.getElementById(`add-to-cart-${cartItem.id}`);
    enableAddToCartButton(addToCartButton);

    displayCartTotalPrice();
    displayTotalSelectedItems();
}


function enableAddToCartButton(button) {
    button.removeAttribute('disabled');
    button.classList.remove('bg-gray-700');
    button.classList.add('bg-red-600');
    button.textContent = 'Add to Cart';
}

function disableAddToCartButton(button) {
    button.setAttribute('disabled', 'true');
    button.classList.remove('bg-red-600');
    button.classList.add('bg-gray-700');
    button.textContent = 'Added to Cart';
}

function displayTotalSelectedItems() {
    const totalSelectedItems = cartItems.length;
    cartIndicator.textContent = totalSelectedItems;
    sidebarTitle.textContent = `${totalSelectedItems} item${totalSelectedItems > 1 ? 's' : ''}`;
}

// Event listener for the close button
closeCartButton.addEventListener('click', hideCartSidebar);

// Event listener for the cartButton button
cartButton.addEventListener('click', showCartSidebar);
