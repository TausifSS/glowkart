/* GlowKart LocalStorage Store Engine */

const STORE_KEYS = {
  CART: 'gk_cart_items',
  WISHLIST: 'gk_wishlist_ids',
  ORDERS: 'gk_orders_list',
  ADDRESS: 'gk_customer_address',
  NOTIFICATIONS: 'gk_notifications',
  PRODUCTS: 'gk_admin_products',
  OFFERS: 'gk_admin_offers',
  PREFERENCES: 'gk_user_preferences',
  RECENTLY_VIEWED: 'gk_recently_viewed'
};

class GlowKartStore {
  constructor() {
    this.init();
  }

  init() {
    if (!localStorage.getItem(STORE_KEYS.PRODUCTS)) {
      localStorage.setItem(STORE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
    }
    if (!localStorage.getItem(STORE_KEYS.OFFERS)) {
      localStorage.setItem(STORE_KEYS.OFFERS, JSON.stringify(INITIAL_OFFERS));
    }
    if (!localStorage.getItem(STORE_KEYS.NOTIFICATIONS)) {
      localStorage.setItem(STORE_KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
    }
    if (!localStorage.getItem(STORE_KEYS.CART)) {
      localStorage.setItem(STORE_KEYS.CART, JSON.stringify([]));
    }
    if (!localStorage.getItem(STORE_KEYS.WISHLIST)) {
      localStorage.setItem(STORE_KEYS.WISHLIST, JSON.stringify([]));
    }
    if (!localStorage.getItem(STORE_KEYS.ORDERS)) {
      localStorage.setItem(STORE_KEYS.ORDERS, JSON.stringify([]));
    }
    if (!localStorage.getItem(STORE_KEYS.RECENTLY_VIEWED)) {
      localStorage.setItem(STORE_KEYS.RECENTLY_VIEWED, JSON.stringify([]));
    }
  }

  // --- PRODUCTS ---
  getProducts() {
    return JSON.parse(localStorage.getItem(STORE_KEYS.PRODUCTS)) || [];
  }

  getProductById(id) {
    return this.getProducts().find(p => p.id === id);
  }

  saveProduct(productData) {
    let products = this.getProducts();
    const existingIndex = products.findIndex(p => p.id === productData.id);
    if (existingIndex >= 0) {
      products[existingIndex] = { ...products[existingIndex], ...productData };
    } else {
      productData.id = productData.id || 'gk-prod-' + Date.now();
      products.unshift(productData);
    }
    localStorage.setItem(STORE_KEYS.PRODUCTS, JSON.stringify(products));
    return products;
  }

  deleteProduct(id) {
    let products = this.getProducts().filter(p => p.id !== id);
    localStorage.setItem(STORE_KEYS.PRODUCTS, JSON.stringify(products));
    return products;
  }

  // --- CART ---
  getCart() {
    return JSON.parse(localStorage.getItem(STORE_KEYS.CART)) || [];
  }

  addToCart(productId, shade = null, qty = 1) {
    let cart = this.getCart();
    const existing = cart.find(item => item.productId === productId && item.shade === shade);
    if (existing) {
      existing.qty += qty;
    } else {
      const product = this.getProductById(productId);
      if (!product) return cart;
      cart.push({
        productId,
        shade: shade || (product.shades && product.shades.length > 0 ? product.shades[0].name : null),
        qty
      });
    }
    localStorage.setItem(STORE_KEYS.CART, JSON.stringify(cart));
    return cart;
  }

  updateCartQty(productId, shade, newQty) {
    let cart = this.getCart();
    if (newQty <= 0) {
      cart = cart.filter(item => !(item.productId === productId && item.shade === shade));
    } else {
      const existing = cart.find(item => item.productId === productId && item.shade === shade);
      if (existing) existing.qty = newQty;
    }
    localStorage.setItem(STORE_KEYS.CART, JSON.stringify(cart));
    return cart;
  }

  removeFromCart(productId, shade) {
    let cart = this.getCart().filter(item => !(item.productId === productId && item.shade === shade));
    localStorage.setItem(STORE_KEYS.CART, JSON.stringify(cart));
    return cart;
  }

  clearCart() {
    localStorage.setItem(STORE_KEYS.CART, JSON.stringify([]));
  }

  getCartTotal() {
    const cart = this.getCart();
    const products = this.getProducts();
    let subtotal = 0;
    cart.forEach(item => {
      const p = products.find(prod => prod.id === item.productId);
      if (p) subtotal += p.price * item.qty;
    });
    const deliveryFee = subtotal >= 499 || subtotal === 0 ? 0 : 20;
    return {
      subtotal,
      deliveryFee,
      total: subtotal + deliveryFee,
      freeDeliveryRemaining: Math.max(0, 499 - subtotal)
    };
  }

  // --- WISHLIST ---
  getWishlist() {
    return JSON.parse(localStorage.getItem(STORE_KEYS.WISHLIST)) || [];
  }

  toggleWishlist(productId) {
    let wishlist = this.getWishlist();
    if (wishlist.includes(productId)) {
      wishlist = wishlist.filter(id => id !== productId);
    } else {
      wishlist.push(productId);
    }
    localStorage.setItem(STORE_KEYS.WISHLIST, JSON.stringify(wishlist));
    return wishlist;
  }

  // --- ORDERS ---
  getOrders() {
    return JSON.parse(localStorage.getItem(STORE_KEYS.ORDERS)) || [];
  }

  addOrder(orderData) {
    let orders = this.getOrders();
    const newOrder = {
      orderId: 'GK-' + Math.floor(1000 + Math.random() * 9000),
      date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      status: 'Pending', // Pending, Confirmed, Shipped, Delivered, Cancelled
      ...orderData
    };
    orders.unshift(newOrder);
    localStorage.setItem(STORE_KEYS.ORDERS, JSON.stringify(orders));
    this.clearCart();
    return newOrder;
  }

  updateOrderStatus(orderId, newStatus) {
    let orders = this.getOrders();
    const order = orders.find(o => o.orderId === orderId);
    if (order) {
      order.status = newStatus;
      localStorage.setItem(STORE_KEYS.ORDERS, JSON.stringify(orders));
    }
    return orders;
  }

  clearAllOrders() {
    localStorage.setItem(STORE_KEYS.ORDERS, JSON.stringify([]));
  }

  // --- CUSTOMER ADDRESS ---
  getSavedAddress() {
    return JSON.parse(localStorage.getItem(STORE_KEYS.ADDRESS)) || {
      fullName: '',
      whatsapp: '',
      house: '',
      area: '',
      landmark: '',
      pincode: '412208',
      city: 'Shikrapur'
    };
  }

  saveAddress(addressObj) {
    localStorage.setItem(STORE_KEYS.ADDRESS, JSON.stringify(addressObj));
  }

  // --- RECENTLY VIEWED ---
  addRecentlyViewed(productId) {
    let recent = JSON.parse(localStorage.getItem(STORE_KEYS.RECENTLY_VIEWED)) || [];
    recent = recent.filter(id => id !== productId);
    recent.unshift(productId);
    if (recent.length > 10) recent.pop();
    localStorage.setItem(STORE_KEYS.RECENTLY_VIEWED, JSON.stringify(recent));
  }

  // --- NOTIFICATIONS ---
  getNotifications() {
    return JSON.parse(localStorage.getItem(STORE_KEYS.NOTIFICATIONS)) || [];
  }

  markAllNotificationsRead() {
    let notifs = this.getNotifications();
    notifs.forEach(n => n.unread = false);
    localStorage.setItem(STORE_KEYS.NOTIFICATIONS, JSON.stringify(notifs));
    return notifs;
  }

  // --- CLEAR ALL STORE DATA ---
  clearAllData() {
    localStorage.clear();
    this.init();
  }
}

const gkStore = new GlowKartStore();
