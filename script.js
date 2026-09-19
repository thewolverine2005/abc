const products = [
  {
    id: 1,
    name: 'Sharbati Golden Wheat',
    category: 'wheat',
    rate: 2800,
    lot: 100,
    savings: 18,
    location: 'Harda, Madhya Pradesh',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 2,
    name: 'Nashik Red Onion',
    category: 'onion',
    rate: 1900,
    lot: 180,
    savings: 22,
    location: 'Nashik, Maharashtra',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 3,
    name: 'Sona Masoori Rice',
    category: 'rice',
    rate: 4400,
    lot: 250,
    savings: 15,
    location: 'Kurnool, Andhra Pradesh',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 4,
    name: 'Yellow Peas',
    category: 'pulses',
    rate: 5600,
    lot: 80,
    savings: 20,
    location: 'Indore, Madhya Pradesh',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1471193945509-9ad0617afabf?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 5,
    name: 'Fresh Potatoes',
    category: 'potato',
    rate: 1600,
    lot: 220,
    savings: 16,
    location: 'Agra, Uttar Pradesh',
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=900&q=80'
  }
];

let selectedProduct = products[0];
let qty = 70;
let activeFilter = 'all';

const productGrid = document.getElementById('product-grid');
const qtyInput = document.getElementById('qty-input');
const checkoutName = document.getElementById('checkout-name');
const checkoutTotal = document.getElementById('checkout-total');

function renderProducts() {
  const searchTerm = document.getElementById('product-search').value.trim().toLowerCase();
  const sortValue = document.getElementById('sort-select').value;

  let filtered = products.filter((product) => {
    const matchesText = !searchTerm || product.name.toLowerCase().includes(searchTerm) || product.location.toLowerCase().includes(searchTerm);
    const matchesFilter = activeFilter === 'all' || product.category === activeFilter;
    return matchesText && matchesFilter;
  });

  if (sortValue === 'price-low') {
    filtered.sort((a, b) => a.rate - b.rate);
  } else if (sortValue === 'savings-high') {
    filtered.sort((a, b) => b.savings - a.savings);
  }

  productGrid.innerHTML = filtered
    .map(
      (product) => `
        <article class="product-card ${selectedProduct && selectedProduct.id === product.id ? 'selected' : ''}" data-id="${product.id}">
          <div class="product-image">
            <img src="${product.image}" alt="${product.name}" loading="lazy" />
          </div>
          <div class="product-body">
            <div class="product-head">
              <h3>${product.name}</h3>
              <span>★ ${product.rating}</span>
            </div>
            <p class="meta">${product.location}</p>
            <div class="price-box">
              <div>
                <span>Farm rate</span>
                <strong>₹${product.rate.toLocaleString('en-IN')}</strong>
              </div>
              <div>
                <span>Save</span>
                <strong>${product.savings}%</strong>
              </div>
            </div>
            <div class="lot-row">
              <span>${product.lot} qtl</span>
              <span>Min ${Math.min(10, product.lot)} qtl</span>
            </div>
            <button class="primary-btn select-product" data-id="${product.id}">Buy now</button>
          </div>
        </article>
      `
    )
    .join('');

  document.querySelectorAll('.select-product').forEach((button) => {
    button.addEventListener('click', () => {
      const product = products.find((item) => item.id === Number(button.dataset.id));
      if (!product) return;
      selectedProduct = product;
      qty = Math.min(Math.max(Math.round(product.lot * 0.7), 10), product.lot);
      qtyInput.value = qty;
      updateCheckout();
      renderProducts();
    });
  });

  updateCheckout();
}

function updateCheckout() {
  if (!selectedProduct) return;
  checkoutName.textContent = selectedProduct.name;
  const total = selectedProduct.rate * qty + 6000 + 2400;
  checkoutTotal.textContent = `₹${total.toLocaleString('en-IN')}`;
}

function setFilter(filter) {
  activeFilter = filter;
  document.querySelectorAll('.chip').forEach((chip) => {
    chip.classList.toggle('active', chip.dataset.filter === filter);
  });
  renderProducts();
}

function bindEvents() {
  document.getElementById('product-search').addEventListener('input', renderProducts);
  document.getElementById('sort-select').addEventListener('change', renderProducts);

  document.querySelectorAll('.chip').forEach((chip) => {
    chip.addEventListener('click', () => setFilter(chip.dataset.filter));
  });

  document.querySelectorAll('.qty-btn').forEach((button) => {
    button.addEventListener('click', () => {
      const step = Number(button.dataset.step);
      qty = Math.min(Math.max(qty + step, 10), selectedProduct ? selectedProduct.lot : 100);
      qtyInput.value = qty;
      updateCheckout();
    });
  });

  qtyInput.addEventListener('input', () => {
    const value = Number(qtyInput.value) || 10;
    qty = Math.min(Math.max(value, 10), selectedProduct ? selectedProduct.lot : 100);
    qtyInput.value = qty;
    updateCheckout();
  });

  document.getElementById('place-order').addEventListener('click', () => {
    alert(`Escrow deposit created for ${selectedProduct.name} (${qty} qtl).`);
  });

  document.querySelectorAll('.nav-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.nav-btn').forEach((el) => el.classList.toggle('active', el === btn));
      const role = btn.dataset.role;
      document.querySelectorAll('.page-panel').forEach((panel) => {
        panel.classList.toggle('active', panel.dataset.panel === role);
      });
    });
  });
}

bindEvents();
renderProducts();
