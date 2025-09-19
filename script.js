// Sample product data
const PRODUCTS = [
  {
    id: 1,
    title: "Blue Shirt",
    price: 1200,
    category: "Clothing",
    img: "assets/shirt1.jpg",
    description: "Comfortable cotton shirt.",
  },
  {
    id: 2,
    title: "Sneakers",
    price: 2500,
    category: "Shoes",
    img: "assets/sneakers1.jpg",
    description: "Stylish sneakers perfect for everyday wear.",
  },
  {
    id: 3,
    title: "Leather Belt",
    price: 800,
    category: "Accessories",
    img: "assets/Belt1.jpg",
    description: "Durable leather belt with metal buckle.",
  },
  {
    id: 4,
    title: "Denim Jeans",
    price: 1800,
    category: "Clothing",
    img: "assets/jeans1.jpg",
    description: "Classic denim jeans with slim fit style.",
  },
  {
    id: 5,
    title: "Sunglasses",
    price: 900,
    category: "Accessories",
    img: "assets/sunglasses1.jpg",
    description: "Trendy sunglasses with UV protection.",
  },
  {
    id: 6,
    title: "Running Shorts",
    price: 700,
    category: "Clothing",
    img: "assets/shorts1.jpg",
    description: "Lightweight and comfortable running shorts.",
  },
  {
    id: 7,
    title: "Formal Shoes",
    price: 3000,
    category: "Shoes",
    img: "assets/shoes_formal.jpg",
    description: "Elegant formal shoes for office and events.",
  },
  {
    id: 8,
    title: "Cap",
    price: 500,
    category: "Accessories",
    img: "assets/cap1.jpg",
    description: "Casual cap for sunny days.",
  },
  {
    id: 9,
    title: "Wrist Watch",
    price: 4500,
    category: "Watches",
    img: "assets/watch1.jpg",
    description: "Premium wrist watch with leather strap.",
  },
];

// storage and cart helpers
const CART_KEY = "buddy_cart_v1";
function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch (e) {
    return [];
  }
}
function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartBadge();
}
function updateCartBadge() {
  const el = document.getElementById("cart-count");
  if (!el) return;
  const cart = getCart();
  el.textContent = cart.reduce((s, i) => s + (i.quantity || 0), 0);
}
function addToCart(productId, qty = 1) {
  const cart = getCart();
  const existing = cart.find((i) => i.id === productId);
  if (existing) existing.quantity = Number(existing.quantity) + Number(qty);
  else cart.push({ id: productId, quantity: Number(qty) });
  saveCart(cart);
}
function removeFromCart(productId) {
  let cart = getCart();
  cart = cart.filter((i) => i.id !== productId);
  saveCart(cart);
}
function setQuantity(productId, quantity) {
  const cart = getCart();
  const it = cart.find((i) => i.id === productId);
  if (!it) return;
  it.quantity = Math.max(1, Number(quantity));
  saveCart(cart);
}
function findProduct(id) {
  return PRODUCTS.find((p) => p.id === id);
}

// Toast helper (replaces native alert with non-blocking toast messages)
function showToast(message, options = {}) {
  const { title = "", type = "info", duration = 3000 } = options;
  const container = document.getElementById("toast-container");
  if (!container) return; // fallback

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <div class="icon">${
      type === "success"
        ? "✓"
        : type === "error"
        ? "!"
        : type === "warning"
        ? "⚠"
        : "i"
    }</div>
    <div class="content">
      ${title ? `<div class="title">${title}</div>` : ""}
      <div class="message">${message}</div>
    </div>
  `;

  // allow manual dismissal on click
  toast.addEventListener("click", () => dismissToast(toast));

  container.appendChild(toast);

  // auto-dismiss
  const hideTimeout = setTimeout(() => dismissToast(toast), duration);

  function dismissToast(node) {
    if (!node) return;
    clearTimeout(hideTimeout);
    node.style.animation = "toast-out 220ms ease forwards";
    node.addEventListener("animationend", () => {
      try {
        container.removeChild(node);
      } catch (e) {}
    });
  }
}

// UI elements
const productList = document.getElementById("product-list");
const categoryFilter = document.getElementById("categoryFilter");
const cartToggle = document.getElementById("cartToggle");
const cartSidebar = document.getElementById("cart");
const closeCartBtn = document.getElementById("closeCart");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotalEl = document.getElementById("cart-total");
const overlay = document.getElementById("overlay");
const productDetailSection = document.getElementById("productDetailSection");
const productsSection = document.getElementById("productsSection");
const productDetail = document.getElementById("productDetail");
const backToList = document.getElementById("backToList");
const checkoutModal = document.getElementById("checkoutModal");
const openCheckout = document.getElementById("openCheckout");
const closeCheckout = document.getElementById("closeCheckout");
const checkoutForm = document.getElementById("checkoutForm");
const orderResult = document.getElementById("orderResult");

// Populate category select
function populateCategories() {
  const cats = ["all", ...new Set(PRODUCTS.map((p) => p.category))];
  categoryFilter.innerHTML = cats
    .map((c) => `<option value="${c}">${c}</option>`)
    .join("");
}

// Render products grid
function renderProducts(list = PRODUCTS) {
  productList.innerHTML = "";
  list.forEach((p) => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <img src="${p.img}" alt="${p.title}" onerror="this.src='assets/images/placeholder.png'"/>
      <h3>${p.title}</h3>
      <p>${p.description}</p>
      <div class="price-row">Rs.${p.price}</div>
      <div style="margin-top:10px">
        <button class="btn add-btn" data-id="${p.id}">Add to cart</button>
        <button class="view-btn" data-id="${p.id}">View</button>
      </div>
    `;
    productList.appendChild(card);
  });
  // wire up buttons
  document.querySelectorAll(".add-btn").forEach((b) =>
    b.addEventListener("click", () => {
      addToCart(Number(b.dataset.id), 1);
      renderCartSidebar();
      showToast("Added to cart", { type: "success" });
    })
  );
  document.querySelectorAll(".view-btn").forEach((b) =>
    b.addEventListener("click", () => {
      showProductDetail(Number(b.dataset.id));
    })
  );
}

// Show product detail (single page)
function showProductDetail(id) {
  const p = findProduct(id);
  if (!p) return;
  productsSection.classList.add("hidden");
  productDetailSection.classList.remove("hidden");
  productDetail.innerHTML = `
    <div class="product-detail-card">
      <img src="${p.img}" alt="${p.title}" onerror="this.src='assets/images/placeholder.png'"/>
      <div class="info">
        <h1>${p.title}</h1>
        <div class="muted">${p.category}</div>
        <div class="price-row">Rs.${p.price}</div>
        <p>${p.description}</p>
        <div style="margin-top:12px">
          <input id="qtyInput" type="number" min="1" value="1" style="width:72px;padding:6px"/>
          <button id="addToCartBtn" class="btn">Add to Cart</button>
        </div>
      </div>
    </div>
  `;
  document.getElementById("addToCartBtn").addEventListener("click", () => {
    const q = Number(document.getElementById("qtyInput").value) || 1;
    addToCart(p.id, q);
    showToast("Added to cart", { type: "success" });
  });
}

// Back button
backToList.addEventListener("click", () => {
  productDetailSection.classList.add("hidden");
  productsSection.classList.remove("hidden");
});

// Filter by category
categoryFilter.addEventListener("change", () => {
  const v = categoryFilter.value;
  if (v === "all") renderProducts(PRODUCTS);
  else renderProducts(PRODUCTS.filter((p) => p.category === v));
});

// Cart sidebar open/close
cartToggle &&
  cartToggle.addEventListener("click", () => {
    cartSidebar.classList.add("open");
    cartSidebar.setAttribute("aria-hidden", "false");
    overlay.classList.remove("hidden");
    renderCartSidebar();
  });
closeCartBtn && closeCartBtn.addEventListener("click", closeCart);
overlay.addEventListener("click", closeCart);
function closeCart() {
  cartSidebar.classList.remove("open");
  cartSidebar.setAttribute("aria-hidden", "true");
  overlay.classList.add("hidden");
}

// Render cart sidebar content
function renderCartSidebar() {
  const cart = getCart();
  cartItemsContainer.innerHTML = "";
  let total = 0;
  if (cart.length === 0) {
    cartItemsContainer.innerHTML = "<p>Your cart is empty.</p>";
  } else {
    cart.forEach((item) => {
      const p = findProduct(item.id);
      if (!p) return;
      total += p.price * item.quantity;
      const node = document.createElement("div");
      node.className = "cart-item";
      node.innerHTML = `
        <img src="${p.img}" alt="${
        p.title
      }" onerror="this.src='assets/images/placeholder.png'"/>
        <div style="flex:1">
          <div style="font-weight:600">${p.title}</div>
          <div style="font-size:13px;color:#64748b">Rs.${p.price} × ${
        item.quantity
      }</div>
          <div style="margin-top:6px">
            <button class="qty" data-id="${p.id}" data-op="minus">-</button>
            <input class="qty-input" data-id="${p.id}" value="${
        item.quantity
      }" />
            <button class="qty" data-id="${p.id}" data-op="plus">+</button>
            <button class="remove" data-id="${
              p.id
            }" style="margin-left:8px;color:#ef4444">Remove</button>
          </div>
        </div>
        <div style="min-width:70px;text-align:right">Rs.${
          p.price * item.quantity
        }</div>
      `;
      cartItemsContainer.appendChild(node);
    });
  }
  cartTotalEl.textContent = `Total: Rs.${total}`;
  updateCartBadge();

  // wire qty and remove
  document.querySelectorAll(".qty").forEach((b) =>
    b.addEventListener("click", () => {
      const id = Number(b.dataset.id),
        op = b.dataset.op;
      const cart = getCart();
      const it = cart.find((x) => x.id === id);
      if (!it) return;
      if (op === "plus") it.quantity = Number(it.quantity) + 1;
      else it.quantity = Math.max(1, Number(it.quantity) - 1);
      saveCart(cart);
      renderCartSidebar();
    })
  );
  document.querySelectorAll(".remove").forEach((b) =>
    b.addEventListener("click", () => {
      removeFromCart(Number(b.dataset.id));
      renderCartSidebar();
    })
  );
  document.querySelectorAll(".qty-input").forEach((inp) =>
    inp.addEventListener("change", () => {
      const id = Number(inp.dataset.id);
      const q = Number(inp.value) || 1;
      setQuantity(id, q);
      renderCartSidebar();
    })
  );
}

// Checkout modal open
openCheckout &&
  openCheckout.addEventListener("click", () => {
    checkoutModal.classList.remove("hidden");
    overlay.classList.remove("hidden");
    checkoutModal.setAttribute("aria-hidden", "false");
  });
closeCheckout &&
  closeCheckout.addEventListener("click", () => {
    checkoutModal.classList.add("hidden");
    overlay.classList.add("hidden");
    checkoutModal.setAttribute("aria-hidden", "true");
  });

// Checkout form submit
if (checkoutForm)
  checkoutForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(checkoutForm).entries());
    const cart = getCart();
    if (!cart || cart.length === 0) {
      showToast("Your cart is empty.", { type: "warning" });
      return;
    }
    const total = cart.reduce(
      (s, i) => s + findProduct(i.id).price * i.quantity,
      0
    );
    const order = {
      id: "ORD" + Date.now(),
      customer: data,
      items: cart,
      total,
      createdAt: new Date().toISOString(),
    };
    saveCart([]);
    renderCartSidebar();
    checkoutModal.classList.add("hidden");
    overlay.classList.add("hidden");
    orderResult.innerHTML = `<div><h3>Order placed — ${order.id}</h3><p>Total: Rs.${order.total}</p><p>Confirmation sent to ${data.email}</p></div>`;
    showToast("Order placed! Thank you for your purchase.", {
      type: "success",
      duration: 4500,
    });
  });

// initial render
populateCategories();
renderProducts();
renderCartSidebar();
