// Variables globales
let products = [];
let cart = [];
let categories = [];
let isAdmin = false;
let editingProductId = null;
let editingCategoryId = null;

// Credenciales de administrador
const ADMIN_CREDENTIALS = {
    username: 'Celeste',
    password: '1234'
};

// Los productos se cargan desde localStorage

// Configuración de la tienda
const storeConfig = {
    address: "Av. Corrientes 1234, CABA",
    coordinates: { lat: -34.6037, lng: -58.3816 }, // Buenos Aires
    shippingRates: {
        base: 500, // Costo base
        perKm: 25  // Costo por kilómetro
    }
};

// Manejar formulario de contacto
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('contactName').value;
    const email = document.getElementById('contactEmail').value;
    const subject = document.getElementById('contactSubject').value;
    const message = document.getElementById('contactMessage').value;
    
    // Simular envío del mensaje
    alert(`¡Gracias ${name}! Tu mensaje ha sido enviado correctamente. Te contactaremos pronto a ${email}.`);
    
    // Limpiar formulario
    document.getElementById('contactForm').reset();
});

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Cargar categorías desde localStorage o usar predeterminadas
    const savedCategories = localStorage.getItem('categories');
    if (savedCategories) {
        categories = JSON.parse(savedCategories);
    } else {
        // Categorías predeterminadas
        categories = [
            {
                id: 1,
                name: 'Conjuntos',
                slug: 'conjuntos',
                description: 'Sets completos de lencería',
                image: 'category-conjuntos.jpg'
            },
            {
                id: 2,
                name: 'Bodys',
                slug: 'bodys',
                description: 'Piezas únicas tipo body',
                image: 'category-bodys.jpg'
            },
            {
                id: 3,
                name: 'Lencería Nocturna',
                slug: 'lenceria-nocturna',
                description: 'Camisones y pijamas elegantes',
                image: 'category-nocturna.jpg'
            },
            {
                id: 4,
                name: 'Accesorios',
                slug: 'accesorios',
                description: 'Medias, ligueros y complementos',
                image: 'category-accesorios.jpg'
            }
        ];
        saveCategories();
    }

    // Cargar productos desde localStorage
    const savedProducts = localStorage.getItem('products');
    if (savedProducts) {
        products = JSON.parse(savedProducts);
    }

    // Cargar carrito guardado
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartUI();
    }

    // Renderizar productos y categorías
    renderProducts();
    updateCategorySelectors();
    
    // Configurar event listeners
    setupEventListeners();
    
    // Actualizar estadísticas de admin
    updateAdminStats();
}

function setupEventListeners() {
    // Búsqueda
    document.getElementById('searchInput').addEventListener('input', handleSearch);
    
    // Filtros
    document.getElementById('categoryFilter').addEventListener('change', handleFilters);
    document.getElementById('priceFilter').addEventListener('change', handleFilters);
    
    // Filtro de estado de pedidos
    const orderStatusFilter = document.getElementById('orderStatusFilter');
    if (orderStatusFilter) {
        orderStatusFilter.addEventListener('change', handleOrderStatusFilter);
    }
    
    // Categorías
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', function() {
            const category = this.dataset.category;
            document.getElementById('categoryFilter').value = category;
            handleFilters();
            scrollToProducts();
        });
    });
    
    // Formularios
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('productForm').addEventListener('submit', handleProductForm);
}

// Funciones de productos
function renderProducts(productsToRender = products) {
    const grid = document.getElementById('productsGrid');
    
    if (productsToRender.length === 0) {
        grid.innerHTML = '<div class="no-products"><p>No se encontraron productos.</p></div>';
        return;
    }
    
    grid.innerHTML = productsToRender.map(product => `
        <div class="product-card" data-id="${product.id}">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" onerror="this.src='placeholder.svg'">
                ${product.featured ? '<div class="product-badge">Destacado</div>' : ''}
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <p class="product-description">${product.description}</p>
                <div class="product-sizes">
                    ${product.sizes.map(size => `
                        <span class="size-option" data-size="${size}">${size}</span>
                    `).join('')}
                </div>
                <button class="add-to-cart" onclick="addToCart(${product.id})">
                    <i class="fas fa-shopping-cart"></i> Añadir al Carrito
                </button>
            </div>
        </div>
    `).join('');
    
    // Configurar selección de tallas
    setupSizeSelection();
}

function setupSizeSelection() {
    document.querySelectorAll('.size-option').forEach(option => {
        option.addEventListener('click', function() {
            // Deseleccionar otras tallas del mismo producto
            const productCard = this.closest('.product-card');
            productCard.querySelectorAll('.size-option').forEach(opt => opt.classList.remove('selected'));
            
            // Seleccionar esta talla
            this.classList.add('selected');
        });
    });
}

function handleSearch() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm)
    );
    renderProducts(filteredProducts);
}

function handleFilters() {
    const categoryFilter = document.getElementById('categoryFilter').value;
    const priceFilter = document.getElementById('priceFilter').value;
    
    let filteredProducts = [...products];
    
    // Filtro por categoría
    if (categoryFilter !== 'all') {
        filteredProducts = filteredProducts.filter(product => product.category === categoryFilter);
    }
    
    // Filtro por precio
    if (priceFilter !== 'all') {
        const [min, max] = priceFilter.split('-').map(p => p === '+' ? Infinity : parseFloat(p));
        filteredProducts = filteredProducts.filter(product => {
            if (max === undefined) return product.price >= min;
            return product.price >= min && product.price <= max;
        });
    }
    
    renderProducts(filteredProducts);
}

// Función para manejar el filtro de estado de pedidos
function handleOrderStatusFilter() {
    renderAdminOrders();
}

// Funciones del carrito
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const productCard = document.querySelector(`[data-id="${productId}"]`);
    const selectedSize = productCard.querySelector('.size-option.selected');
    
    if (!selectedSize) {
        alert('Por favor, selecciona una talla.');
        return;
    }
    
    const size = selectedSize.dataset.size;
    const existingItem = cart.find(item => item.id === productId && item.size === size);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: productId,
            name: product.name,
            price: product.price,
            image: product.image,
            size: size,
            quantity: 1
        });
    }
    
    saveCart();
    updateCartUI();
    
    // Animación de éxito
    const button = productCard.querySelector('.add-to-cart');
    const originalText = button.innerHTML;
    button.innerHTML = '<i class="fas fa-check"></i> ¡Añadido!';
    button.style.background = '#27ae60';
    
    setTimeout(() => {
        button.innerHTML = originalText;
        button.style.background = '';
    }, 1500);
}

function updateCartUI() {
    const cartCount = document.getElementById('cartCount');
    const cartItems = document.getElementById('cartItems');
    const subtotalElement = document.getElementById('subtotal');
    const shippingCostElement = document.getElementById('shipping-cost');
    const totalFinalElement = document.getElementById('total-final');
    
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    cartCount.textContent = totalItems;
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<div class="empty-cart"><p>Tu carrito está vacío</p></div>';
        if (subtotalElement) subtotalElement.textContent = '$0';
        if (shippingCostElement) shippingCostElement.textContent = '$0';
        if (totalFinalElement) totalFinalElement.textContent = '$0';
        return;
    }
    
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-size">Talla: ${item.size}</div>
                <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                <div class="cart-item-controls">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, '${item.size}', -1)">
                        <i class="fas fa-minus"></i>
                    </button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, '${item.size}', 1)">
                        <i class="fas fa-plus"></i>
                    </button>
                    <button class="quantity-btn" onclick="removeFromCart(${item.id}, '${item.size}')" style="margin-left: 10px; background: #e74c3c; color: white;">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
    
    // Actualizar subtotal
    if (subtotalElement) {
        subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    }
    
    // Calcular envío estimado (se actualizará en el checkout)
    const estimatedShipping = storeConfig.shippingRates.base;
    if (shippingCostElement) {
        shippingCostElement.textContent = `$${estimatedShipping}`;
    }
    
    // Total final
    const totalFinal = subtotal + estimatedShipping;
    if (totalFinalElement) {
        totalFinalElement.textContent = `$${totalFinal.toFixed(2)}`;
    }
}

function updateQuantity(productId, size, change) {
    const item = cart.find(item => item.id === productId && item.size === size);
    if (!item) return;
    
    item.quantity += change;
    
    if (item.quantity <= 0) {
        removeFromCart(productId, size);
        return;
    }
    
    saveCart();
    updateCartUI();
}

function removeFromCart(productId, size) {
    cart = cart.filter(item => !(item.id === productId && item.size === size));
    saveCart();
    updateCartUI();
}

function toggleCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    cartSidebar.classList.toggle('open');
}

function checkout() {
    if (cart.length === 0) {
        alert('Tu carrito está vacío.');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    const message = `¡Gracias por tu compra!\n\nResumen del pedido:\n${itemCount} artículos\nTotal: $${total.toFixed(2)}\n\nTe contactaremos pronto para coordinar el envío.`;
    
    alert(message);
    
    // Limpiar carrito
    cart = [];
    saveCart();
    updateCartUI();
    toggleCart();
}

// Funciones de autenticación
function showLoginModal() {
    document.getElementById('loginModal').classList.add('show');
}

function closeLoginModal() {
    document.getElementById('loginModal').classList.remove('show');
    document.getElementById('loginForm').reset();
}

function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
        isAdmin = true;
        closeLoginModal();
        showAdminPanel();
    } else {
        alert('Credenciales incorrectas. Inténtalo de nuevo.');
    }
}

// Funciones del panel de administración
function showAdminPanel() {
    document.getElementById('adminPanel').classList.add('show');
    renderAdminProducts();
    updateAdminStats();
}

function closeAdminPanel() {
    document.getElementById('adminPanel').classList.remove('show');
    isAdmin = false;
}

function showTab(tabName) {
    // Ocultar todas las pestañas
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.style.display = 'none';
    });
    
    // Remover clase activa de todos los botones
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Mostrar pestaña seleccionada
    document.getElementById(tabName + 'Tab').style.display = 'block';
    
    // Activar botón correspondiente
    event.target.classList.add('active');
    
    // Cargar contenido específico
    if (tabName === 'products') {
        renderAdminProducts();
    } else if (tabName === 'categories') {
        renderAdminCategories();
    } else if (tabName === 'orders') {
        renderAdminOrders();
    } else if (tabName === 'analytics') {
        updateAdminStats();
    }
}

function renderAdminProducts() {
    const list = document.getElementById('adminProductsList');
    
    list.innerHTML = products.map(product => {
        const stockStatus = product.stock === 0 ? 'sin-stock' : product.stock <= 5 ? 'stock-bajo' : 'stock-ok';
        const stockAlert = product.stock === 0 ? 
            `<div class="stock-alert">⚠️ Sin stock - Reposición: ${new Date(product.restockDate).toLocaleDateString('es-ES')}</div>` : 
            product.stock <= 5 ? 
            `<div class="stock-warning">⚠️ Stock bajo (${product.stock} unidades)</div>` : '';
        
        return `
            <div class="admin-product-item ${stockStatus}">
                <img src="${product.image}" alt="${product.name}" class="admin-product-image">
                <div class="admin-product-info">
                    <div class="admin-product-name">${product.name}</div>
                    <div class="admin-product-details">
                        Precio: $${product.price.toFixed(2)} | Stock: <span class="stock-count">${product.stock}</span> | Categoría: ${product.category}
                    </div>
                    ${stockAlert}
                </div>
                <div class="admin-product-actions">
                    <button class="edit-btn" onclick="editProduct(${product.id})">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                    <button class="delete-btn" onclick="deleteProduct(${product.id})">
                        <i class="fas fa-trash"></i> Eliminar
                    </button>
                    <button class="stock-btn" onclick="updateStock(${product.id})">
                        <i class="fas fa-boxes"></i> Stock
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

function showAddProductForm() {
    editingProductId = null;
    document.getElementById('productModalTitle').textContent = 'Añadir Producto';
    document.getElementById('productForm').reset();
    
    // Limpiar selección de tallas
    document.querySelectorAll('.sizes-checkboxes input').forEach(checkbox => {
        checkbox.checked = false;
    });
    
    document.getElementById('productModal').classList.add('show');
}

function editProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    editingProductId = productId;
    document.getElementById('productModalTitle').textContent = 'Editar Producto';
    
    // Llenar formulario con datos del producto
    document.getElementById('productName').value = product.name;
    document.getElementById('productCategory').value = product.category;
    document.getElementById('productStock').value = product.stock;
    document.getElementById('productDescription').value = product.description;
    document.getElementById('productImage').value = product.image;
    
    // Cargar precios
    document.getElementById('productPurchasePrice').value = product.purchasePrice || '';
    document.getElementById('productMargin').value = product.margin || '';
    document.getElementById('productFinalPrice').value = product.price || '';
    
    // Cargar talles personalizados
    currentSizes = product.sizes ? [...product.sizes] : [];
    renderSizesList();
    
    document.getElementById('productModal').classList.add('show');
}

function deleteProduct(productId) {
    if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
        products = products.filter(p => p.id !== productId);
        saveProducts();
        renderProducts();
        renderAdminProducts();
        updateAdminStats();
    }
}

// Función para actualizar stock
function updateStock(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const newStock = prompt(`Stock actual de "${product.name}": ${product.stock}\n\nIngresa el nuevo stock:`, product.stock);
    
    if (newStock !== null && !isNaN(newStock) && parseInt(newStock) >= 0) {
        const oldStock = product.stock;
        product.stock = parseInt(newStock);
        
        // Si el stock cambió de 0 a mayor que 0, actualizar fecha de reposición
        if (oldStock === 0 && product.stock > 0) {
            product.restockDate = new Date().toISOString().split('T')[0];
        }
        
        // Si el stock es 0, pedir fecha de reposición
        if (product.stock === 0) {
            const restockDate = prompt('El producto quedó sin stock. Ingresa la fecha estimada de reposición (YYYY-MM-DD):', product.restockDate);
            if (restockDate) {
                product.restockDate = restockDate;
            }
        }
        
        saveProducts();
        renderProducts();
        renderAdminProducts();
        updateAdminStats();
    }
}

function handleProductForm(e) {
    e.preventDefault();
    
    const selectedSizes = getCurrentSizes();
    
    if (selectedSizes.length === 0) {
        alert('Por favor, añade al menos una talla.');
        return;
    }
    
    const purchasePrice = parseFloat(document.getElementById('productPurchasePrice').value);
    const margin = parseFloat(document.getElementById('productMargin').value);
    const finalPrice = calculateFinalPrice(purchasePrice, margin);
    
    const productData = {
        name: document.getElementById('productName').value,
        price: finalPrice,
        purchasePrice: purchasePrice,
        margin: margin,
        category: document.getElementById('productCategory').value,
        stock: parseInt(document.getElementById('productStock').value),
        description: document.getElementById('productDescription').value,
        image: document.getElementById('productImage').value,
        sizes: selectedSizes,
        featured: false
    };
    
    if (editingProductId) {
        // Editar producto existente
        const productIndex = products.findIndex(p => p.id === editingProductId);
        products[productIndex] = { ...products[productIndex], ...productData };
    } else {
        // Añadir nuevo producto
        const newId = Math.max(...products.map(p => p.id), 0) + 1;
        products.push({ id: newId, ...productData });
    }
    
    saveProducts();
    renderProducts();
    renderAdminProducts();
    updateAdminStats();
    closeProductModal();
}

function closeProductModal() {
    document.getElementById('productModal').classList.remove('show');
    editingProductId = null;
    clearSizesList();
}

// Gestión de talles personalizados
let currentSizes = [];

function addSize() {
    const sizeInput = document.getElementById('sizeInput');
    const sizeValue = sizeInput.value.trim();
    
    if (sizeValue && !currentSizes.includes(sizeValue)) {
        currentSizes.push(sizeValue);
        renderSizesList();
        sizeInput.value = '';
    }
}

function removeSize(size) {
    currentSizes = currentSizes.filter(s => s !== size);
    renderSizesList();
}

function renderSizesList() {
    const sizesList = document.getElementById('sizesList');
    sizesList.innerHTML = '';
    
    currentSizes.forEach(size => {
        const sizeTag = document.createElement('div');
        sizeTag.className = 'size-tag';
        sizeTag.innerHTML = `
            <span>${size}</span>
            <button class="remove-size" onclick="removeSize('${size}')">&times;</button>
        `;
        sizesList.appendChild(sizeTag);
    });
}

function addPresetSizes(type) {
    let presetSizes = [];
    
    switch(type) {
        case 'letters':
            presetSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
            break;
        case 'numbers':
            presetSizes = ['85', '90', '95', '100'];
            break;
        case 'unique':
            presetSizes = ['Único'];
            break;
    }
    
    presetSizes.forEach(size => {
        if (!currentSizes.includes(size)) {
            currentSizes.push(size);
        }
    });
    
    renderSizesList();
}

function getCurrentSizes() {
    return currentSizes;
}

function clearSizesList() {
    currentSizes = [];
    renderSizesList();
}

// Gestión de precios con margen
function calculateFinalPrice(purchasePrice, margin) {
    return purchasePrice * (1 + margin / 100);
}

function updatePriceCalculation() {
    const purchasePrice = parseFloat(document.getElementById('productPurchasePrice').value) || 0;
    const margin = parseFloat(document.getElementById('productMargin').value) || 0;
    const finalPrice = calculateFinalPrice(purchasePrice, margin);
    
    document.getElementById('productFinalPrice').value = finalPrice.toFixed(2);
}

// Event listeners para cálculo automático de precios
document.addEventListener('DOMContentLoaded', function() {
    const purchasePriceInput = document.getElementById('productPurchasePrice');
    const marginInput = document.getElementById('productMargin');
    
    if (purchasePriceInput && marginInput) {
        purchasePriceInput.addEventListener('input', updatePriceCalculation);
        marginInput.addEventListener('input', updatePriceCalculation);
    }
    
    // Event listener para añadir talla con Enter
    const sizeInput = document.getElementById('sizeInput');
    if (sizeInput) {
        sizeInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                addSize();
            }
        });
    }
});

function updateAdminStats() {
    // Total de productos
    document.getElementById('totalProducts').textContent = products.length;
    
    // Cargar pedidos para calcular estadísticas reales
    const orders = loadOrders();
    
    // Calcular ventas del mes actual
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const monthlySales = orders
        .filter(order => {
            const orderDate = new Date(order.date);
            return orderDate.getMonth() === currentMonth && 
                   orderDate.getFullYear() === currentYear &&
                   (order.status === 'shipped' || order.status === 'delivered');
        })
        .reduce((total, order) => total + order.total, 0);
    
    document.getElementById('monthlySales').textContent = '$' + monthlySales.toFixed(2);
    
    // Contar pedidos pendientes
    const pendingOrders = orders.filter(order => order.status === 'pending').length;
    document.getElementById('pendingOrders').textContent = pendingOrders;
}

// Función para renderizar pedidos en el panel de administración
function renderAdminOrders() {
    const ordersList = document.getElementById('adminOrdersList');
    
    if (!ordersList) return;
    
    // Cargar pedidos reales desde localStorage
    let orders = loadOrders();
    
    // Aplicar filtro de estado si existe
    const statusFilter = document.getElementById('orderStatusFilter');
    if (statusFilter && statusFilter.value !== 'all') {
        orders = orders.filter(order => order.status === statusFilter.value);
    }
    
    if (orders.length === 0) {
        ordersList.innerHTML = '<div class="no-orders"><p>No hay pedidos registrados.</p></div>';
        return;
    }
    
    ordersList.innerHTML = orders.map(order => {
        const statusClass = {
            'pending': 'status-pending',
            'shipped': 'status-shipped',
            'delivered': 'status-delivered'
        }[order.status];
        
        const statusText = {
            'pending': 'Pendiente',
            'shipped': 'Enviado',
            'delivered': 'Entregado'
        }[order.status];
        
        return `
            <div class="admin-order-item">
                <div class="order-header">
                    <div class="order-id">#${order.id}</div>
                    <div class="order-status ${statusClass}">${statusText}</div>
                    <div class="order-date">${new Date(order.date).toLocaleDateString('es-ES')}</div>
                </div>
                <div class="order-customer">
                    <strong>${order.customer}</strong><br>
                    📧 ${order.email}<br>
                    📞 ${order.phone}<br>
                    📍 ${order.address}
                </div>
                <div class="order-items">
                    <h4>Productos:</h4>
                    ${order.items.map(item => `
                        <div class="order-item">
                            ${item.name} (${item.size}) x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}
                        </div>
                    `).join('')}
                </div>
                <div class="order-total">
                    <strong>Subtotal: $${order.subtotal.toFixed(2)}</strong><br>
                    <strong>Envío: $${order.shippingCost.toFixed(2)}</strong><br>
                    <strong>Total: $${order.total.toFixed(2)}</strong>
                </div>
                <div class="order-actions">
                    <button class="btn-secondary" onclick="updateOrderStatus('${order.id}')">
                        <i class="fas fa-edit"></i> Cambiar Estado
                    </button>
                    <button class="btn-primary" onclick="viewOrderDetails('${order.id}')">
                        <i class="fas fa-eye"></i> Ver Detalles
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// Función para actualizar estado de pedido
function updateOrderStatus(orderId) {
    const newStatus = prompt('Selecciona el nuevo estado:\n1. Pendiente\n2. Enviado\n3. Entregado\n\nIngresa el número (1-3):');
    
    const statusMap = {
        '1': 'pending',
        '2': 'shipped', 
        '3': 'delivered'
    };
    
    if (statusMap[newStatus]) {
        const orders = loadOrders();
        const orderIndex = orders.findIndex(order => order.id === orderId);
        
        if (orderIndex !== -1) {
            orders[orderIndex].status = statusMap[newStatus];
            saveOrders(orders);
            alert(`Estado del pedido #${orderId} actualizado correctamente.`);
            renderAdminOrders(); // Recargar la lista
        }
    }
}

// Función para ver detalles del pedido
function viewOrderDetails(orderId) {
    const orders = loadOrders();
    const order = orders.find(o => o.id === orderId);
    
    if (!order) {
        alert('Pedido no encontrado.');
        return;
    }
    
    // Llenar los datos del modal
    document.getElementById('orderDetailsId').textContent = `#${order.id}`;
    document.getElementById('orderDetailsCustomer').textContent = order.customer;
    document.getElementById('orderDetailsEmail').textContent = order.email;
    document.getElementById('orderDetailsPhone').textContent = order.phone;
    
    // Método de entrega
    const deliveryText = order.deliveryMethod === 'pickup' ? 'Retiro en Tienda' : 'Envío a Domicilio';
    document.getElementById('orderDetailsDelivery').textContent = deliveryText;
    
    // Mostrar dirección solo si es envío a domicilio
    const addressItem = document.getElementById('orderDetailsAddressItem');
    if (order.deliveryMethod === 'home' && order.address) {
        document.getElementById('orderDetailsAddress').textContent = order.address;
        addressItem.style.display = 'block';
    } else {
        addressItem.style.display = 'none';
    }
    
    // Estado del pedido
    const statusElement = document.getElementById('orderDetailsStatus');
    const statusText = {
        'pending': 'Pendiente',
        'shipped': 'Enviado',
        'delivered': 'Entregado'
    }[order.status];
    
    const statusClass = {
        'pending': 'status-pending',
        'shipped': 'status-shipped',
        'delivered': 'status-delivered'
    }[order.status];
    
    statusElement.textContent = statusText;
    statusElement.className = `order-status ${statusClass}`;
    
    // Fecha del pedido
    document.getElementById('orderDetailsDate').textContent = new Date(order.date).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    // Productos del pedido
    const itemsContainer = document.getElementById('orderDetailsItems');
    itemsContainer.innerHTML = order.items.map(item => `
        <div class="order-details-item">
            <div class="order-details-item-info">
                <div class="order-details-item-name">${item.name}</div>
                <div class="order-details-item-details">
                    Talla: ${item.size} | Cantidad: ${item.quantity} | Precio unitario: $${item.price.toFixed(2)}
                </div>
            </div>
            <div class="order-details-item-price">
                $${(item.price * item.quantity).toFixed(2)}
            </div>
        </div>
    `).join('');
    
    // Totales
    document.getElementById('orderDetailsSubtotal').textContent = `$${order.subtotal.toFixed(2)}`;
    document.getElementById('orderDetailsShipping').textContent = `$${order.shippingCost.toFixed(2)}`;
    document.getElementById('orderDetailsTotal').textContent = `$${order.total.toFixed(2)}`;
    
    // Mostrar el modal
    document.getElementById('orderDetailsModal').classList.add('show');
}

// Función para cerrar modal de detalles del pedido
function closeOrderDetailsModal() {
    document.getElementById('orderDetailsModal').classList.remove('show');
}

// Función para imprimir detalles del pedido
function printOrderDetails() {
    const orderId = document.getElementById('orderDetailsId').textContent;
    const printContent = document.querySelector('#orderDetailsModal .order-details-content').innerHTML;
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
            <head>
                <title>Pedido ${orderId} - Anyta Lingerie</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; }
                    .order-details-section { margin-bottom: 20px; }
                    .order-details-section h4 { color: #2c3e50; border-bottom: 1px solid #eee; padding-bottom: 5px; }
                    .details-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
                    .detail-item { margin-bottom: 10px; }
                    .detail-item label { font-weight: bold; }
                    .order-details-item { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
                    .order-details-actions { display: none; }
                    .total-item span { font-weight: bold; color: #155724; }
                </style>
            </head>
            <body>
                <h1>Anyta Lingerie - Detalles del Pedido</h1>
                ${printContent}
            </body>
        </html>
    `);
    
    printWindow.document.close();
    printWindow.print();
}

// Funciones de utilidad
function scrollToProducts() {
    document.getElementById('productos').scrollIntoView({ behavior: 'smooth' });
}

function saveProducts() {
    localStorage.setItem('products', JSON.stringify(products));
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Funciones para manejar pedidos en localStorage
function saveOrder(order) {
    const orders = loadOrders();
    orders.unshift(order); // Agregar al inicio para mostrar los más recientes primero
    saveOrders(orders);
}

function loadOrders() {
    const savedOrders = localStorage.getItem('orders');
    return savedOrders ? JSON.parse(savedOrders) : [];
}

function saveOrders(orders) {
    localStorage.setItem('orders', JSON.stringify(orders));
}

// Cerrar modales al hacer clic fuera
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('show');
    }
});

// Cerrar carrito al hacer clic fuera
document.addEventListener('click', function(e) {
    const cartSidebar = document.getElementById('cartSidebar');
    const cartIcon = document.querySelector('.cart-icon');
    
    if (!cartSidebar.contains(e.target) && !cartIcon.contains(e.target)) {
        cartSidebar.classList.remove('open');
    }
});

// Prevenir cierre del carrito al hacer clic dentro
document.getElementById('cartSidebar').addEventListener('click', function(e) {
    e.stopPropagation();
});

// Funciones adicionales para mejorar la experiencia
function toggleFeatured(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        product.featured = !product.featured;
        saveProducts();
        renderProducts();
        renderAdminProducts();
    }
}

// Función para generar productos aleatorios (para demo)
function generateRandomProduct() {
    const names = ['Conjunto Elegante', 'Body Seductor', 'Camisón Romántico', 'Lencería Premium'];
    const categories = ['conjuntos', 'bodys', 'lenceria-nocturna', 'accesorios'];
    const colors = ['Negro', 'Rojo', 'Blanco', 'Rosa', 'Azul', 'Violeta'];
    
    const randomName = names[Math.floor(Math.random() * names.length)];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    
    return {
        id: Date.now(),
        name: `${randomName} ${randomColor}`,
        price: Math.random() * 150 + 30,
        category: randomCategory,
        description: 'Producto generado automáticamente para demostración.',
        image: 'placeholder.svg',
        stock: Math.floor(Math.random() * 20) + 1,
        sizes: ['S', 'M', 'L'],
        featured: Math.random() > 0.7
    };
}

// Función para mostrar detalles del producto
function showProductDetails(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    document.getElementById('modalProductName').textContent = product.name;
    document.getElementById('modalProductPrice').textContent = `$${product.price}`;
    document.getElementById('modalProductDescription').textContent = product.description;
    document.getElementById('modalProductImage').src = product.image;
    
    // Mostrar información de stock
    const stockInfo = document.getElementById('stockInfo');
    const stockCount = document.getElementById('stockCount');
    const outOfStockAlert = document.getElementById('outOfStockAlert');
    const restockDate = document.getElementById('restockDate');
    
    stockCount.textContent = product.stock;
    
    if (product.stock === 0) {
        stockInfo.style.display = 'none';
        outOfStockAlert.style.display = 'block';
        restockDate.textContent = new Date(product.restockDate).toLocaleDateString('es-ES');
    } else {
        stockInfo.style.display = 'block';
        outOfStockAlert.style.display = 'none';
    }
    
    // Mostrar tallas disponibles
    const sizesContainer = document.getElementById('modalProductSizes');
    sizesContainer.innerHTML = '';
    product.sizes.forEach(size => {
        const sizeBtn = document.createElement('button');
        sizeBtn.className = 'size-btn';
        sizeBtn.textContent = size;
        sizeBtn.disabled = product.stock === 0;
        sizeBtn.onclick = () => {
            if (product.stock > 0) {
                document.querySelectorAll('.size-btn').forEach(btn => btn.classList.remove('selected'));
                sizeBtn.classList.add('selected');
            }
        };
        sizesContainer.appendChild(sizeBtn);
    });
    
    // Deshabilitar botón de agregar al carrito si no hay stock
    const addToCartBtn = document.querySelector('#productDetailModal .btn-primary');
    if (addToCartBtn) {
        addToCartBtn.disabled = product.stock === 0;
        addToCartBtn.textContent = product.stock === 0 ? 'Sin Stock' : 'Agregar al Carrito';
    }
    
    document.getElementById('productDetailModal').classList.add('show');
}

function closeProductDetailModal() {
    document.getElementById('productDetailModal').classList.remove('show');
}

function addToCartFromModal() {
    const productName = document.getElementById('modalProductName').textContent;
    const selectedSizeBtn = document.querySelector('#modalProductSizes .size-btn.selected');
    const product = products.find(p => p.name === productName);
    
    if (!selectedSizeBtn) {
        alert('Por favor, selecciona una talla.');
        return;
    }
    
    if (product && selectedSizeBtn) {
        const selectedSize = selectedSizeBtn.textContent;
        const existingItem = cart.find(item => item.id === product.id && item.size === selectedSize);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                size: selectedSize,
                quantity: 1
            });
        }
        
        saveCart();
        updateCartUI();
        closeProductDetailModal();
        
        // Mostrar mensaje de éxito
        alert('¡Producto añadido al carrito!');
    }
}

// Función para calcular costo de envío
function calculateShipping(address) {
    // Simulación de cálculo de distancia (en una implementación real usarías Google Maps API)
    const distance = Math.random() * 20 + 5; // 5-25 km
    const shippingCost = storeConfig.shippingRates.base + (distance * storeConfig.shippingRates.perKm);
    
    return {
        distance: distance.toFixed(1),
        cost: shippingCost.toFixed(2)
    };
}

// Función mejorada de checkout con formulario completo
function proceedToCheckout() {
    if (cart.length === 0) {
        alert('Tu carrito está vacío.');
        return;
    }
    
    // Verificar stock disponible
    const stockIssues = [];
    cart.forEach(cartItem => {
        const product = products.find(p => p.id === cartItem.id);
        if (!product || product.stock < cartItem.quantity) {
            stockIssues.push(cartItem.name);
        }
    });
    
    if (stockIssues.length > 0) {
        alert(`Los siguientes productos no tienen stock suficiente: ${stockIssues.join(', ')}`);
        return;
    }
    
    document.getElementById('checkoutModal').classList.add('show');
    updateCheckoutSummary();
}

// Función para actualizar resumen de checkout
function updateCheckoutSummary() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    document.getElementById('checkoutSubtotal').textContent = subtotal.toFixed(2);
    document.getElementById('checkoutItemCount').textContent = itemCount;
    
    // Calcular envío si hay dirección
    const address = document.getElementById('shippingAddress').value;
    if (address.trim()) {
        const shipping = calculateShipping(address);
        document.getElementById('shippingCost').textContent = shipping.cost;
        document.getElementById('shippingDistance').textContent = shipping.distance;
        document.getElementById('shippingInfo').style.display = 'block';
        
        const total = subtotal + parseFloat(shipping.cost);
        document.getElementById('checkoutTotal').textContent = total.toFixed(2);
    } else {
        document.getElementById('shippingInfo').style.display = 'none';
        document.getElementById('checkoutTotal').textContent = subtotal.toFixed(2);
    }
}

// Función para procesar el pedido final
function processOrder(event) {
    if (event) {
        event.preventDefault();
    }
    
    const form = document.getElementById('checkoutForm');
    const formData = new FormData(form);
    
    // Validar campos requeridos
    const requiredFields = ['firstName', 'lastName', 'email', 'phone'];
    const missingFields = requiredFields.filter(field => !formData.get(field));
    
    // Validar dirección si es envío a domicilio
    const deliveryMethod = formData.get('delivery');
    if (deliveryMethod === 'home') {
        const addressFields = ['address', 'city', 'postalCode'];
        const missingAddressFields = addressFields.filter(field => !formData.get(field));
        missingFields.push(...missingAddressFields);
    }
    
    if (missingFields.length > 0) {
        alert('Por favor, completa todos los campos requeridos.');
        return;
    }
    
    // Actualizar stock de productos
    cart.forEach(cartItem => {
        const product = products.find(p => p.id === cartItem.id);
        if (product) {
            product.stock -= cartItem.quantity;
        }
    });
    
    saveProducts();
    
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    let shipping = { cost: '0' };
    let shippingInfo = '';
    
    // Calcular envío solo si es entrega a domicilio
    if (deliveryMethod === 'home') {
        const fullAddress = `${formData.get('address')}, ${formData.get('city')}, CP: ${formData.get('postalCode')}`;
        shipping = calculateShipping(fullAddress);
        shippingInfo = `\nDirección: ${fullAddress}`;
    } else {
        shippingInfo = '\nRetiro en tienda: Av. Corrientes 1234, CABA';
    }
    
    const total = subtotal + parseFloat(shipping.cost);
    
    // Generar número de pedido
    const orderNumber = 'CL' + Date.now().toString().slice(-6);
    
    const customerName = `${formData.get('firstName')} ${formData.get('lastName')}`;
    
    // Crear objeto del pedido
    const order = {
        id: orderNumber,
        customer: customerName,
        email: formData.get('email'),
        phone: formData.get('phone'),
        address: deliveryMethod === 'home' ? `${formData.get('address')}, ${formData.get('city')}, CP: ${formData.get('postalCode')}` : 'Retiro en tienda: Av. Corrientes 1234, CABA',
        deliveryMethod: deliveryMethod,
        items: cart.map(item => ({
            name: item.name,
            size: item.size,
            quantity: item.quantity,
            price: item.price
        })),
        subtotal: subtotal,
        shippingCost: parseFloat(shipping.cost),
        total: total,
        status: 'pending',
        date: new Date().toISOString().split('T')[0]
    };
    
    // Guardar pedido en localStorage
    saveOrder(order);
    
    const orderSummary = `
¡Pedido confirmado! 🎉

Número de pedido: ${orderNumber}
Cliente: ${customerName}
Email: ${formData.get('email')}
Teléfono: ${formData.get('phone')}${shippingInfo}

Productos:
${cart.map(item => `- ${item.name} (${item.size}) x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}`).join('\n')}

Subtotal: $${subtotal.toFixed(2)}
Envío: $${shipping.cost}
Total: $${total.toFixed(2)}

Te contactaremos pronto para coordinar la entrega.
¡Gracias por tu compra! ✨`;
    
    alert(orderSummary);
    
    // Limpiar carrito y cerrar modales
    cart = [];
    saveCart();
    updateCartUI();
    closeCheckoutModal();
    toggleCart();
    renderProducts(); // Actualizar vista de productos con nuevo stock
}

// Función para cerrar modal de checkout
function closeCheckoutModal() {
    document.getElementById('checkoutModal').classList.remove('show');
    document.getElementById('checkoutForm').reset();
    // Ocultar sección de dirección al cerrar
    document.getElementById('addressSection').style.display = 'none';
}

// Función para actualizar método de entrega
function updateDeliveryMethod() {
    const deliveryMethod = document.querySelector('input[name="delivery"]:checked').value;
    const addressSection = document.getElementById('addressSection');
    
    if (deliveryMethod === 'home') {
        addressSection.style.display = 'block';
    } else {
        addressSection.style.display = 'none';
    }
    
    // Actualizar resumen si está visible
    if (document.getElementById('checkoutModal').classList.contains('show')) {
        updateOrderSummary();
    }
}

// ===== GESTIÓN DE CATEGORÍAS =====

// Función para guardar categorías
function saveCategories() {
    localStorage.setItem('categories', JSON.stringify(categories));
}

// Función para actualizar los selectores de categorías
function updateCategorySelectors() {
    const categoryFilter = document.getElementById('categoryFilter');
    const productCategory = document.getElementById('productCategory');
    
    // Limpiar opciones existentes
    categoryFilter.innerHTML = '<option value="all">Todas las categorías</option>';
    productCategory.innerHTML = '';
    
    // Añadir categorías dinámicamente
    categories.forEach(category => {
        // Filtro de productos
        const filterOption = document.createElement('option');
        filterOption.value = category.slug;
        filterOption.textContent = category.name;
        categoryFilter.appendChild(filterOption);
        
        // Selector en formulario de productos
        const productOption = document.createElement('option');
        productOption.value = category.slug;
        productOption.textContent = category.name;
        productCategory.appendChild(productOption);
    });
    
    // Actualizar tarjetas de categorías en la página principal
    updateCategoryCards();
}

// Función para actualizar las tarjetas de categorías
function updateCategoryCards() {
    const categoryGrid = document.querySelector('.category-grid');
    if (!categoryGrid) return;
    
    categoryGrid.innerHTML = '';
    
    categories.forEach(category => {
        const categoryCard = document.createElement('div');
        categoryCard.className = 'category-card';
        categoryCard.setAttribute('data-category', category.slug);
        categoryCard.innerHTML = `
            <img src="${category.image}" alt="${category.name}">
            <h3>${category.name}</h3>
        `;
        
        // Añadir event listener
        categoryCard.addEventListener('click', function() {
            const categorySlug = this.dataset.category;
            document.getElementById('categoryFilter').value = categorySlug;
            handleFilters();
            scrollToProducts();
        });
        
        categoryGrid.appendChild(categoryCard);
    });
}

// Función para mostrar el formulario de añadir categoría
function showAddCategoryForm() {
    editingCategoryId = null;
    document.getElementById('categoryModalTitle').textContent = 'Añadir Categoría';
    document.getElementById('categoryForm').reset();
    document.getElementById('categoryModal').classList.add('show');
}

// Función para mostrar el formulario de editar categoría
function showEditCategoryForm(categoryId) {
    const category = categories.find(c => c.id === categoryId);
    if (!category) return;
    
    editingCategoryId = categoryId;
    document.getElementById('categoryModalTitle').textContent = 'Editar Categoría';
    document.getElementById('categoryName').value = category.name;
    document.getElementById('categorySlug').value = category.slug;
    document.getElementById('categoryDescription').value = category.description || '';
    document.getElementById('categoryImage').value = category.image || '';
    document.getElementById('categoryModal').classList.add('show');
}

// Función para cerrar el modal de categorías
function closeCategoryModal() {
    document.getElementById('categoryModal').classList.remove('show');
    editingCategoryId = null;
}

// Función para manejar el formulario de categorías
function handleCategoryForm(event) {
    event.preventDefault();
    
    const name = document.getElementById('categoryName').value.trim();
    const slug = document.getElementById('categorySlug').value.trim();
    const description = document.getElementById('categoryDescription').value.trim();
    const image = document.getElementById('categoryImage').value.trim();
    
    // Validar que no exista otra categoría con el mismo slug
    const existingCategory = categories.find(c => c.slug === slug && c.id !== editingCategoryId);
    if (existingCategory) {
        alert('Ya existe una categoría con ese identificador. Por favor, usa uno diferente.');
        return;
    }
    
    const categoryData = {
        name,
        slug,
        description,
        image: image || `category-${slug}.jpg`
    };
    
    if (editingCategoryId) {
        // Editar categoría existente
        const categoryIndex = categories.findIndex(c => c.id === editingCategoryId);
        if (categoryIndex !== -1) {
            categories[categoryIndex] = { ...categories[categoryIndex], ...categoryData };
        }
    } else {
        // Añadir nueva categoría
        const newId = Math.max(...categories.map(c => c.id), 0) + 1;
        categories.push({ id: newId, ...categoryData });
    }
    
    saveCategories();
    updateCategorySelectors();
    renderAdminCategories();
    closeCategoryModal();
    
    alert(editingCategoryId ? 'Categoría actualizada correctamente' : 'Categoría añadida correctamente');
}

// Función para eliminar categoría
function deleteCategory(categoryId) {
    const category = categories.find(c => c.id === categoryId);
    if (!category) return;
    
    // Verificar si hay productos en esta categoría
    const productsInCategory = products.filter(p => p.category === category.slug);
    if (productsInCategory.length > 0) {
        alert(`No se puede eliminar la categoría "${category.name}" porque tiene ${productsInCategory.length} producto(s) asociado(s). Primero mueve o elimina los productos.`);
        return;
    }
    
    if (confirm(`¿Estás seguro de que quieres eliminar la categoría "${category.name}"?`)) {
        categories = categories.filter(c => c.id !== categoryId);
        saveCategories();
        updateCategorySelectors();
        renderAdminCategories();
        alert('Categoría eliminada correctamente');
    }
}

// Función para renderizar categorías en el panel de administración
function renderAdminCategories() {
    const categoriesList = document.getElementById('adminCategoriesList');
    if (!categoriesList) return;
    
    categoriesList.innerHTML = '';
    
    categories.forEach(category => {
        const productsCount = products.filter(p => p.category === category.slug).length;
        
        const categoryItem = document.createElement('div');
        categoryItem.className = 'category-item';
        categoryItem.innerHTML = `
            <div class="category-info">
                <h4>${category.name}</h4>
                <p>${category.description || 'Sin descripción'}</p>
                <span class="category-slug">${category.slug}</span>
                <div class="category-stats">${productsCount} producto(s)</div>
            </div>
            <div class="category-actions">
                <button class="edit-category-btn" onclick="showEditCategoryForm(${category.id})">
                    <i class="fas fa-edit"></i> Editar
                </button>
                <button class="delete-category-btn" onclick="deleteCategory(${category.id})">
                    <i class="fas fa-trash"></i> Eliminar
                </button>
            </div>
        `;
        
        categoriesList.appendChild(categoryItem);
    });
}

// Función para generar slug automáticamente
function generateSlug(name) {
    return name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remover acentos
        .replace(/[^a-z0-9\s-]/g, '') // Remover caracteres especiales
        .replace(/\s+/g, '-') // Reemplazar espacios con guiones
        .replace(/-+/g, '-') // Remover guiones múltiples
        .trim();
}

// Event listeners para categorías
document.addEventListener('DOMContentLoaded', function() {
    // Formulario de categorías
    const categoryForm = document.getElementById('categoryForm');
    if (categoryForm) {
        categoryForm.addEventListener('submit', handleCategoryForm);
    }
    
    // Auto-generar slug cuando se escribe el nombre
    const categoryNameInput = document.getElementById('categoryName');
    const categorySlugInput = document.getElementById('categorySlug');
    if (categoryNameInput && categorySlugInput) {
        categoryNameInput.addEventListener('input', function() {
            if (!editingCategoryId) { // Solo auto-generar para nuevas categorías
                categorySlugInput.value = generateSlug(this.value);
            }
        });
    }
});

// Exponer funciones globalmente
window.showAddCategoryForm = showAddCategoryForm;
window.showEditCategoryForm = showEditCategoryForm;
window.closeCategoryModal = closeCategoryModal;
window.deleteCategory = deleteCategory;

// Exportar funciones para uso global
window.addToCart = addToCart;
window.updateQuantity = updateQuantity;
window.removeFromCart = removeFromCart;
window.toggleCart = toggleCart;
window.checkout = checkout;
window.showLoginModal = showLoginModal;
window.closeLoginModal = closeLoginModal;
window.closeAdminPanel = closeAdminPanel;
window.showTab = showTab;
window.showAddProductForm = showAddProductForm;
window.editProduct = editProduct;
window.deleteProduct = deleteProduct;
window.updateStock = updateStock;
window.closeProductModal = closeProductModal;
window.scrollToProducts = scrollToProducts;
window.toggleFeatured = toggleFeatured;
window.showProductDetails = showProductDetails;
window.closeProductDetailModal = closeProductDetailModal;
window.addToCartFromModal = addToCartFromModal;
window.proceedToCheckout = proceedToCheckout;
window.updateCheckoutSummary = updateCheckoutSummary;
window.processOrder = processOrder;
window.closeCheckoutModal = closeCheckoutModal;
window.renderAdminOrders = renderAdminOrders;
window.updateOrderStatus = updateOrderStatus;
window.viewOrderDetails = viewOrderDetails;
window.closeOrderDetailsModal = closeOrderDetailsModal;
window.printOrderDetails = printOrderDetails;
window.updateDeliveryMethod = updateDeliveryMethod;
window.addSize = addSize;
window.removeSize = removeSize;
window.addPresetSizes = addPresetSizes;
window.updatePriceCalculation = updatePriceCalculation;

console.log('Anyta Lingerie Marketplace cargado correctamente ✨');
