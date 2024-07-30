// Class for Product
class Product {
  constructor(id, name, price, image, description) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.image = image;
    this.description = description;
  }
}

// Class for ShoppingCartItem
class ShoppingCartItem {
  constructor(product, quantity) {
    this.product = product;
    this.quantity = quantity;
  }

  // Method to calculate the total price of this item
  getTotalPrice() {
    return this.product.price * this.quantity;
  }
}

// Class for ShoppingCart
class ShoppingCart {
  constructor() {
    this.items = [];
  }

  // Method to get the total of items in the cart
  getTotal() {
    return this.items.reduce((total, item) => total + item.getTotalPrice(), 0);
  }

  // Method to add items to the cart
  addItem(product, quantity = 1) {
    const existingItem = this.items.find(item => item.product.id === product.id);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.items.push(new ShoppingCartItem(product, quantity));
    }
    this.updateUI();
  }

  // Method to remove items from the cart
  removeItem(productId) {
    this.items = this.items.filter(item => item.product.id !== productId);
    this.updateUI();
  }

  // Method to update the UI with the current cart status
  updateUI() {
    document.querySelector('.total').textContent = `${this.getTotal()} $`;

    // Render cart items
    this.renderCartItems();
  }

  // Method to render cart items
  renderCartItems() {
    const listProducts = document.querySelector('.list-products');
    listProducts.innerHTML = ''; // Clear current list

    this.items.forEach(item => {
      const card = document.createElement('div');
      card.classList.add('card-body');
      card.setAttribute('data-product-id', item.product.id);

      card.innerHTML = `
        <div class="card" style="width: 18rem">
          <img src="${item.product.image}" class="card-img-top" alt="${item.product.name}" />
          <div class="card-body">
            <h5 class="card-title">${item.product.name}</h5>
            <p class="card-text">${item.product.description}</p>
            <h4 class="unit-price">${item.product.price} $</h4>
            <div>
              <i class="fas fa-plus-circle plus-icon" data-product-id="${item.product.id}"></i>
              <span class="quantity">${item.quantity}</span>
              <i class="fas fa-minus-circle minus-icon" data-product-id="${item.product.id}"></i>
            </div>
            <div>
              <i class="fas fa-trash-alt delete-icon" data-product-id="${item.product.id}"></i>
              <i class="fas fa-heart heart-icon"></i>
            </div>
          </div>
        </div>
      `;

      listProducts.appendChild(card);
    });

    // Add event listeners after rendering
    this.addEventListeners();
  }

  // Method to add event listeners for cart interactions
  addEventListeners() {
    const plusIcons = document.querySelectorAll('.plus-icon');
    const minusIcons = document.querySelectorAll('.minus-icon');
    const deleteButtons = document.querySelectorAll('.delete-icon');
    const heartIcons = document.querySelectorAll('.heart-icon');

    plusIcons.forEach(icon => {
      icon.addEventListener('click', () => {
        const productId = icon.getAttribute('data-product-id');
        const product = this.getProductById(productId);
        this.addItem(product, 1);
      });
    });

    minusIcons.forEach(icon => {
      icon.addEventListener('click', () => {
        const productId = icon.getAttribute('data-product-id');
        const product = this.getProductById(productId);
        const item = this.items.find(item => item.product.id === productId);
        if (item && item.quantity > 0) {
          item.quantity -= 1;
          if (item.quantity === 0) {
            this.removeItem(productId);
          } else {
            this.updateUI();
          }
        }
      });
    });

    deleteButtons.forEach(button => {
      button.addEventListener('click', () => {
        const productId = button.getAttribute('data-product-id');
        this.removeItem(productId);
      });
    });

    heartIcons.forEach(icon => {
      icon.addEventListener('click', () => {
        icon.classList.toggle('liked');
        icon.classList.toggle('popped');
      });
    });
  }

  // Helper method to get a product by its ID
  getProductById(productId) {
    return products.find(product => product.id === productId);
  }
}

// Define the products
const products = [
  new Product('1', 'Sneakers', 100, '/assets/baskets.png', 'These are sneakers'),
  new Product('2', 'Socks', 20, '/assets/socks.png', 'This is a socks'),
  new Product('3', 'Bag', 50, '/assets/bag.png', 'This is a Bag')
];

// Create a shopping cart
const cart = new ShoppingCart();

// Example usage
cart.addItem(products[0], 1);
cart.addItem(products[1], 2);
cart.addItem(products[2], 1); // Ensure the bag is added

// Update the UI to reflect the initial state
cart.updateUI();
