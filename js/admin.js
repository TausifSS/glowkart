/* GlowKart Admin Panel Controller */

document.addEventListener('DOMContentLoaded', () => {
  switchAdminTab('dashboard');
  bindAdminEvents();
});

function bindAdminEvents() {
  const form = document.getElementById('product-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      saveProductFromModal();
    });
  }
}

function switchAdminTab(tabName) {
  const titleElem = document.getElementById('admin-page-title');
  const container = document.getElementById('admin-tab-content');

  document.querySelectorAll('.admin-menu-item').forEach(btn => {
    btn.classList.remove('active');
  });

  switch (tabName) {
    case 'dashboard':
      if (titleElem) titleElem.textContent = 'Dashboard Overview';
      renderAdminDashboard(container);
      break;
    case 'products':
      if (titleElem) titleElem.textContent = 'Product Management';
      renderAdminProducts(container);
      break;
    case 'orders':
      if (titleElem) titleElem.textContent = 'Order Management';
      renderAdminOrders(container);
      break;
    case 'offers':
      if (titleElem) titleElem.textContent = 'Offer & Promo Management';
      renderAdminOffers(container);
      break;
  }
}

/* 1. DASHBOARD OVERVIEW */
function renderAdminDashboard(container) {
  const products = gkStore.getProducts();
  const orders = gkStore.getOrders();
  
  const totalSales = orders.reduce((sum, o) => sum + (o.totals ? o.totals.total : 0), 0);

  container.innerHTML = `
    <!-- KPI Cards Grid -->
    <div class="admin-stats-grid">
      <div class="stat-card">
        <div>
          <div class="stat-label">Total Orders</div>
          <div class="stat-val">${orders.length}</div>
        </div>
        <div class="stat-icon">📦</div>
      </div>

      <div class="stat-card">
        <div>
          <div class="stat-label">Total Sales</div>
          <div class="stat-val">₹${totalSales}</div>
        </div>
        <div class="stat-icon">💵</div>
      </div>

      <div class="stat-card">
        <div>
          <div class="stat-label">Active Products</div>
          <div class="stat-val">${products.length}</div>
        </div>
        <div class="stat-icon">💄</div>
      </div>

      <div class="stat-card">
        <div>
          <div class="stat-label">Location Focus</div>
          <div class="stat-val" style="font-size:16px;">Shikrapur</div>
        </div>
        <div class="stat-icon">📍</div>
      </div>
    </div>

    <!-- Recent Orders Table -->
    <div class="table-card">
      <div class="table-header">
        <h3 style="font-size: 16px; font-weight: 800;">Recent Local Orders</h3>
        <button class="btn btn-primary" style="width: auto; padding: 6px 16px; font-size: 12px;" onclick="switchAdminTab('orders')">View All Orders</button>
      </div>

      <table class="admin-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Items</th>
            <th>Total Amount</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          ${orders.length === 0 ? `
            <tr><td colspan="6" style="text-align:center; padding: 24px; color: var(--gk-dark-muted);">No orders placed yet.</td></tr>
          ` : orders.slice(0, 5).map(o => `
            <tr>
              <td><strong>${o.orderId}</strong></td>
              <td>${o.address.fullName}<br><span style="font-size:11px; color:#6B7280;">${o.address.whatsapp}</span></td>
              <td>${o.items.length} Items</td>
              <td><strong>₹${o.totals.total}</strong></td>
              <td><span class="status-pill ${o.status.toLowerCase()}">${o.status}</span></td>
              <td>
                <button class="btn btn-whatsapp" style="padding:4px 10px; font-size:11px; width:auto;" onclick="window.open('${buildWhatsAppOrderUrl(o)}', '_blank')">WhatsApp</button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

/* 2. PRODUCTS MANAGEMENT */
function renderAdminProducts(container) {
  const products = gkStore.getProducts();

  container.innerHTML = `
    <div class="table-card">
      <div class="table-header">
        <h3 style="font-size: 16px; font-weight: 800;">Product Catalogue (${products.length})</h3>
        <button class="btn btn-primary" style="width: auto; padding: 8px 16px; font-size: 12px;" onclick="openProductModal()">+ Add New Product</button>
      </div>

      <table class="admin-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Category</th>
            <th>Price</th>
            <th>MRP</th>
            <th>Stock</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${products.map(p => `
            <tr>
              <td style="display:flex; align-items:center; gap:12px;">
                <img src="${p.image}" style="width:36px; height:36px; object-fit:contain; border-radius:4px; background:#FAF6F8;" />
                <div>
                  <strong>${p.name}</strong><br>
                  <span style="font-size:11px; color:var(--gk-pink-primary);">${p.brand}</span>
                </div>
              </td>
              <td style="text-transform:capitalize;">${p.category}</td>
              <td><strong>₹${p.price}</strong></td>
              <td><span style="color:#9CA3AF; text-decoration:line-through;">₹${p.mrp || '-'}</span></td>
              <td><span style="font-weight:700; color:${p.stock < 20 ? 'var(--gk-red)' : 'var(--gk-green)'}">${p.stock} pcs</span></td>
              <td>
                <button style="border:none; background:none; cursor:pointer; font-size:14px; margin-right:8px;" onclick="editProduct('${p.id}')">✏️</button>
                <button style="border:none; background:none; cursor:pointer; font-size:14px; color:var(--gk-red);" onclick="deleteProduct('${p.id}')">🗑️</button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function openProductModal(productData = null) {
  document.getElementById('p-id').value = productData ? productData.id : '';
  document.getElementById('p-name').value = productData ? productData.name : '';
  document.getElementById('p-brand').value = productData ? productData.brand : '';
  document.getElementById('p-category').value = productData ? productData.category : 'makeup';
  document.getElementById('p-price').value = productData ? productData.price : '';
  document.getElementById('p-mrp').value = productData ? productData.mrp : '';
  document.getElementById('p-stock').value = productData ? productData.stock : '100';
  document.getElementById('p-image').value = productData ? productData.image : '';
  document.getElementById('p-desc').value = productData ? productData.description : '';

  document.getElementById('product-modal-title').textContent = productData ? 'Edit Product' : 'Add New Product';
  document.getElementById('product-modal-backdrop').classList.add('open');
}

function closeProductModal() {
  document.getElementById('product-modal-backdrop').classList.remove('open');
}

function saveProductFromModal() {
  const id = document.getElementById('p-id').value;
  const name = document.getElementById('p-name').value.trim();
  const brand = document.getElementById('p-brand').value.trim();
  const category = document.getElementById('p-category').value;
  const price = parseFloat(document.getElementById('p-price').value);
  const mrp = parseFloat(document.getElementById('p-mrp').value) || price;
  const stock = parseInt(document.getElementById('p-stock').value) || 50;
  const image = document.getElementById('p-image').value.trim();
  const desc = document.getElementById('p-desc').value.trim();

  const discount = mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;

  gkStore.saveProduct({
    id: id || undefined,
    name, brand, category, price, mrp, stock, image, description: desc, discount, isAvailable: true
  });

  closeProductModal();
  switchAdminTab('products');
}

function editProduct(productId) {
  const p = gkStore.getProductById(productId);
  if (p) openProductModal(p);
}

function deleteProduct(productId) {
  if (confirm("Are you sure you want to delete this product?")) {
    gkStore.deleteProduct(productId);
    switchAdminTab('products');
  }
}

/* 3. ORDERS MANAGEMENT */
function renderAdminOrders(container) {
  const orders = gkStore.getOrders();

  container.innerHTML = `
    <div class="table-card">
      <div class="table-header">
        <h3 style="font-size: 16px; font-weight: 800;">Customer Orders Management</h3>
      </div>

      <table class="admin-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Date</th>
            <th>Customer & Contact</th>
            <th>Delivery Address</th>
            <th>Total Amount</th>
            <th>Status Stepper</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${orders.length === 0 ? `
            <tr><td colspan="7" style="text-align:center; padding: 24px;">No customer orders found.</td></tr>
          ` : orders.map(o => `
            <tr>
              <td><strong>${o.orderId}</strong></td>
              <td><span style="font-size:11px; color:#6B7280;">${o.date}</span></td>
              <td>
                <strong>${o.address.fullName}</strong><br>
                <a href="https://wa.me/91${o.address.whatsapp}" target="_blank" style="color:var(--gk-green); font-size:12px; font-weight:700; text-decoration:none;">💬 ${o.address.whatsapp}</a>
              </td>
              <td style="font-size:12px;">${o.address.house}, ${o.address.area}, Shikrapur</td>
              <td><strong>₹${o.totals.total}</strong></td>
              <td>
                <select class="form-control" style="padding:4px 8px; font-size:12px; font-weight:700;" onchange="changeOrderStatus('${o.orderId}', this.value)">
                  <option value="Pending" ${o.status === 'Pending' ? 'selected' : ''}>Pending</option>
                  <option value="Confirmed" ${o.status === 'Confirmed' ? 'selected' : ''}>Confirmed</option>
                  <option value="Delivered" ${o.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
                  <option value="Cancelled" ${o.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
                </select>
              </td>
              <td>
                <button class="btn btn-whatsapp" style="padding:4px 10px; font-size:11px; width:auto;" onclick="window.open('${buildWhatsAppOrderUrl(o)}', '_blank')">WhatsApp Chat</button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function changeOrderStatus(orderId, newStatus) {
  gkStore.updateOrderStatus(orderId, newStatus);
  alert(`Order ${orderId} updated to ${newStatus}`);
}

/* 4. OFFERS MANAGEMENT */
function renderAdminOffers(container) {
  const offers = INITIAL_OFFERS;
  container.innerHTML = `
    <div class="table-card">
      <div class="table-header">
        <h3 style="font-size: 16px; font-weight: 800;">Active Coupons & Offers</h3>
      </div>

      <table class="admin-table">
        <thead>
          <tr>
            <th>Offer Title</th>
            <th>Type</th>
            <th>Coupon Code</th>
            <th>Discount</th>
            <th>Validity</th>
          </tr>
        </thead>
        <tbody>
          ${offers.map(off => `
            <tr>
              <td><strong>${off.title}</strong></td>
              <td><span style="font-size:11px; font-weight:700; background:var(--gk-pink-soft); color:var(--gk-pink-primary); padding:2px 8px; border-radius:10px;">${off.type}</span></td>
              <td><code>${off.code}</code></td>
              <td><strong>${off.discountText}</strong></td>
              <td>${off.validity}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}
