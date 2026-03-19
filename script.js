/* ══════════ PRODUCT DATA ══════════ */
const products = [
    { id: 1, name: "Urban Flex Sneakers", cat: "sneakers", price: 2499, original: 3099, discount: 20, rating: 4.5, reviews: 320, desc: "Lightweight, breathable, everyday comfort", img: "images/product_sneakers.png", badge: "Bestseller" },
    { id: 2, name: "ClassicStride Formals", cat: "formal", price: 3299, original: 4499, discount: 27, rating: 4.7, reviews: 198, desc: "Premium leather, boardroom ready", img: "images/product_formals.png", badge: "New" },
    { id: 3, name: "RunBolt Sports", cat: "sports", price: 2799, original: 3499, discount: 20, rating: 4.6, reviews: 445, desc: "Engineered for speed and grip", img: "images/product_sports.png", badge: "Trending" },
    { id: 4, name: "DriftWalk Casuals", cat: "casual", price: 1899, original: 2499, discount: 24, rating: 4.3, reviews: 267, desc: "Laid-back style, cloud-soft comfort", img: "images/product_casual.png", badge: "Popular" },
    { id: 5, name: "EcoStep Knit", cat: "sneakers", price: 2199, original: 2999, discount: 27, rating: 4.4, reviews: 189, desc: "Sustainable knit, zero compromise", img: "images/product_knit.png", badge: "Eco" },
    { id: 6, name: "PowerTrail Hikers", cat: "sports", price: 3499, original: 4299, discount: 19, rating: 4.8, reviews: 156, desc: "Built for trails and adventures", img: "images/product_hikers.png", badge: "Bestseller" },
    { id: 7, name: "SlimLine Loafers", cat: "formal", price: 2899, original: 3799, discount: 24, rating: 4.5, reviews: 211, desc: "Sleek design for modern professionals", img: "images/product_loafers.png", badge: "Premium" },
    { id: 8, name: "BreezeFit Sliders", cat: "casual", price: 999, original: 1499, discount: 33, rating: 4.2, reviews: 534, desc: "Summer essential, ultra lightweight", img: "images/product_sliders.png", badge: "Sale" },
];

let cart = [];
let wishlist = [];

/* ══════════ DOM READY ══════════ */
document.addEventListener("DOMContentLoaded", () => {
    renderProducts("all");
    initNavbar();
    initSearch();
    initFilters();
    initScrollAnimations();
    initReviewCarousel();
    initCart();
    initModal();
    initNewsletter();
    initBackToTop();
    initMobileMenu();
    initSizeColorSelectors();
    initTabs();
});

/* ══════════ RENDER PRODUCTS ══════════ */
function renderProducts(filter) {
    const grid = document.getElementById("productsGrid");
    const filtered = filter === "all" ? products : products.filter(p => p.cat === filter);
    grid.innerHTML = filtered.map(p => `
    <div class="product-card" data-id="${p.id}">
      <div class="product-img">
        <img src="${p.img}" alt="${p.name}" loading="lazy" />
        ${p.badge ? `<span class="product-badge">${p.badge}</span>` : ""}
        <button class="wishlist-toggle ${wishlist.includes(p.id) ? 'active' : ''}" data-id="${p.id}" title="Add to Wishlist">${wishlist.includes(p.id) ? '❤️' : '🤍'}</button>
        <button class="quick-view" data-id="${p.id}">Quick View</button>
      </div>
      <div class="product-info">
        <h3 class="product-name">${p.name}</h3>
        <p class="product-desc">${p.desc}</p>
        <div class="product-price">
          <span class="price-current">₹${p.price.toLocaleString()}</span>
          <span class="price-original">₹${p.original.toLocaleString()}</span>
          <span class="price-discount">${p.discount}% OFF</span>
        </div>
        <div class="product-rating">${"★".repeat(Math.floor(p.rating))}${p.rating % 1 ? "½" : ""}${"☆".repeat(5 - Math.ceil(p.rating))} <span>(${p.reviews} reviews)</span></div>
        <button class="add-to-cart-btn" data-id="${p.id}">Add to Cart 🛒</button>
      </div>
    </div>
  `).join("");
    grid.querySelectorAll(".add-to-cart-btn").forEach(btn => btn.addEventListener("click", e => addToCart(+e.target.dataset.id)));
    grid.querySelectorAll(".quick-view").forEach(btn => btn.addEventListener("click", e => openQuickView(+e.target.dataset.id)));
    grid.querySelectorAll(".wishlist-toggle").forEach(btn => btn.addEventListener("click", e => {
        e.stopPropagation();
        toggleWishlist(+e.currentTarget.dataset.id);
    }));
}

/* ══════════ NAVBAR ══════════ */
function initNavbar() {
    window.addEventListener("scroll", () => {
        document.getElementById("navbar").classList.toggle("scrolled", window.scrollY > 50);
    });
}

/* ══════════ MOBILE MENU ══════════ */
function initMobileMenu() {
    const hamburger = document.getElementById("hamburger");
    const links = document.getElementById("navLinks");
    hamburger.addEventListener("click", () => {
        links.classList.toggle("open");
        hamburger.classList.toggle("active");
    });
    links.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
        links.classList.remove("open");
        hamburger.classList.remove("active");
    }));
}

/* ══════════ SEARCH ══════════ */
function initSearch() {
    const overlay = document.getElementById("searchOverlay");
    document.getElementById("searchToggle").addEventListener("click", () => overlay.classList.toggle("active"));
    document.getElementById("searchClose").addEventListener("click", () => overlay.classList.remove("active"));
    document.getElementById("searchInput").addEventListener("input", e => {
        const q = e.target.value.toLowerCase();
        if (q.length > 1) {
            const filtered = products.filter(p => p.name.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q) || p.cat.includes(q));
            renderFilteredProducts(filtered);
        } else if (q.length === 0) renderProducts("all");
    });
}
function renderFilteredProducts(filtered) {
    const grid = document.getElementById("productsGrid");
    if (filtered.length === 0) { grid.innerHTML = '<p style="text-align:center;grid-column:1/-1;color:var(--text-muted);padding:40px">No products found. Try a different search.</p>'; return; }
    // Re-use renderProducts logic by temporarily replacing products
    grid.innerHTML = filtered.map(p => `
    <div class="product-card" data-id="${p.id}">
      <div class="product-img"><img src="${p.img}" alt="${p.name}" loading="lazy" />${p.badge ? `<span class="product-badge">${p.badge}</span>` : ""}<button class="wishlist-toggle ${wishlist.includes(p.id) ? 'active' : ''}" data-id="${p.id}">${wishlist.includes(p.id) ? '❤️' : '🤍'}</button><button class="quick-view" data-id="${p.id}">Quick View</button></div>
      <div class="product-info"><h3 class="product-name">${p.name}</h3><p class="product-desc">${p.desc}</p><div class="product-price"><span class="price-current">₹${p.price.toLocaleString()}</span><span class="price-original">₹${p.original.toLocaleString()}</span><span class="price-discount">${p.discount}% OFF</span></div><div class="product-rating">${"★".repeat(Math.floor(p.rating))} <span>(${p.reviews} reviews)</span></div><button class="add-to-cart-btn" data-id="${p.id}">Add to Cart 🛒</button></div>
    </div>`).join("");
    grid.querySelectorAll(".add-to-cart-btn").forEach(btn => btn.addEventListener("click", e => addToCart(+e.target.dataset.id)));
    grid.querySelectorAll(".quick-view").forEach(btn => btn.addEventListener("click", e => openQuickView(+e.target.dataset.id)));
    grid.querySelectorAll(".wishlist-toggle").forEach(btn => btn.addEventListener("click", e => { e.stopPropagation(); toggleWishlist(+e.currentTarget.dataset.id) }));
}

/* ══════════ FILTERS ══════════ */
function initFilters() {
    document.querySelectorAll(".filter-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            renderProducts(btn.dataset.filter);
        });
    });
}

/* ══════════ SCROLL ANIMATIONS ══════════ */
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add("visible"); observer.unobserve(entry.target); } });
    }, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });
    document.querySelectorAll(".fade-up").forEach(el => observer.observe(el));
}

/* ══════════ REVIEW CAROUSEL ══════════ */
function initReviewCarousel() {
    const carousel = document.getElementById("reviewsCarousel");
    const dotsContainer = document.getElementById("carouselDots");
    const cards = carousel.querySelectorAll(".review-card");
    cards.forEach((_, i) => {
        const dot = document.createElement("div");
        dot.className = `carousel-dot${i === 0 ? " active" : ""}`;
        dot.addEventListener("click", () => {
            cards[i].scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
        });
        dotsContainer.appendChild(dot);
    });
    carousel.addEventListener("scroll", () => {
        const scrollLeft = carousel.scrollLeft;
        const cardWidth = cards[0].offsetWidth + 24;
        const activeIndex = Math.round(scrollLeft / cardWidth);
        dotsContainer.querySelectorAll(".carousel-dot").forEach((d, i) => d.classList.toggle("active", i === activeIndex));
    });
}

/* ══════════ CART ══════════ */
function initCart() {
    document.getElementById("cartToggle").addEventListener("click", () => toggleCart(true));
    document.getElementById("cartClose").addEventListener("click", () => toggleCart(false));
    document.getElementById("cartOverlay").addEventListener("click", e => { if (e.target.id === "cartOverlay") toggleCart(false); });
    document.getElementById("applyCoupon").addEventListener("click", () => {
        const code = document.getElementById("couponInput").value.trim().toUpperCase();
        if (code === "SOLE25") showToast("🎉 Coupon applied! 25% OFF");
        else showToast("❌ Invalid coupon code");
    });
}
function toggleCart(show) { document.getElementById("cartOverlay").classList.toggle("active", show); document.body.style.overflow = show ? "hidden" : ""; }

function addToCart(id) {
    const existing = cart.find(c => c.id === id);
    if (existing) existing.qty++;
    else cart.push({ id, qty: 1 });
    updateCart();
    showToast("Added to cart! 🛒");
}
function updateCart() {
    const container = document.getElementById("cartItems");
    const footer = document.getElementById("cartFooter");
    document.getElementById("cartCount").textContent = cart.reduce((s, c) => s + c.qty, 0);
    if (cart.length === 0) {
        container.innerHTML = '<div class="cart-empty"><span>👟</span><p>Your cart is empty</p><a href="#products" class="btn btn-primary btn-sm" onclick="toggleCart(false)">Start Shopping</a></div>';
        footer.style.display = "none"; return;
    }
    footer.style.display = "block";
    container.innerHTML = cart.map(c => {
        const p = products.find(pr => pr.id === c.id);
        return `<div class="cart-item"><div class="cart-item-img"><img src="${p.img}" alt="${p.name}" style="width:100%;height:100%;object-fit:cover;border-radius:8px" /></div><div class="cart-item-info"><div class="cart-item-name">${p.name}</div><div class="cart-item-meta">Size: 8 • Qty: ${c.qty}</div><div class="cart-item-bottom"><span class="cart-item-price">₹${(p.price * c.qty).toLocaleString()}</span><div class="qty-controls"><button class="qty-btn" onclick="changeQty(${p.id},-1)">−</button><span>${c.qty}</span><button class="qty-btn" onclick="changeQty(${p.id},1)">+</button></div></div><span class="remove-item" onclick="removeFromCart(${p.id})">Remove</span></div></div>`;
    }).join("");
    const subtotal = cart.reduce((s, c) => s + products.find(p => p.id === c.id).price * c.qty, 0);
    document.getElementById("cartSubtotal").textContent = `₹${subtotal.toLocaleString()}`;
    document.getElementById("cartTotal").textContent = `₹${subtotal.toLocaleString()}`;
}
function changeQty(id, delta) { const item = cart.find(c => c.id === id); if (item) { item.qty += delta; if (item.qty <= 0) cart = cart.filter(c => c.id !== id); updateCart(); } }
function removeFromCart(id) { cart = cart.filter(c => c.id !== id); updateCart(); showToast("Removed from cart"); }

/* ══════════ WISHLIST ══════════ */
function toggleWishlist(id) {
    const idx = wishlist.indexOf(id);
    if (idx > -1) { wishlist.splice(idx, 1); showToast("Removed from wishlist"); }
    else { wishlist.push(id); showToast("Added to wishlist ❤️"); }
    document.getElementById("wishlistCount").textContent = wishlist.length;
    const activeFilter = document.querySelector(".filter-btn.active")?.dataset.filter || "all";
    renderProducts(activeFilter);
}

/* ══════════ QUICK VIEW MODAL ══════════ */
function initModal() {
    document.getElementById("modalClose").addEventListener("click", closeModal);
    document.getElementById("quickViewModal").addEventListener("click", e => { if (e.target.id === "quickViewModal") closeModal(); });
    document.getElementById("modalAddCart").addEventListener("click", () => {
        const id = +document.getElementById("quickViewModal").dataset.productId;
        addToCart(id); closeModal();
    });
}
function openQuickView(id) {
    const p = products.find(pr => pr.id === id);
    const modal = document.getElementById("quickViewModal");
    modal.dataset.productId = id;
    document.getElementById("modalMainImg").innerHTML = `<img src="${p.img}" alt="${p.name}" style="width:100%;height:100%;object-fit:contain" />`;
    document.getElementById("modalThumbs").innerHTML = `<div class="active"><img src="${p.img}" alt="view 1" style="width:100%;height:100%;object-fit:cover" /></div><div><img src="${p.img}" alt="view 2" style="width:100%;height:100%;object-fit:cover;filter:brightness(0.9)" /></div><div><img src="${p.img}" alt="view 3" style="width:100%;height:100%;object-fit:cover;filter:saturate(0.5)" /></div>`;
    document.getElementById("modalTitle").textContent = p.name;
    document.getElementById("modalPrice").textContent = `₹${p.price.toLocaleString()}`;
    document.getElementById("modalOriginal").textContent = `₹${p.original.toLocaleString()}`;
    document.getElementById("modalDiscount").textContent = `${p.discount}% OFF`;
    document.getElementById("modalRating").innerHTML = `${"★".repeat(Math.floor(p.rating))} ${p.rating} (${p.reviews} reviews)`;
    document.getElementById("modalDesc").textContent = p.desc;
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
}
function closeModal() { document.getElementById("quickViewModal").classList.remove("active"); document.body.style.overflow = ""; }

/* ══════════ SIZE & COLOR SELECTORS ══════════ */
function initSizeColorSelectors() {
    document.querySelectorAll(".size-btn").forEach(btn => btn.addEventListener("click", () => {
        document.querySelectorAll(".size-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
    }));
    document.querySelectorAll(".color-swatch").forEach(btn => btn.addEventListener("click", () => {
        document.querySelectorAll(".color-swatch").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
    }));
}

/* ══════════ TABS ══════════ */
function initTabs() {
    document.querySelectorAll(".tab-btn").forEach(btn => btn.addEventListener("click", () => {
        document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
        document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));
        btn.classList.add("active");
        const tab = btn.dataset.tab;
        document.getElementById("tab" + tab.charAt(0).toUpperCase() + tab.slice(1)).classList.add("active");
    }));
}

/* ══════════ NEWSLETTER ══════════ */
function initNewsletter() {
    document.getElementById("newsletterForm").addEventListener("submit", e => {
        e.preventDefault();
        showToast("🎉 Subscribed successfully!");
        e.target.reset();
    });
}

/* ══════════ BACK TO TOP ══════════ */
function initBackToTop() {
    const btn = document.getElementById("backToTop");
    window.addEventListener("scroll", () => btn.classList.toggle("visible", window.scrollY > 500));
    btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

/* ══════════ TOAST ══════════ */
function showToast(text) {
    const toast = document.getElementById("toast");
    document.getElementById("toastText").textContent = text;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2500);
}

/* Make cart functions globally accessible */
window.changeQty = changeQty;
window.removeFromCart = removeFromCart;
window.toggleCart = toggleCart;
