const cartButton = document.getElementById('cart');
const closeCartButton = document.getElementById('closeCart');
const cartItemsContainer = document.getElementById('cartItems');

const cartItems = [];

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
          addToCartButton.className = 'bg-red-600 text-white w-full py-1 mt-4 rounded-md hover:bg-red-700';
          addToCartButton.textContent = 'Add to Cart';
          
          const customizeButton = document.createElement('button');
          customizeButton.className = 'border-2 border-red-600 text-red-600 font-semibold w-full py-1 mt-2 rounded-md hover:text-red-700 hover:border-red-700';
          customizeButton.textContent = 'Customize';
  
          // Add the click event to the "Add to Cart" button
          addToCartButton.addEventListener('click', () => {
            console.log(`Item added to cart: ${foodItem.id}`);
            addItemToCart(foodItem);
            showCartSidebar()
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

    const quantityDisplay = document.createElement('div');
    quantityDisplay.innerHTML = `<p>${cartItem.quantity}</p>`;
    quantityDisplay.className = 'bg-white text-black text-xs h-6 w-8 flex justify-center items-center'

    const incrementButton = document.createElement('button');
    incrementButton.className = 'bg-gray-200 text-black h-8 w-6 flex justify-center items-center';
    incrementButton.innerHTML = '<span>+</span>';

    const deleteButton = document.createElement('button');
    deleteButton.className = 'absolute top-0 right-0 bg-white text-red-600 size-6 rounded-md p-[6px] translate-x-1/2 -translate-y-1/2';
    
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
    itemDetails.appendChild(deleteButton);

    // Append image and details to the cart item element
    cartItemElement.appendChild(itemImage);
    cartItemElement.appendChild(itemDetails);

    // Append the cart item element to the container
    cartItemsContainer.appendChild(cartItemElement);
  }

// Event listener for the close button
closeCartButton.addEventListener('click', hideCartSidebar);

// Event listener for the cartButton button
cartButton.addEventListener('click', showCartSidebar);
