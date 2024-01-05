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
  