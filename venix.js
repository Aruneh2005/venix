// Display Products (continued)
    filteredProducts = products.filter(product => 
        filter === 'all' || product.category === filter
    );

    if (filteredProducts.length === 0) {
        productsGrid.innerHTML = '<p class="no-products">No products found in this category.</p>';
        return;
    }

    filteredProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-image" style="background-image: url('${product.image}')">
                ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
                <button class="quick-view">Quick View</button>
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.title}</h3>
                <div class="product-price">
                    ${product.originalPrice ? 
                        `<span class="original-price">$${product.originalPrice.toFixed(2)}</span>` : ''}
                    <span>$${product.price.toFixed(2)}</span>
                </div>
                <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
            </div>
        `;
        productsGrid.appendChild(productCard);
    });

    // Add event listeners to new add-to-cart buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', addToCart);
    });

    // Quick view functionality
    document.querySelectorAll('.quick-view').forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const productId = parseInt(button.closest('.product-card').querySelector('.add-to-cart').dataset.id);
            const product = products.find(p => p.id === productId);
            showQuickView(product);
        });
    });
}

// Show Quick View Modal
function showQuickView(product) {
    const quickViewHTML = `
        <div class="quick-view-modal">
            <div class="quick-view-content">
                <button class="close-quick-view"><i class="fas fa-times"></i></button>
                <div class="quick-view-image" style="background-image: url('${product.image}')"></div>
                <div class="quick-view-details">
                    <h3>${product.title}</h3>
                    <div class="quick-view-price">
                        ${product.originalPrice ? 
                            `<span class="original-price">$${product.originalPrice.toFixed(2)}</span>` : ''}
                        <span>$${product.price.toFixed(2)}</span>
                    </div>
                    <p class="quick-view-description">Premium quality ${product.title.toLowerCase()} from Venix. Made with sustainable materials and designed for comfort.</p>
                    <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
                </div>
            </div>
        </div>
    `;

    const quickViewModal = document.createElement('div');
    quickViewModal.innerHTML = quickViewHTML;
    document.body.appendChild(quickViewModal);
    document.body.style.overflow = 'hidden';

    // Close modal
    document.querySelector('.close-quick-view').addEventListener('click', () => {
        document.body.removeChild(quickViewModal);
        document.body.style.overflow = 'auto';
    });

    // Add to cart from quick view
    document.querySelector('.quick-view-modal .add-to-cart').addEventListener('click', addToCart);
}

// Add to Cart Function
function addToCart(e) {
    const productId = parseInt(e.target.dataset.id);
    const product = products.find(p => p.id === productId);
    
    // Check if product already in cart
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    updateCart();
    showAddToCartAnimation(e.target);
}

// Show Add to Cart Animation
function showAddToCartAnimation(button) {
    button.textContent = 'Added!';
    button.style.backgroundColor = '#4CAF50';
    
    setTimeout(() => {
        button.textContent = 'Add to Cart';
        button.style.backgroundColor = '';
    }, 2000);
}

// Update Cart
function updateCart() {
    // Save cart to localStorage
    localStorage.setItem('venix-cart', JSON.stringify(cart));
    
    // Update cart count
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Update cart content
    if (cart.length === 0) {
        cartItems.innerHTML = '';
        document.querySelector('.cart-empty').style.display = 'flex';
        cartTotal.textContent = '$0.00';
        checkoutBtn.style.display = 'none';
    } else {
        document.querySelector('.cart-empty').style.display = 'none';
        cartItems.innerHTML = '';
        
        let totalPrice = 0;
        
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            totalPrice += itemTotal;
            
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="cart-item-img" style="background-image: url('${item.image}')"></div>
                <div class="cart-item-details">
                    <h4>${item.title}</h4>
                    <p class="cart-item-price">$${item.price.toFixed(2)}</p>
                    <button class="cart-item-remove" data-id="${item.id}">Remove</button>
                </div>
                <div class="cart-item-quantity">
                    <button class="decrement" data-id="${item.id}">-</button>
                    <span>${item.quantity}</span>
                    <button class="increment" data-id="${item.id}">+</button>
                </div>
            `;
            cartItems.appendChild(cartItem);
        });
        
        // Update total price
        cartTotal.textContent = `$${totalPrice.toFixed(2)}`;
        checkoutBtn.style.display = 'block';
        
        // Add event listeners to quantity buttons
        document.querySelectorAll('.cart-item-remove').forEach(button => {
            button.addEventListener('click', removeFromCart);
        });
        
        document.querySelectorAll('.increment').forEach(button => {
            button.addEventListener('click', incrementQuantity);
        });
        
        document.querySelectorAll('.decrement').forEach(button => {
            button.addEventListener('click', decrementQuantity);
        });
    }
}

// Remove from Cart
function removeFromCart(e) {
    const productId = parseInt(e.target.dataset.id);
    cart = cart.filter(item => item.id !== productId);
    updateCart();
}

// Increment Quantity
function incrementQuantity(e) {
    const productId = parseInt(e.target.dataset.id);
    const item = cart.find(item => item.id === productId);
    item.quantity += 1;
    updateCart();
}

// Decrement Quantity
function decrementQuantity(e) {
    const productId = parseInt(e.target.dataset.id);
    const item = cart.find(item => item.id === productId);
    
    if (item.quantity > 1) {
        item.quantity -= 1;
    } else {
        cart = cart.filter(item => item.id !== productId);
    }
    
    updateCart();
}

// Toggle Cart
cartIcon.addEventListener('click', () => {
    cartOverlay.classList.add('active');
    cart.classList.add('active');
});

closeCart.addEventListener('click', () => {
    cartOverlay.classList.remove('active');
    cart.classList.remove('active');
});

cartOverlay.addEventListener('click', () => {
    cartOverlay.classList.remove('active');
    cart.classList.remove('active');
});

// Checkout Button
checkoutBtn.addEventListener('click', () => {
    alert('Proceeding to checkout! In a real implementation, this would redirect to a checkout page.');
});

// Newsletter Form
document.querySelector('.newsletter-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = e.target.querySelector('input').value;
    // In a real implementation, you would send this to your backend
    alert(`Thanks for subscribing with ${email}! You'll receive 10% off your first order.`);
    e.target.reset();
});

// Load Cart from LocalStorage
function loadCart() {
    const savedCart = localStorage.getItem('venix-cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCart();
    }
}

// Initialize
function init() {
    loadCart();
    displayProducts();
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Run initialization when DOM is loaded
document.addEventListener('DOMContentLoaded', init);

// Animate elements when they come into view
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.collection-card, .product-card, .about-content');
    
    elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.2;
        
        if (elementPosition < screenPosition) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
};

// Set initial styles for animated elements
document.querySelectorAll('.collection-card, .product-card, .about-content').forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(50px)';
    element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
});

// Add scroll event listener
window.addEventListener('scroll', animateOnScroll);

// Trigger once on load in case elements are already in view
animateOnScroll();