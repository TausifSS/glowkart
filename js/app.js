/* GlowKart Main Customer SPA Application Router & Renderer */

let currentView = 'home';
let currentSelectedCategory = 'all';
let currentSearchQuery = '';
let currentActiveProduct = null;
let currentActiveShade = null;
let currentQuantity = 1;
let isMaintenanceMode = false;
let deferredPwaPrompt = null;

document.addEventListener('DOMContentLoaded', () => {
  initApp();
  initPwaListeners();
  hideSplashScreen();
});

function hideSplashScreen() {
  setTimeout(() => {
    const splash = document.getElementById('app-splash-screen');
    if (splash) splash.classList.add('hide');
  }, 1400);
}

function initApp() {
  updateBadges();
  bindGlobalEvents();
  renderView('home');
}

/* PWA App Download Prompt Handler */
function initPwaListeners() {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPwaPrompt = e;
    const topBanner = document.getElementById('pwa-install-banner');
    if (topBanner && !localStorage.getItem('gk_pwa_dismissed')) {
      topBanner.style.display = 'flex';
    }
  });

  const topInstallBtn = document.getElementById('pwa-install-btn-top');
  if (topInstallBtn) {
    topInstallBtn.addEventListener('click', triggerPwaInstall);
  }
}

function triggerPwaInstall() {
  if (deferredPwaPrompt) {
    deferredPwaPrompt.prompt();
    deferredPwaPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        showToast('Thank you for installing GlowKart App! 🎉');
      }
      deferredPwaPrompt = null;
      dismissPwaBanner();
    });
  } else {
    showToast('To install app: tap browser menu (⋮) → Add to Home screen 📲');
  }
}

function dismissPwaBanner() {
  const topBanner = document.getElementById('pwa-install-banner');
  if (topBanner) topBanner.style.display = 'none';
  localStorage.setItem('gk_pwa_dismissed', 'true');
}

function bindGlobalEvents() {
  // Sidebar Drawer Events
  const menuBtn = document.getElementById('menu-btn');
  const drawerBackdrop = document.getElementById('drawer-backdrop');
  const drawerCloseBtn = document.getElementById('drawer-close-btn');

  if (menuBtn) menuBtn.addEventListener('click', openSidebar);
  if (drawerBackdrop) drawerBackdrop.addEventListener('click', (e) => {
    if (e.target === drawerBackdrop) closeSidebar();
  });
  if (drawerCloseBtn) drawerCloseBtn.addEventListener('click', closeSidebar);

  // Sidebar Collapsible Categories Toggle
  const catToggle = document.getElementById('sidebar-cat-toggle');
  const subnav = document.getElementById('sidebar-subnav');
  const arrow = document.getElementById('sidebar-cat-arrow');

  if (catToggle && subnav) {
    catToggle.addEventListener('click', () => {
      subnav.classList.toggle('expanded');
      if (arrow) {
        arrow.style.transform = subnav.classList.contains('expanded') ? 'rotate(90deg)' : 'rotate(0deg)';
      }
    });
  }

  // Logo Click
  const logoBtn = document.getElementById('header-logo');
  if (logoBtn) logoBtn.addEventListener('click', () => navigateTo('home'));

  // Header Actions
  const wishlistHeaderBtn = document.getElementById('wishlist-btn');
  const notifBtn = document.getElementById('notif-btn');
  const cartBtn = document.getElementById('cart-btn');

  if (wishlistHeaderBtn) wishlistHeaderBtn.addEventListener('click', () => navigateTo('wishlist'));
  if (notifBtn) notifBtn.addEventListener('click', () => navigateTo('notifications'));
  if (cartBtn) cartBtn.addEventListener('click', () => navigateTo('cart'));

  // Desktop Search Input
  const desktopSearchInput = document.getElementById('desktop-search-input');
  if (desktopSearchInput) {
    desktopSearchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && desktopSearchInput.value.trim()) {
        navigateTo('search', { query: desktopSearchInput.value.trim() });
      }
    });
  }

  // Bottom Nav Items
  const navButtons = document.querySelectorAll('.bottom-nav .nav-item');
  navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const viewTarget = btn.getAttribute('data-view');
      navigateTo(viewTarget);
    });
  });
}

function triggerDesktopSearch() {
  const input = document.getElementById('desktop-search-input');
  if (input && input.value.trim()) {
    navigateTo('search', { query: input.value.trim() });
  }
}

function openSidebar() {
  document.getElementById('drawer-backdrop').classList.add('open');
}

function closeSidebar() {
  document.getElementById('drawer-backdrop').classList.remove('open');
}

function updateBadges() {
  const cart = gkStore.getCart();
  const notifs = gkStore.getNotifications();
  const wishlist = gkStore.getWishlist();

  const cartBadge = document.getElementById('cart-badge');
  const notifBadge = document.getElementById('notif-badge');
  const wishlistBadge = document.getElementById('wishlist-badge');

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const unreadNotifsCount = notifs.filter(n => n.unread).length;
  const wishlistCount = wishlist.length;

  if (cartBadge) {
    cartBadge.textContent = cartCount;
    cartBadge.style.display = cartCount > 0 ? 'flex' : 'none';
  }

  if (notifBadge) {
    notifBadge.textContent = unreadNotifsCount;
    notifBadge.style.display = unreadNotifsCount > 0 ? 'flex' : 'none';
  }

  if (wishlistBadge) {
    wishlistBadge.textContent = wishlistCount;
    wishlistBadge.style.display = wishlistCount > 0 ? 'flex' : 'none';
  }
}

function navigateTo(viewName, params = {}) {
  closeSidebar();
  currentView = viewName;

  // Update Active Bottom Nav
  document.querySelectorAll('.bottom-nav .nav-item').forEach(btn => {
    if (btn.getAttribute('data-view') === viewName) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // Update Desktop Nav Active
  document.querySelectorAll('.desktop-nav-link').forEach(link => {
    link.classList.remove('active');
  });

  renderView(viewName, params);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>✨ ${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.remove();
  }, 3000);
}

function renderView(viewName, params = {}) {
  const container = document.getElementById('view-container');
  if (!container) return;

  if (isMaintenanceMode && viewName !== 'maintenance') {
    renderMaintenanceView(container);
    return;
  }

  switch (viewName) {
    case 'home':
      renderHomeView(container);
      break;
    case 'categories':
      renderCategoriesView(container);
      break;
    case 'category-products':
      renderCategoryProductsView(container, params.category);
      break;
    case 'product-details':
      renderProductDetailsView(container, params.productId);
      break;
    case 'cart':
      renderCartView(container);
      break;
    case 'checkout':
      renderCheckoutView(container);
      break;
    case 'order-success':
      renderOrderSuccessView(container, params.order);
      break;
    case 'orders':
      renderOrdersView(container);
      break;
    case 'wishlist':
      renderWishlistView(container);
      break;
    case 'offers':
      renderOffersView(container);
      break;
    case 'notifications':
      renderNotificationsView(container);
      break;
    case 'account':
      renderMyGlowkartView(container);
      break;
    case 'search':
      renderSearchView(container, params.query);
      break;
    case 'request-product':
      renderRequestProductView(container);
      break;
    case 'delivery-info':
      renderDeliveryInfoView(container);
      break;
    case 'maintenance':
      renderMaintenanceView(container);
      break;
    default:
      renderHomeView(container);
  }

  updateBadges();
}

/* --- VIEW RENDERERS --- */

/* 1. HOME VIEW */
function renderHomeView(container) {
  const products = gkStore.getProducts();
  const bestSellers = products.filter(p => p.bestseller);

  container.innerHTML = `
    <!-- Mobile Search Bar Container (Matching Image 2 Reference) -->
    <div class="search-container" style="padding: 12px 16px 4px;">
      <div class="search-box">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input type="text" id="home-search-input" placeholder="Search for products, brands..." />
      </div>
    </div>

    <!-- Desktop PC 2-Column Grid Wrapper -->
    <div style="display: flex; gap: 24px; flex-wrap: wrap; padding: 16px;">
      
      <!-- Main Feed Column (Left / Full on Mobile) -->
      <div style="flex: 1; min-width: 300px; display: flex; flex-direction: column; gap: 16px;">
        
        <!-- Hero Offer Banner -->
        <div class="hero-banner" style="margin: 0;">
          <div class="hero-banner-content" style="max-width: 55%;">
            <div style="font-size: 11px; font-weight: 800; background: var(--gk-pink-soft); color: var(--gk-pink-primary); padding: 3px 10px; border-radius: var(--radius-full); display: inline-block; margin-bottom: 8px;">✨ Your Glow, Our Promise</div>
            <div class="hero-banner-title" style="font-size: 24px; font-weight: 800;">Beauty that shines,<br>Confidence that stays! 💕</div>
            <div class="hero-banner-desc">100% Original Products • Fast Delivery in Shikrapur • Exciting Offers</div>
            <a href="#" class="hero-banner-btn" onclick="navigateTo('categories'); return false;">Shop Now →</a>
          </div>
          <img src="assets/mascot_glowgirl.png" class="hero-banner-img" style="width: 140px; height: auto;" alt="Glow Girl Mascot" />
        </div>

        <!-- Category Shortcuts -->
        <div style="background: var(--gk-white); border-radius: var(--radius-lg); padding: 16px; border: 1px solid var(--gk-pink-light); box-shadow: var(--shadow-sm);">
          <div class="section-header" style="padding: 0 0 12px 0;">
            <div class="section-title" style="font-size: 16px;">Shop by Category ✨</div>
            <a href="#" class="section-link" onclick="navigateTo('categories'); return false;">View All Categories →</a>
          </div>
          <div class="categories-scroll" style="padding: 0;">
            ${INITIAL_CATEGORIES.map(cat => `
              <div class="category-circle-item" onclick="navigateTo('category-products', { category: '${cat.id}' })">
                <div class="category-circle-icon">${cat.icon}</div>
                <div class="category-circle-name">${cat.name}</div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Best Sellers Section -->
        <div style="background: var(--gk-white); border-radius: var(--radius-lg); padding: 16px; border: 1px solid var(--gk-pink-light); box-shadow: var(--shadow-sm);">
          <div class="section-header" style="padding: 0 0 12px 0;">
            <div class="section-title" style="font-size: 16px;">Best Sellers 🔥</div>
            <a href="#" class="section-link" onclick="navigateTo('categories'); return false;">View All Best Sellers →</a>
          </div>
          <div class="products-scroll" style="padding: 0;">
            ${bestSellers.map(p => renderProductCardHTML(p)).join('')}
          </div>
        </div>

        <!-- Trust Badges Row -->
        <div class="trust-cards-row" style="padding: 0;">
          <div class="trust-card">
            <div class="trust-card-icon">🛵</div>
            <div class="trust-card-text">Fast Delivery<br><span style="color:var(--gk-pink-primary);">In Shikrapur</span></div>
          </div>
          <div class="trust-card">
            <div class="trust-card-icon">🛡️</div>
            <div class="trust-card-text">100% Original<br><span style="color:var(--gk-dark-muted);">Products</span></div>
          </div>
          <div class="trust-card">
            <div class="trust-card-icon">🎁</div>
            <div class="trust-card-text">Exciting Offers<br><span style="color:var(--gk-dark-muted);">Every Order</span></div>
          </div>
        </div>

      </div>

      <!-- Right Desktop PC Sidebar Column -->
      <div style="width: 320px; display: flex; flex-direction: column; gap: 16px;" class="desktop-sidebar-col">
        
        <!-- Glow More, Save More! Countdown Promo Card -->
        <div style="background: linear-gradient(135deg, #FFF0F5 0%, #FFE4E1 100%); border-radius: var(--radius-lg); padding: 18px; border: 1px solid var(--gk-pink-light); box-shadow: var(--shadow-sm);">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px;">
            <div style="font-size: 14px; font-weight: 800; color: var(--gk-dark);">Glow More, Save More! 😍</div>
            <div style="font-size: 10px; font-weight: 800; background: var(--gk-white); color: var(--gk-pink-primary); padding: 2px 8px; border-radius: var(--radius-full); border: 1px solid var(--gk-pink-light);">⏰ Ends in 02:18:45</div>
          </div>
          
          <div style="background: var(--gk-white); border-radius: var(--radius-md); padding: 14px; border: 1.5px dashed var(--gk-pink-primary); text-align: center;">
            <div style="font-size: 18px; font-weight: 800; color: var(--gk-pink-primary);">Flat 20% OFF</div>
            <div style="font-size: 11px; color: var(--gk-dark-muted); margin: 2px 0 10px;">on Skincare & Cosmetics Products</div>
            <button class="btn btn-primary" style="padding: 8px; font-size: 12px;" onclick="navigateTo('offers')">Shop Offers Now</button>
          </div>
        </div>

        <!-- Latest Offers Panel -->
        <div style="background: var(--gk-white); border-radius: var(--radius-lg); padding: 18px; border: 1px solid var(--gk-pink-light); box-shadow: var(--shadow-sm);">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
            <div style="font-size: 14px; font-weight: 800; color: var(--gk-dark);">Latest Offers 🎁</div>
            <a href="#" style="font-size: 11px; font-weight: 700; color: var(--gk-pink-primary); text-decoration: none;" onclick="navigateTo('offers'); return false;">View All Offers →</a>
          </div>

          <div style="display: flex; flex-direction: column; gap: 10px;">
            <div style="display: flex; align-items: center; justify-content: space-between; padding: 8px; background: var(--gk-pink-soft); border-radius: var(--radius-sm);">
              <div>
                <div style="font-size: 12px; font-weight: 800;">Flat 25% OFF</div>
                <div style="font-size: 10px; color: var(--gk-dark-muted);">On all Makeup Products</div>
              </div>
              <span style="font-size: 10px; font-weight: 800; background: var(--gk-white); color: var(--gk-pink-primary); padding: 2px 8px; border-radius: 4px; border: 1px dashed var(--gk-pink-primary);">MAKEUP25</span>
            </div>

            <div style="display: flex; align-items: center; justify-content: space-between; padding: 8px; background: var(--gk-pink-soft); border-radius: var(--radius-sm);">
              <div>
                <div style="font-size: 12px; font-weight: 800;">Flat ₹100 OFF</div>
                <div style="font-size: 10px; color: var(--gk-dark-muted);">On orders above ₹699</div>
              </div>
              <span style="font-size: 10px; font-weight: 800; background: var(--gk-white); color: var(--gk-pink-primary); padding: 2px 8px; border-radius: 4px; border: 1px dashed var(--gk-pink-primary);">GLOW100</span>
            </div>

            <div style="display: flex; align-items: center; justify-content: space-between; padding: 8px; background: var(--gk-pink-soft); border-radius: var(--radius-sm);">
              <div>
                <div style="font-size: 12px; font-weight: 800;">Free Gift</div>
                <div style="font-size: 10px; color: var(--gk-dark-muted);">On orders above ₹999</div>
              </div>
              <span style="font-size: 10px; font-weight: 800; background: var(--gk-white); color: var(--gk-pink-primary); padding: 2px 8px; border-radius: 4px; border: 1px dashed var(--gk-pink-primary);">FREEGIFT</span>
            </div>
          </div>
        </div>

      </div>

    </div>

    <!-- App Footer -->
    <div class="app-footer" style="margin-top: 24px;">
      <div class="footer-brand">
        <img src="assets/logo.png" class="footer-logo" alt="GlowKart" />
        <p class="footer-desc">Your trusted local beauty & cosmetics store delivering happiness across Shikrapur, Maharashtra.</p>
      </div>
      <div style="font-size: 11px; color: var(--gk-dark-muted); border-top: 1px solid var(--gk-gray-border); padding-top: 12px; text-align: center;">
        © 2026 GlowKart. Delivering only in Shikrapur. 💕
      </div>
    </div>
  `;

  // Bind Mobile Search Input
  const searchInput = document.getElementById('home-search-input');
  if (searchInput) {
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && searchInput.value.trim()) {
        navigateTo('search', { query: searchInput.value.trim() });
      }
    });
  }
}

/* Helper: Render Single Product Card */
function renderProductCardHTML(product) {
  const wishlist = gkStore.getWishlist();
  const isWishlisted = wishlist.includes(product.id);

  return `
    <div class="product-card">
      ${product.discount ? `<div class="product-badge">-${product.discount}%</div>` : ''}
      <button class="wishlist-btn ${isWishlisted ? 'active' : ''}" onclick="event.stopPropagation(); toggleWishlistProduct('${product.id}')">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="${isWishlisted ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
      </button>

      <div class="product-img-wrap" onclick="navigateTo('product-details', { productId: '${product.id}' })">
        <img src="${product.image}" alt="${product.name}" loading="lazy" />
      </div>

      <div class="product-info">
        <div class="product-brand">${product.brand}</div>
        <div class="product-title" onclick="navigateTo('product-details', { productId: '${product.id}' })">${product.name}</div>
        <div class="product-price-row">
          <span class="product-price">₹${product.price}</span>
          ${product.mrp ? `<span class="product-mrp">₹${product.mrp}</span>` : ''}
          ${product.discount ? `<span class="product-discount">${product.discount}% OFF</span>` : ''}
        </div>
        <button class="add-cart-btn" onclick="quickAddToCart('${product.id}')">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
          Add to Cart
        </button>
      </div>
    </div>
  `;
}

function quickAddToCart(productId) {
  gkStore.addToCart(productId, null, 1);
  showToast("Added to Cart!");
  updateBadges();
}

function toggleWishlistProduct(productId) {
  const updated = gkStore.toggleWishlist(productId);
  showToast(updated.includes(productId) ? "Added to Wishlist ❤️" : "Removed from Wishlist");
  renderView(currentView);
}

/* WISHLIST VIEW */
function renderWishlistView(container) {
  const wishlistIds = gkStore.getWishlist();
  const products = gkStore.getProducts();
  const wishlistedProducts = products.filter(p => wishlistIds.includes(p.id));

  container.innerHTML = `
    <div style="padding: 16px;">
      <h2 style="font-size: 20px; font-weight: 800; margin-bottom: 4px;">My Wishlist ❤️</h2>
      <p style="font-size: 12px; color: var(--gk-dark-muted); margin-bottom: 16px;">Your favorite beauty items saved on this device</p>

      ${wishlistedProducts.length === 0 ? `
        <div style="text-align: center; padding: 50px 20px;">
          <img src="assets/mascot_glowgirl.png" style="width: 110px; opacity: 0.9; margin-bottom: 16px;" />
          <h3 style="font-size: 18px; font-weight: 800; color: var(--gk-dark);">Your wishlist is waiting for some glow ✨</h3>
          <p style="font-size: 12px; color: var(--gk-dark-muted); margin: 6px 0 20px;">Tap the heart icon on any product to save it here!</p>
          <button class="btn btn-primary" style="width: auto; padding: 10px 24px;" onclick="navigateTo('home')">Explore Products</button>
        </div>
      ` : `
        <div class="products-grid">
          ${wishlistedProducts.map(p => renderProductCardHTML(p)).join('')}
        </div>
      `}
    </div>
  `;
}

/* 2. CATEGORIES VIEW */
function renderCategoriesView(container) {
  container.innerHTML = `
    <div style="padding: 16px;">
      <h2 style="font-size: 20px; font-weight: 800; margin-bottom: 4px;">Categories ✨</h2>
      <p style="font-size: 12px; color: var(--gk-dark-muted); margin-bottom: 16px;">Explore our wide range of beauty products</p>

      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 12px;">
        ${INITIAL_CATEGORIES.map(cat => `
          <div style="background: var(--gk-white); border-radius: var(--radius-md); padding: 16px; border: 1px solid var(--gk-gray-border); box-shadow: var(--shadow-sm); cursor: pointer; display: flex; flex-direction: column; justify-content: space-between; height: 130px;" onclick="navigateTo('category-products', { category: '${cat.id}' })">
            <div style="font-size: 32px;">${cat.icon}</div>
            <div>
              <div style="font-size: 14px; font-weight: 800; color: var(--gk-dark);">${cat.name}</div>
              <div style="font-size: 11px; color: var(--gk-dark-muted); font-weight: 600;">${cat.count}</div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

/* 3. CATEGORY PRODUCTS LIST / SEARCH RESULTS */
function renderCategoryProductsView(container, categoryId) {
  const products = gkStore.getProducts();
  const categoryObj = INITIAL_CATEGORIES.find(c => c.id === categoryId);
  const title = categoryObj ? categoryObj.name : 'Products';

  let filtered = categoryId === 'new-arrivals' 
    ? products.filter(p => p.newArrival)
    : products.filter(p => p.category === categoryId);

  if (filtered.length === 0) filtered = products;

  container.innerHTML = `
    <div style="padding: 16px 16px 0;">
      <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
        <button class="header-btn" onclick="navigateTo('categories')">‹</button>
        <div>
          <h2 style="font-size: 18px; font-weight: 800; margin: 0;">${title}</h2>
          <p style="font-size: 11px; color: var(--gk-dark-muted);">${filtered.length} Products Found</p>
        </div>
      </div>
    </div>

    <div class="products-grid">
      ${filtered.map(p => renderProductCardHTML(p)).join('')}
    </div>
  `;
}

/* 4. SEARCH VIEW */
function renderSearchView(container, query) {
  const products = gkStore.getProducts();
  const q = (query || '').trim().toLowerCase();
  const results = q ? products.filter(p => 
    p.name.toLowerCase().includes(q) || 
    p.brand.toLowerCase().includes(q) || 
    p.category.toLowerCase().includes(q)
  ) : products;

  container.innerHTML = `
    <div style="padding: 16px;">
      <div class="search-box" style="margin-bottom: 16px;">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input type="text" id="search-view-input" value="${query || ''}" placeholder="Search for products, brands..." />
      </div>

      <div style="font-size: 13px; font-weight: 700; color: var(--gk-dark-muted); margin-bottom: 12px;">
        ${q ? `Showing results for "${query}" (${results.length} found)` : `All Products (${results.length})`}
      </div>

      ${results.length === 0 ? `
        <div style="text-align: center; padding: 40px 20px;">
          <img src="assets/mascot_glowgirl.png" style="width: 100px; opacity: 0.8; margin-bottom: 12px;" />
          <h3 style="font-size: 16px; font-weight: 800;">No products found!</h3>
          <p style="font-size: 12px; color: var(--gk-dark-muted); margin: 6px 0 16px;">Can't find what you're looking for?</p>
          <button class="btn btn-secondary" onclick="navigateTo('request-product')">Request a Product via WhatsApp</button>
        </div>
      ` : `
        <div class="products-grid">
          ${results.map(p => renderProductCardHTML(p)).join('')}
        </div>
      `}
    </div>
  `;

  const searchInput = document.getElementById('search-view-input');
  if (searchInput) {
    searchInput.focus();
    searchInput.addEventListener('input', (e) => {
      const val = e.target.value.trim();
      renderSearchViewResultsOnly(val);
    });
  }
}

function renderSearchViewResultsOnly(query) {
  const products = gkStore.getProducts();
  const q = (query || '').trim().toLowerCase();
  const results = q ? products.filter(p => 
    p.name.toLowerCase().includes(q) || 
    p.brand.toLowerCase().includes(q) || 
    p.category.toLowerCase().includes(q)
  ) : products;

  const gridElem = document.querySelector('.products-grid');
  if (gridElem) {
    gridElem.innerHTML = results.length > 0 
      ? results.map(p => renderProductCardHTML(p)).join('')
      : `<div style="grid-column: 1/-1; text-align: center; padding: 30px;"><p style="font-weight:700;">No products found for "${query}"</p></div>`;
  }
}

/* 5. PRODUCT DETAILS VIEW */
function renderProductDetailsView(container, productId) {
  const product = gkStore.getProductById(productId);
  if (!product) {
    navigateTo('home');
    return;
  }

  currentActiveProduct = product;
  currentActiveShade = product.shades && product.shades.length > 0 ? product.shades[0].name : null;
  currentQuantity = 1;
  gkStore.addRecentlyViewed(product.id);

  const wishlist = gkStore.getWishlist();
  const isWishlisted = wishlist.includes(product.id);

  container.innerHTML = `
    <div style="background: var(--gk-white); padding-bottom: 24px; border-radius: var(--radius-lg);">
      <!-- Header Bar -->
      <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px 16px;">
        <button class="header-btn" onclick="history.back() || navigateTo('home')">‹</button>
        <div style="font-weight: 800; font-size: 14px; color: var(--gk-pink-primary);">${product.brand}</div>
        <button class="wishlist-btn ${isWishlisted ? 'active' : ''}" style="position: static;" onclick="toggleWishlistProduct('${product.id}')">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="${isWishlisted ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
        </button>
      </div>

      <!-- Main Image -->
      <div style="height: 280px; background: #FAF6F8; display: flex; align-items: center; justify-content: center; padding: 20px; position: relative;">
        ${product.bestseller ? `<div class="product-badge" style="top:12px; left:12px;">BEST SELLER</div>` : ''}
        ${product.discount ? `<div class="product-badge" style="top:12px; right:12px; background: var(--gk-dark);">-${product.discount}% OFF</div>` : ''}
        <img src="${product.image}" id="pd-main-img" style="max-height: 100%; max-width: 100%; object-fit: contain;" />
      </div>

      <!-- Info -->
      <div style="padding: 20px 16px;">
        <div style="font-size: 12px; font-weight: 700; color: var(--gk-pink-primary); text-transform: uppercase;">${product.brand}</div>
        <h1 style="font-size: 20px; font-weight: 800; color: var(--gk-dark); margin: 4px 0 8px;">${product.name}</h1>

        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
          <span style="font-size: 12px; font-weight: 700; background: #FFF3C4; color: #B45309; padding: 2px 8px; border-radius: var(--radius-full);">★ ${product.rating || 4.7} (${product.reviewsCount || 120} reviews)</span>
          <span style="font-size: 12px; color: var(--gk-green); font-weight: 700;">● In Stock</span>
        </div>

        <div style="display: flex; align-items: baseline; gap: 8px; margin-bottom: 16px;">
          <span style="font-size: 24px; font-weight: 800; color: var(--gk-dark);">₹${product.price}</span>
          ${product.mrp ? `<span style="font-size: 14px; color: #9CA3AF; text-decoration: line-through;">₹${product.mrp}</span>` : ''}
          ${product.discount ? `<span style="font-size: 12px; font-weight: 800; color: var(--gk-pink-primary);">${product.discount}% OFF</span>` : ''}
        </div>

        <!-- Shade Selector if available -->
        ${product.shades && product.shades.length > 0 ? `
          <div style="margin-bottom: 16px;">
            <div style="font-size: 12px; font-weight: 700; margin-bottom: 8px;">Select Shade: <span id="pd-shade-name" style="color: var(--gk-pink-primary);">${product.shades[0].name}</span></div>
            <div class="shade-selector">
              ${product.shades.map((shade, idx) => `
                <div class="shade-circle ${idx === 0 ? 'selected' : ''}" style="background-color: ${shade.hex};" onclick="selectShade('${shade.name}', this)"></div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <!-- Quantity Stepper -->
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; padding: 12px; background: var(--gk-pink-soft); border-radius: var(--radius-md);">
          <span style="font-size: 13px; font-weight: 700;">Quantity:</span>
          <div style="display: flex; align-items: center; gap: 12px; background: var(--gk-white); padding: 4px 12px; border-radius: var(--radius-full); border: 1px solid var(--gk-pink-light);">
            <button style="border:none; background:none; font-weight:800; font-size:16px; cursor:pointer;" onclick="changePdQty(-1)">-</button>
            <span id="pd-qty-val" style="font-weight:800; font-size:14px;">1</span>
            <button style="border:none; background:none; font-weight:800; font-size:16px; cursor:pointer;" onclick="changePdQty(1)">+</button>
          </div>
        </div>

        <!-- Why You'll Love It -->
        <div style="margin-bottom: 20px;">
          <h4 style="font-size: 14px; font-weight: 800; margin-bottom: 8px;">Why You'll Love It 💕</h4>
          <ul style="padding-left: 20px; font-size: 12px; color: var(--gk-dark-muted); display: flex; flex-direction: column; gap: 4px;">
            ${(product.features || ["100% Original Product", "Fast local delivery in Shikrapur", "Dermatologically tested"]).map(f => `<li>${f}</li>`).join('')}
          </ul>
        </div>

        <!-- Description -->
        <div style="margin-bottom: 20px;">
          <h4 style="font-size: 14px; font-weight: 800; margin-bottom: 6px;">Description</h4>
          <p style="font-size: 12px; color: var(--gk-dark-muted); line-height: 1.6;">${product.description}</p>
        </div>

        <!-- Dual CTA Buttons -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
          <button class="btn btn-outline" onclick="addToCartFromPd()">Add to Cart 🛒</button>
          <button class="btn btn-primary" onclick="directWhatsAppOrderFromPd()">Order on WhatsApp ⚡</button>
        </div>
      </div>
    </div>
  `;
}

function selectShade(shadeName, elem) {
  currentActiveShade = shadeName;
  document.getElementById('pd-shade-name').textContent = shadeName;
  document.querySelectorAll('.shade-circle').forEach(el => el.classList.remove('selected'));
  elem.classList.add('selected');
}

function changePdQty(delta) {
  currentQuantity = Math.max(1, currentQuantity + delta);
  document.getElementById('pd-qty-val').textContent = currentQuantity;
}

function addToCartFromPd() {
  if (!currentActiveProduct) return;
  gkStore.addToCart(currentActiveProduct.id, currentActiveShade, currentQuantity);
  showToast("Added to Cart!");
  updateBadges();
}

function directWhatsAppOrderFromPd() {
  if (!currentActiveProduct) return;
  gkStore.addToCart(currentActiveProduct.id, currentActiveShade, currentQuantity);
  navigateTo('checkout');
}

/* 6. CART VIEW */
function renderCartView(container) {
  const cart = gkStore.getCart();
  const products = gkStore.getProducts();
  const totals = gkStore.getCartTotal();

  if (cart.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 60px 20px;">
        <img src="assets/mascot_glowgirl.png" style="width: 120px; opacity: 0.9; margin-bottom: 16px;" />
        <h2 style="font-size: 18px; font-weight: 800;">Your Cart is Empty! 🛒</h2>
        <p style="font-size: 12px; color: var(--gk-dark-muted); margin: 8px 0 20px;">Looks like you haven't added your beauty favorites yet.</p>
        <button class="btn btn-primary" style="width: auto; padding: 10px 24px;" onclick="navigateTo('home')">Start Shopping Now</button>
      </div>
    `;
    return;
  }

  const freeProgressPercent = Math.min(100, ((499 - totals.freeDeliveryRemaining) / 499) * 100);

  container.innerHTML = `
    <div style="padding: 16px;">
      <h2 style="font-size: 20px; font-weight: 800; margin-bottom: 4px;">My Cart 🛍️</h2>
      <p style="font-size: 12px; color: var(--gk-dark-muted); margin-bottom: 16px;">Review your items before placing order</p>

      <!-- Free Delivery Progress Bar -->
      <div class="delivery-threshold-box">
        <div class="delivery-threshold-text">
          <span>🚚</span>
          ${totals.freeDeliveryRemaining > 0 
            ? `Add <strong>₹${totals.freeDeliveryRemaining}</strong> more to get <strong>FREE delivery!</strong>` 
            : `🎉 You unlocked <strong>FREE Delivery in Shikrapur!</strong>`}
        </div>
        <div class="threshold-progress-bg">
          <div class="threshold-progress-fill" style="width: ${freeProgressPercent}%;"></div>
        </div>
      </div>

      <!-- Items List -->
      <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 20px;">
        ${cart.map(item => {
          const p = products.find(prod => prod.id === item.productId);
          if (!p) return '';
          return `
            <div style="background: var(--gk-white); border-radius: var(--radius-md); padding: 12px; border: 1px solid var(--gk-gray-border); display: flex; gap: 12px; align-items: center;">
              <img src="${p.image}" style="width: 64px; height: 64px; object-fit: contain; background: #FAF6F8; border-radius: var(--radius-sm); padding: 4px;" />
              <div style="flex: 1;">
                <div style="font-size: 11px; font-weight: 700; color: var(--gk-pink-primary);">${p.brand}</div>
                <div style="font-size: 13px; font-weight: 700; color: var(--gk-dark);">${p.name}</div>
                ${item.shade ? `<div style="font-size: 11px; color: var(--gk-dark-muted);">Shade: ${item.shade}</div>` : ''}
                <div style="font-size: 14px; font-weight: 800; margin-top: 4px;">₹${p.price}</div>
              </div>
              <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 8px;">
                <button style="border:none; background:none; color: var(--gk-red); font-size:12px; cursor:pointer;" onclick="removeItemFromCart('${item.productId}', '${item.shade}')">🗑️</button>
                <div style="display: flex; align-items: center; gap: 8px; background: var(--gk-pink-soft); padding: 2px 8px; border-radius: var(--radius-full);">
                  <button style="border:none; background:none; font-weight:800; cursor:pointer;" onclick="updateCartItemQty('${item.productId}', '${item.shade}', ${item.qty - 1})">-</button>
                  <span style="font-weight:800; font-size:12px;">${item.qty}</span>
                  <button style="border:none; background:none; font-weight:800; cursor:pointer;" onclick="updateCartItemQty('${item.productId}', '${item.shade}', ${item.qty + 1})">+</button>
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>

      <!-- Price Breakdown -->
      <div style="background: var(--gk-white); border-radius: var(--radius-md); padding: 16px; border: 1px solid var(--gk-gray-border); margin-bottom: 20px;">
        <h4 style="font-size: 14px; font-weight: 800; margin-bottom: 12px;">Price Summary</h4>
        <div style="display: flex; justify-content: space-between; font-size: 13px; color: var(--gk-dark-muted); margin-bottom: 6px;">
          <span>Subtotal</span>
          <span>₹${totals.subtotal}</span>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 13px; color: var(--gk-dark-muted); margin-bottom: 10px;">
          <span>Delivery Charge (Shikrapur)</span>
          <span>${totals.deliveryFee === 0 ? '<strong style="color:var(--gk-green);">FREE</strong>' : `₹${totals.deliveryFee}`}</span>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 16px; font-weight: 800; color: var(--gk-dark); border-top: 1px dashed var(--gk-gray-border); padding-top: 10px;">
          <span>Total Amount</span>
          <span style="color: var(--gk-pink-primary);">₹${totals.total}</span>
        </div>
      </div>

      <button class="btn btn-primary" onclick="navigateTo('checkout')">Proceed to Checkout →</button>
    </div>
  `;
}

function updateCartItemQty(productId, shade, newQty) {
  gkStore.updateCartQty(productId, shade, newQty);
  renderView('cart');
}

function removeItemFromCart(productId, shade) {
  gkStore.removeFromCart(productId, shade);
  showToast("Item removed");
  renderView('cart');
}

/* 7. CHECKOUT VIEW */
function renderCheckoutView(container) {
  const cart = gkStore.getCart();
  const products = gkStore.getProducts();
  const totals = gkStore.getCartTotal();
  const address = gkStore.getSavedAddress();

  if (cart.length === 0) {
    navigateTo('cart');
    return;
  }

  const totalItemCount = cart.reduce((sum, i) => sum + i.qty, 0);

  container.innerHTML = `
    <div style="padding: 16px;">
      
      <!-- Top Checkout Header Banner -->
      <div style="display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 20px;">
        <div>
          <h2 style="font-size: 22px; font-weight: 800; color: var(--gk-dark); margin: 0; display: flex; align-items: center; gap: 8px;">
            Checkout <span style="background: var(--gk-pink-soft); width: 26px; height: 26px; border-radius: var(--radius-full); display: inline-flex; align-items: center; justify-content: center; font-size: 14px;">🔒</span>
          </h2>
          <div style="font-size: 12px; color: var(--gk-dark-muted); font-weight: 500; margin-top: 2px;">Direct WhatsApp Order Confirmation</div>
        </div>

        <!-- Top Right Safe Badge -->
        <div style="background: #FFF0F5; border: 1px solid var(--gk-pink-light); padding: 8px 12px; border-radius: var(--radius-md); display: flex; align-items: center; gap: 8px; max-width: 170px;">
          <div style="width: 24px; height: 24px; border-radius: var(--radius-full); background: var(--gk-white); color: var(--gk-pink-primary); display: flex; align-items: center; justify-content: center; font-size: 12px; flex-shrink: 0;">🛡️</div>
          <div>
            <div style="font-size: 10px; font-weight: 800; color: var(--gk-dark);">100% Safe & Secure</div>
            <div style="font-size: 9px; color: var(--gk-dark-muted);">Your details are safe with us</div>
          </div>
        </div>
      </div>

      <!-- 1. Customer Details Card -->
      <div class="checkout-card">
        <div class="checkout-card-header">
          <div class="checkout-card-title">
            <div class="checkout-card-icon">👤</div>
            <span>Customer Details</span>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
          <div class="form-group">
            <label>Full Name *</label>
            <div class="input-with-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              <input type="text" id="co-name" class="form-control" value="${address.fullName || ''}" placeholder="Enter your full name" />
            </div>
          </div>

          <div class="form-group">
            <label>WhatsApp Phone Number *</label>
            <div class="input-with-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="#25D366" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              <input type="tel" id="co-phone" class="form-control" value="${address.whatsapp || ''}" placeholder="10-digit WhatsApp number" />
            </div>
            <div style="font-size: 10px; color: var(--gk-dark-muted); margin-top: 4px;">We will contact you on WhatsApp</div>
          </div>
        </div>
      </div>

      <!-- 2. Delivery Address Card -->
      <div class="checkout-card">
        <div class="checkout-card-header">
          <div class="checkout-card-title">
            <div class="checkout-card-icon">📍</div>
            <span>Delivery Address</span>
          </div>
          <span style="font-size: 10px; font-weight: 800; background: #FFF0F5; color: var(--gk-pink-primary); padding: 4px 10px; border-radius: var(--radius-full); border: 1px solid var(--gk-pink-light);">📍 Shikrapur Only</span>
        </div>

        <div class="form-group">
          <label>House / Flat / Building *</label>
          <input type="text" id="co-house" class="form-control" value="${address.house || ''}" placeholder="Flat no, building name" />
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
          <div class="form-group">
            <label>Area / Street *</label>
            <input type="text" id="co-area" class="form-control" value="${address.area || ''}" placeholder="Street, area name" />
          </div>
          <div class="form-group">
            <label>Landmark (Optional)</label>
            <input type="text" id="co-landmark" class="form-control" value="${address.landmark || ''}" placeholder="Near landmark" />
          </div>
        </div>

        <div class="form-group">
          <label>Pincode *</label>
          <input type="text" id="co-pincode" class="form-control" value="412208" readonly style="background:#F9FAFB; color: var(--gk-dark); font-weight: 700;" />
        </div>

        <div style="font-size: 11px; color: var(--gk-dark); background: #FFF0F5; padding: 10px 14px; border-radius: var(--radius-md); border: 1px dashed var(--gk-pink-primary); display: flex; align-items: center; gap: 6px;">
          <span>📍</span> <strong>Note:</strong> After placing your order, please share your location on WhatsApp.
        </div>
      </div>

      <!-- 3. Order Notes Card -->
      <div class="checkout-card">
        <div class="checkout-card-header">
          <div class="checkout-card-title">
            <div class="checkout-card-icon">📝</div>
            <span>Order Notes (Optional)</span>
          </div>
          <span style="font-size: 10px; color: var(--gk-dark-muted); font-weight: 600;">0/150</span>
        </div>
        <textarea id="co-notes" class="form-control" rows="2" placeholder="Any special delivery instructions for us?"></textarea>
      </div>

      <!-- 4. Order Summary Card -->
      <div class="checkout-card">
        <div class="checkout-card-header">
          <div class="checkout-card-title">
            <div class="checkout-card-icon">🛍️</div>
            <span>Order Summary</span>
          </div>
          <div style="font-size: 12px; font-weight: 700; color: var(--gk-pink-primary);">${totalItemCount} Items ˅</div>
        </div>

        <div style="display: flex; flex-direction: column; gap: 8px; font-size: 13px; color: var(--gk-dark-muted); padding-bottom: 12px; border-bottom: 1px dashed var(--gk-gray-border);">
          <div style="display: flex; justify-content: space-between;">
            <span>Subtotal</span>
            <span>₹${totals.subtotal}</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span>Delivery Charges ℹ️</span>
            <span>${totals.deliveryFee === 0 ? '<strong style="color:var(--gk-green);">FREE</strong>' : `₹${totals.deliveryFee}`}</span>
          </div>
          <div style="display: flex; justify-content: space-between; color: var(--gk-green);">
            <span>Discount</span>
            <span>- ₹0</span>
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 12px;">
          <span style="font-size: 16px; font-weight: 800; color: var(--gk-dark);">Total Amount</span>
          <span style="font-size: 22px; font-weight: 800; color: var(--gk-pink-primary);">₹${totals.total}</span>
        </div>
      </div>

      <!-- Primary Action Button -->
      <button class="btn btn-whatsapp" onclick="processPlaceOrder()">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
        <span>Place Order on WhatsApp</span>
        <div class="btn-arrow-circle">→</div>
      </button>
      
      <div style="text-align: center; font-size: 11px; color: var(--gk-dark-muted); margin: 10px 0 24px; display: flex; align-items: center; justify-content: center; gap: 4px;">
        <span>🛡️</span> You will be redirected to WhatsApp to confirm your order
      </div>

      <!-- Bottom Trust Feature Bar (4 Columns) -->
      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; background: var(--gk-white); padding: 12px 8px; border-radius: var(--radius-md); border: 1px solid #F0E6EA; text-align: center;">
        <div>
          <div style="font-size: 16px;">🛡️</div>
          <div style="font-size: 9px; font-weight: 800; color: var(--gk-dark); margin-top: 2px;">100% Original</div>
          <div style="font-size: 8px; color: var(--gk-dark-muted);">Authentic Products</div>
        </div>
        <div>
          <div style="font-size: 16px;">🛵</div>
          <div style="font-size: 9px; font-weight: 800; color: var(--gk-dark); margin-top: 2px;">Fast Delivery</div>
          <div style="font-size: 8px; color: var(--gk-dark-muted);">In Shikrapur</div>
        </div>
        <div>
          <div style="font-size: 16px;">🔒</div>
          <div style="font-size: 9px; font-weight: 800; color: var(--gk-dark); margin-top: 2px;">Safe & Secure</div>
          <div style="font-size: 8px; color: var(--gk-dark-muted);">Fast Order</div>
        </div>
        <div>
          <div style="font-size: 16px;">🎧</div>
          <div style="font-size: 9px; font-weight: 800; color: var(--gk-dark); margin-top: 2px;">Need Help?</div>
          <div style="font-size: 8px; color: var(--gk-dark-muted);">Chat on WhatsApp</div>
        </div>
      </div>

    </div>
  `;
}

function processPlaceOrder() {
  const name = document.getElementById('co-name').value.trim();
  const phone = document.getElementById('co-phone').value.trim();
  const house = document.getElementById('co-house').value.trim();
  const area = document.getElementById('co-area').value.trim();
  const landmark = document.getElementById('co-landmark').value.trim();
  const pincode = document.getElementById('co-pincode').value.trim();
  const notes = document.getElementById('co-notes').value.trim();

  if (!name || !phone || !house || !area) {
    alert("Please fill in your Name, Phone, and Address details!");
    return;
  }

  const addressObj = { fullName: name, whatsapp: phone, house, area, landmark, pincode, city: 'Shikrapur' };
  gkStore.saveAddress(addressObj);

  const cart = gkStore.getCart();
  const products = gkStore.getProducts();
  const totals = gkStore.getCartTotal();

  const itemsFormatted = cart.map(c => {
    const p = products.find(prod => prod.id === c.productId);
    return {
      productId: c.productId,
      productName: p ? p.name : 'Beauty Product',
      shade: c.shade,
      qty: c.qty,
      price: p ? p.price : 0
    };
  });

  const newOrder = gkStore.addOrder({
    items: itemsFormatted,
    totals,
    address: addressObj,
    orderNotes: notes
  });

  // Create real order notification!
  gkStore.addNotification({
    title: 'Order Confirmed 🎉',
    message: `Your order #${newOrder.orderId} of ₹${newOrder.totals.total} was sent to WhatsApp.`,
    icon: '📦'
  });

  // Clear cart
  gkStore.clearCart();

  const waUrl = buildWhatsAppOrderUrl(newOrder);

  // Navigate to Order Success View
  navigateTo('order-success', { order: newOrder });

  // Direct 100% reliable WhatsApp Redirection
  setTimeout(() => {
    window.location.href = waUrl;
  }, 400);
}

/* 8. ORDER SUCCESS VIEW */
function renderOrderSuccessView(container, order) {
  if (!order) {
    navigateTo('home');
    return;
  }

  const waUrl = buildWhatsAppOrderUrl(order);

  container.innerHTML = `
    <div style="text-align: center; padding: 32px 16px;">
      <img src="assets/mascot_glowgirl.png" style="width: 130px; margin-bottom: 16px;" />
      <h2 style="font-size: 22px; font-weight: 800; color: var(--gk-dark);">Order Placed Successfully! 🎉</h2>
      <p style="font-size: 13px; color: var(--gk-dark-muted); margin: 6px 0 20px;">Thank you for shopping with GlowKart!</p>

      <div style="background: var(--gk-white); border-radius: var(--radius-md); padding: 16px; border: 1px solid var(--gk-pink-light); text-align: left; margin-bottom: 20px; box-shadow: var(--shadow-sm);">
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span style="font-size: 12px; color: var(--gk-dark-muted);">Order ID</span>
          <span style="font-size: 14px; font-weight: 800; color: var(--gk-pink-primary);">${order.orderId}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span style="font-size: 12px; color: var(--gk-dark-muted);">Total Amount</span>
          <span style="font-size: 14px; font-weight: 800;">₹${order.totals.total}</span>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <span style="font-size: 12px; color: var(--gk-dark-muted);">Delivery Location</span>
          <span style="font-size: 12px; font-weight: 700;">Shikrapur</span>
        </div>
      </div>

      <div style="background: var(--gk-pink-soft); border-radius: var(--radius-md); padding: 14px; border: 1px dashed var(--gk-pink-primary); font-size: 12px; color: var(--gk-dark); margin-bottom: 20px; text-align: left;">
        💬 <strong>Next Step:</strong> Send your pre-filled message & share your location on WhatsApp. We will send payment UPI details shortly.
      </div>

      <div style="display: flex; flex-direction: column; gap: 10px;">
        <button class="btn btn-whatsapp" onclick="window.location.href='${waUrl}'">Chat on WhatsApp Now 💬</button>
        <button class="btn btn-outline" onclick="navigateTo('orders')">View My Orders</button>
        <button class="btn btn-secondary" onclick="navigateTo('home')">Back to Home</button>
      </div>
    </div>
  `;
}

/* 9. MY ORDERS VIEW */
function renderOrdersView(container) {
  const orders = gkStore.getOrders();

  container.innerHTML = `
    <div style="padding: 16px;">
      <h2 style="font-size: 20px; font-weight: 800; margin-bottom: 4px;">My Orders 📦</h2>
      <p style="font-size: 12px; color: var(--gk-dark-muted); margin-bottom: 16px;">Track & manage your orders</p>

      ${orders.length === 0 ? `
        <div style="text-align: center; padding: 40px 20px;">
          <img src="assets/mascot_glowgirl.png" style="width: 100px; opacity: 0.8; margin-bottom: 12px;" />
          <h3 style="font-size: 16px; font-weight: 800;">No Orders Placed Yet!</h3>
          <p style="font-size: 12px; color: var(--gk-dark-muted); margin: 6px 0 16px;">Explore our cosmetics & place your first order.</p>
          <button class="btn btn-primary" onclick="navigateTo('home')">Shop Now</button>
        </div>
      ` : `
        <div style="display: flex; flex-direction: column; gap: 12px;">
          ${orders.map(o => `
            <div class="order-card">
              <div class="order-header">
                <div>
                  <div class="order-id">${o.orderId}</div>
                  <div style="font-size: 11px; color: var(--gk-dark-muted);">${o.date}</div>
                </div>
                <span class="status-pill ${o.status.toLowerCase()}">${o.status}</span>
              </div>
              <div style="font-size: 13px; font-weight: 700; margin-bottom: 6px;">
                ${o.items.map(i => `${i.productName} (x${i.qty})`).join(', ')}
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px; border-top: 1px solid var(--gk-gray-border); padding-top: 10px;">
                <span style="font-size: 14px; font-weight: 800;">Total: ₹${o.totals.total}</span>
                <button class="btn btn-whatsapp" style="padding: 6px 12px; font-size: 11px; width: auto;" onclick="window.location.href='${buildWhatsAppOrderUrl(o)}'">WhatsApp Chat</button>
              </div>
            </div>
          `).join('')}
          <button class="btn btn-outline" style="margin-top: 12px; color: var(--gk-red); border-color: var(--gk-red);" onclick="confirmClearOrders()">Clear All Orders</button>
        </div>
      `}
    </div>
  `;
}

function confirmClearOrders() {
  if (confirm("Are you sure you want to clear your local order history?")) {
    gkStore.clearAllOrders();
    showToast("Orders cleared");
    renderView('orders');
  }
}

/* 10. OFFERS VIEW */
function renderOffersView(container) {
  const offers = INITIAL_OFFERS;
  container.innerHTML = `
    <div style="padding: 16px;">
      <h2 style="font-size: 20px; font-weight: 800; margin-bottom: 4px;">Exclusive Offers 🎁</h2>
      <p style="font-size: 12px; color: var(--gk-dark-muted); margin-bottom: 16px;">Best deals & coupons for Shikrapur beauty lovers</p>

      <div style="display: flex; flex-direction: column; gap: 12px;">
        ${offers.map(off => `
          <div style="background: var(--gk-white); border-radius: var(--radius-md); padding: 16px; border: 1px solid var(--gk-pink-light); box-shadow: var(--shadow-sm); display: flex; justify-content: space-between; align-items: center;">
            <div>
              <span style="font-size: 10px; font-weight: 800; background: var(--gk-pink-soft); color: var(--gk-pink-primary); padding: 2px 8px; border-radius: var(--radius-full);">${off.type}</span>
              <h4 style="font-size: 15px; font-weight: 800; margin: 4px 0 2px;">${off.title}</h4>
              <div style="font-size: 11px; color: var(--gk-dark-muted);">${off.validity}</div>
            </div>
            <div style="text-align: right;">
              <div style="font-size: 16px; font-weight: 800; color: var(--gk-pink-primary);">${off.discountText}</div>
              <div style="font-size: 11px; font-weight: 700; background: #F3F4F6; padding: 2px 6px; border-radius: 4px; border: 1px dashed #D1D5DB; margin-top: 4px;">${off.code}</div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

/* 11. NOTIFICATIONS VIEW */
function renderNotificationsView(container) {
  const notifs = gkStore.getNotifications();
  gkStore.markAllNotificationsRead();

  container.innerHTML = `
    <div style="padding: 16px;">
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
        <h2 style="font-size: 20px; font-weight: 800; margin: 0;">Notifications 🔔</h2>
      </div>

      ${notifs.length === 0 ? `
        <div style="text-align: center; padding: 50px 20px;">
          <img src="assets/mascot_glowgirl.png" style="width: 110px; opacity: 0.9; margin-bottom: 16px;" />
          <h3 style="font-size: 18px; font-weight: 800; color: var(--gk-dark);">No Notifications Yet! 🔔</h3>
          <p style="font-size: 12px; color: var(--gk-dark-muted); margin: 6px 0 20px;">We'll notify you here when you place an order or get exclusive deals.</p>
          <button class="btn btn-primary" style="width: auto; padding: 10px 24px;" onclick="navigateTo('home')">Start Shopping</button>
        </div>
      ` : `
        <div style="display: flex; flex-direction: column; gap: 10px;">
          ${notifs.map(n => `
            <div style="background: var(--gk-white); border-radius: var(--radius-md); padding: 12px; border: 1px solid var(--gk-gray-border); display: flex; gap: 12px; align-items: center;">
              <div style="font-size: 24px; background: var(--gk-pink-soft); width: 40px; height: 40px; border-radius: var(--radius-full); display: flex; align-items: center; justify-content: center;">${n.icon}</div>
              <div style="flex: 1;">
                <div style="font-size: 13px; font-weight: 800; color: var(--gk-dark);">${n.title}</div>
                <div style="font-size: 12px; color: var(--gk-dark-muted);">${n.message}</div>
                <div style="font-size: 10px; color: #9CA3AF; margin-top: 2px;">${n.time}</div>
              </div>
            </div>
          `).join('')}
        </div>
      `}
    </div>
  `;
}

/* 12. MY GLOWKART (ACCOUNT HUB) VIEW */
function renderMyGlowkartView(container) {
  const address = gkStore.getSavedAddress();
  const orders = gkStore.getOrders();
  const cart = gkStore.getCart();
  const wishlist = gkStore.getWishlist();

  container.innerHTML = `
    <div style="padding: 16px;">
      <!-- Profile Header (Clean Circular Avatar Shape) -->
      <div style="background: var(--gk-white); border-radius: var(--radius-lg); padding: 24px; border: 1px solid var(--gk-pink-light); text-align: center; margin-bottom: 16px; box-shadow: var(--shadow-sm); display: flex; flex-direction: column; align-items: center;">
        <div style="width: 80px; height: 80px; border-radius: 9999px; overflow: hidden; border: 3px solid var(--gk-pink-primary); box-shadow: var(--shadow-pink); margin-bottom: 12px; background: var(--gk-pink-soft);">
          <img src="assets/mascot_glowgirl.png" style="width: 100%; height: 100%; object-fit: cover;" alt="Glow Girl Avatar" />
        </div>
        <h3 style="font-size: 18px; font-weight: 800; margin: 0; color: var(--gk-dark);">My GlowKart 💕</h3>
        <p style="font-size: 12px; color: var(--gk-pink-primary); font-weight: 700; margin-top: 2px;">Delivering in Shikrapur, Maharashtra</p>
      </div>

      <!-- Stats Grid -->
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 16px;">
        <div style="background: var(--gk-white); padding: 14px 8px; border-radius: var(--radius-md); text-align: center; border: 1px solid var(--gk-pink-light); box-shadow: var(--shadow-sm); cursor: pointer;" onclick="navigateTo('orders')">
          <div style="font-size: 20px; font-weight: 800; color: var(--gk-pink-primary);">${orders.length}</div>
          <div style="font-size: 10px; font-weight: 700; color: var(--gk-dark-muted);">Orders Placed</div>
        </div>
        <div style="background: var(--gk-white); padding: 14px 8px; border-radius: var(--radius-md); text-align: center; border: 1px solid var(--gk-pink-light); box-shadow: var(--shadow-sm); cursor: pointer;" onclick="navigateTo('wishlist')">
          <div style="font-size: 20px; font-weight: 800; color: var(--gk-pink-primary);">${wishlist.length}</div>
          <div style="font-size: 10px; font-weight: 700; color: var(--gk-dark-muted);">Wishlist Items</div>
        </div>
        <div style="background: var(--gk-white); padding: 14px 8px; border-radius: var(--radius-md); text-align: center; border: 1px solid var(--gk-pink-light); box-shadow: var(--shadow-sm); cursor: pointer;" onclick="navigateTo('cart')">
          <div style="font-size: 20px; font-weight: 800; color: var(--gk-pink-primary);">${cart.length}</div>
          <div style="font-size: 10px; font-weight: 700; color: var(--gk-dark-muted);">Items in Cart</div>
        </div>
      </div>

      <!-- Info Links with Pink Theme Styling -->
      <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px;">
        
        <!-- PWA Download App Link -->
        <div style="background: linear-gradient(135deg, #FFF0F5 0%, #FFE4E1 100%); border-radius: var(--radius-md); padding: 14px 16px; border: 1.5px solid var(--gk-pink-light); display: flex; align-items: center; justify-content: space-between; cursor: pointer;" onclick="triggerPwaInstall()">
          <div style="display: flex; align-items: center; gap: 12px;">
            <div style="width: 34px; height: 34px; border-radius: var(--radius-full); background: var(--gk-pink-primary); color: white; display: flex; align-items: center; justify-content: center; font-size: 15px;">📲</div>
            <div>
              <div style="font-size: 14px; font-weight: 800; color: var(--gk-pink-primary);">Install GlowKart App</div>
              <div style="font-size: 10px; color: var(--gk-dark-muted);">Download app on your home screen</div>
            </div>
          </div>
          <span style="font-size: 12px; font-weight: 800; background: var(--gk-pink-primary); color: white; padding: 4px 12px; border-radius: var(--radius-full);">Install</span>
        </div>

        <div style="background: var(--gk-white); border-radius: var(--radius-md); padding: 14px 16px; border: 1px solid #F0E6EA; display: flex; align-items: center; justify-content: space-between; cursor: pointer; transition: var(--transition-fast);" onclick="navigateTo('orders')">
          <div style="display: flex; align-items: center; gap: 12px;">
            <div style="width: 34px; height: 34px; border-radius: var(--radius-full); background: var(--gk-pink-soft); color: var(--gk-pink-primary); display: flex; align-items: center; justify-content: center; font-size: 15px;">📦</div>
            <div>
              <div style="font-size: 14px; font-weight: 800; color: var(--gk-dark);">My Orders</div>
              <div style="font-size: 10px; color: var(--gk-dark-muted);">View & track your local orders</div>
            </div>
          </div>
          <span style="font-size: 16px; color: var(--gk-pink-primary); font-weight: 800;">›</span>
        </div>

        <div style="background: var(--gk-white); border-radius: var(--radius-md); padding: 14px 16px; border: 1px solid #F0E6EA; display: flex; align-items: center; justify-content: space-between; cursor: pointer; transition: var(--transition-fast);" onclick="navigateTo('wishlist')">
          <div style="display: flex; align-items: center; gap: 12px;">
            <div style="width: 34px; height: 34px; border-radius: var(--radius-full); background: var(--gk-pink-soft); color: var(--gk-pink-primary); display: flex; align-items: center; justify-content: center; font-size: 15px;">❤️</div>
            <div>
              <div style="font-size: 14px; font-weight: 800; color: var(--gk-dark);">My Wishlist</div>
              <div style="font-size: 10px; color: var(--gk-dark-muted);">Your saved favorite beauty products</div>
            </div>
          </div>
          <span style="font-size: 16px; color: var(--gk-pink-primary); font-weight: 800;">›</span>
        </div>

        <div style="background: var(--gk-white); border-radius: var(--radius-md); padding: 14px 16px; border: 1px solid #F0E6EA; display: flex; align-items: center; justify-content: space-between; cursor: pointer; transition: var(--transition-fast);" onclick="navigateTo('request-product')">
          <div style="display: flex; align-items: center; gap: 12px;">
            <div style="width: 34px; height: 34px; border-radius: var(--radius-full); background: var(--gk-pink-soft); color: var(--gk-pink-primary); display: flex; align-items: center; justify-content: center; font-size: 15px;">💬</div>
            <div>
              <div style="font-size: 14px; font-weight: 800; color: var(--gk-dark);">Request a Product</div>
              <div style="font-size: 10px; color: var(--gk-dark-muted);">Can't find a product? We'll get it for you!</div>
            </div>
          </div>
          <span style="font-size: 16px; color: var(--gk-pink-primary); font-weight: 800;">›</span>
        </div>

        <div style="background: var(--gk-white); border-radius: var(--radius-md); padding: 14px 16px; border: 1px solid #F0E6EA; display: flex; align-items: center; justify-content: space-between; cursor: pointer; transition: var(--transition-fast);" onclick="navigateTo('delivery-info')">
          <div style="display: flex; align-items: center; gap: 12px;">
            <div style="width: 34px; height: 34px; border-radius: var(--radius-full); background: var(--gk-pink-soft); color: var(--gk-pink-primary); display: flex; align-items: center; justify-content: center; font-size: 15px;">🛵</div>
            <div>
              <div style="font-size: 14px; font-weight: 800; color: var(--gk-dark);">Delivery Information</div>
              <div style="font-size: 10px; color: var(--gk-dark-muted);">Fast delivery in Shikrapur, Maharashtra</div>
            </div>
          </div>
          <span style="font-size: 16px; color: var(--gk-pink-primary); font-weight: 800;">›</span>
        </div>

        <div style="background: var(--gk-white); border-radius: var(--radius-md); padding: 14px 16px; border: 1px solid #F0E6EA; display: flex; align-items: center; justify-content: space-between; cursor: pointer; transition: var(--transition-fast);" onclick="window.open('${buildSupportWhatsAppUrl()}', '_blank')">
          <div style="display: flex; align-items: center; gap: 12px;">
            <div style="width: 34px; height: 34px; border-radius: var(--radius-full); background: #E6F4EA; color: #10B981; display: flex; align-items: center; justify-content: center; font-size: 15px;">🟢</div>
            <div>
              <div style="font-size: 14px; font-weight: 800; color: var(--gk-dark);">WhatsApp Support</div>
              <div style="font-size: 10px; color: var(--gk-dark-muted);">Chat with GlowKart customer support</div>
            </div>
          </div>
          <span style="font-size: 16px; color: var(--gk-pink-primary); font-weight: 800;">›</span>
        </div>

      </div>

      <button class="btn btn-outline" style="color: var(--gk-red); border-color: var(--gk-red); font-size: 13px;" onclick="confirmClearAllData()">Clear All Stored Data</button>
    </div>
  `;
}

function confirmClearAllData() {
  if (confirm("Are you sure you want to clear all GlowKart cart, wishlist, address, and orders from this browser?")) {
    gkStore.clearAllData();
    showToast("All data cleared");
    navigateTo('home');
  }
}

/* 13. REQUEST A PRODUCT VIEW */
function renderRequestProductView(container) {
  container.innerHTML = `
    <div style="padding: 16px;">
      <h2 style="font-size: 20px; font-weight: 800; margin-bottom: 4px;">Request a Product 💬</h2>
      <p style="font-size: 12px; color: var(--gk-dark-muted); margin-bottom: 16px;">Can't find your favorite cosmetic item? We will source it for you!</p>

      <div style="background: var(--gk-white); border-radius: var(--radius-md); padding: 16px; border: 1px solid var(--gk-pink-light);">
        <div class="form-group">
          <label>Product Name & Brand</label>
          <input type="text" id="req-prod-input" class="form-control" placeholder="e.g. Lakme 9 to 5 Blush Nude Lipstick" />
        </div>
        <button class="btn btn-whatsapp" onclick="sendProductRequest()">Send Request on WhatsApp 💬</button>
      </div>
    </div>
  `;
}

function sendProductRequest() {
  const val = document.getElementById('req-prod-input').value.trim();
  if (!val) {
    alert("Please enter a product name!");
    return;
  }
  window.open(buildProductRequestUrl(val), '_blank');
}

/* 14. DELIVERY INFO VIEW */
function renderDeliveryInfoView(container) {
  container.innerHTML = `
    <div style="padding: 16px;">
      <h2 style="font-size: 20px; font-weight: 800; margin-bottom: 4px;">Delivery Information 🛵</h2>
      <p style="font-size: 12px; color: var(--gk-dark-muted); margin-bottom: 16px;">Fast local delivery in Shikrapur, Maharashtra</p>

      <div style="background: var(--gk-white); border-radius: var(--radius-md); padding: 16px; border: 1px solid var(--gk-pink-light); display: flex; flex-direction: column; gap: 12px;">
        <div style="font-size: 13px;">📍 <strong>Coverage Area:</strong> Shikrapur Town & surrounding local areas.</div>
        <div style="font-size: 13px;">🚚 <strong>Delivery Fee:</strong> ₹20 standard fee. <strong>FREE Delivery</strong> on orders ₹499 & above!</div>
        <div style="font-size: 13px;">⏱️ <strong>Expected Delivery:</strong> Within 2 to 4 hours of order confirmation.</div>
        <div style="font-size: 13px;">💳 <strong>Payment Method:</strong> UPI (Google Pay, PhonePe, Paytm) after WhatsApp confirmation.</div>
      </div>
    </div>
  `;
}

/* 15. MAINTENANCE VIEW */
function renderMaintenanceView(container) {
  container.innerHTML = `
    <div style="text-align: center; padding: 40px 20px;">
      <img src="assets/mascot_glowgirl.png" style="width: 140px; margin-bottom: 16px;" />
      <h2 style="font-size: 22px; font-weight: 800; color: var(--gk-dark);">We're in Maintenance Break! 🛠️</h2>
      <p style="font-size: 13px; color: var(--gk-dark-muted); margin: 8px 0 20px;">We're currently making some exciting improvements to serve Shikrapur better. We'll be back very soon! 💕</p>
      <button class="btn btn-whatsapp" style="width: auto; padding: 10px 24px;" onclick="window.open('${buildSupportWhatsAppUrl()}', '_blank')">Chat on WhatsApp</button>
    </div>
  `;
}
