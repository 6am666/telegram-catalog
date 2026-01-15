const tg = window.Telegram.WebApp;
tg.expand();

let cart = [];
let inCartScreen = false;

const containerEl = document.getElementById("products");
const searchInput = document.getElementById("searchInput");
const cartButton = document.getElementById("cartButton");
const checkoutButton = document.getElementById("checkoutButton");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");
const mainTitle = document.getElementById("mainTitle");

const menuIcon = document.getElementById("menuIcon");
const categories = document.getElementById("categories");

const modal = document.getElementById("modal");
const modalImage = document.getElementById("modalImage");
const modalTitle = document.getElementById("modalTitle");
const modalPrice = document.getElementById("modalPrice");
const modalAdd = document.getElementById("modalAdd");
const modalClose = document.getElementById("modalClose");
const modalBack = document.getElementById("modalBack");

let currentModalProduct = null;

const products = [
  {id:1,name:"Колье Pierced Chain",price:2500,image:"https://i.pinimg.com/736x/37/0b/db/370bdb870346b42b1000610195261f62.jpg",category:"Колье"},
  {id:2,name:"Колье Starry Sky",price:4500,image:"https://i.pinimg.com/736x/55/bf/ec/55bfecc3c2ceebf20752ff2802ff4e19.jpg",category:"Колье"},
  {id:3,name:"Колье Gothic Thorns",price:3600,image:"https://i.pinimg.com/736x/c2/0d/26/c20d26fb9839c64d328f8989450f547b.jpg",category:"Колье"},
  {id:4,name:"Браслет Hearts",price:4000,image:"https://i.pinimg.com/736x/d4/c5/4c/d4c54cd9c489d1e73d9e306545929b70.jpg",category:"Браслеты"},
  {id:5,name:"Обвес Lighter",price:3600,image:"https://i.pinimg.com/736x/e8/cb/c2/e8cbc2287025b23930c20e030755a0b5.jpg",category:"Обвесы"},
  {id:6,name:"Обвес Star",price:2000,image:"https://i.pinimg.com/736x/16/36/75/163675cf410dfc51ef97238bbbab1056.jpg",category:"Обвесы"},
  {id:7,name:"Серьги Moonlight",price:2000,image:"https://i.pinimg.com/736x/93/e4/e5/93e4e5ee7594f6ef436f8b994ef04016.jpg",category:"Серьги"},
  {id:8,name:"Кулон с цепочкой Moonlight",price:2000,image:"https://i.pinimg.com/736x/5a/6d/1b/5a6d1beecdc7b79798705e4da0ef3a5c.jpg",category:"Кулоны"},
];

// --- Рендер товаров ---
function renderProducts(list = products) {
  containerEl.innerHTML = "";

  searchInput.style.display = inCartScreen ? "none" : "block";
  cartTotal.style.display = inCartScreen ? "block" : "none";
  checkoutButton.style.display = inCartScreen ? "flex" : "none";

  list.forEach(p => {
    const card = document.createElement("div");
    card.className = "product";

    const img = new Image();
    img.src = p.image;
    img.alt = p.name;

    // --- кнопки ---
    if (inCartScreen) {
      card.innerHTML = `<h3>${p.name}</h3><p>${p.price} ₽</p>
        <div style="display:flex; justify-content:center; gap:6px;">
          <button class="remove-btn">-</button>
          <span>${countInCart(p)}</span>
          <button class="add-btn">+</button>
        </div>`;
      card.querySelector(".remove-btn").onclick = e => { e.stopPropagation(); removeFromCart(p); };
      card.querySelector(".add-btn").onclick = e => { e.stopPropagation(); addToCart(p); };
    } else {
      card.innerHTML = `<h3>${p.name}</h3><p>${p.price} ₽</p>
        <button class="add-btn">В корзину</button>`;
      card.querySelector(".add-btn").onclick = e => { 
        e.stopPropagation(); 
        flyToCart(img); 
        addToCart(p); 
      };
      card.onclick = () => openModal(p);
    }

    card.prepend(img);
    containerEl.appendChild(card);
  });

  updateCartCount();
  updateCartTotal();
}

// --- Подсчет количества товара ---
function countInCart(product) {
  return cart.filter(p => p.id === product.id).length;
}

// --- Добавить в корзину ---
function addToCart(product) {
  cart.push(product);
  renderProducts(inCartScreen ? cart : undefined);
}

// --- Удалить один товар ---
function removeFromCart(product) {
  const idx = cart.findIndex(p => p.id === product.id);
  if(idx !== -1) cart.splice(idx,1);
  renderProducts(inCartScreen ? cart : undefined);
}

// --- Очистка корзины ---
function clearCart() {
  cart = [];
  renderProducts(inCartScreen ? cart : undefined);
}

// --- Счетчики ---
function updateCartCount() { cartCount.textContent = cart.length; }
function updateCartTotal() { cartTotal.textContent = `Итог: ${cart.reduce((s,p)=>s+p.price,0)} ₽`; }

// --- Модальное окно ---
function openModal(p) {
  currentModalProduct = p;
  modalImage.src = p.image;
  modalTitle.textContent = p.name;
  modalPrice.textContent = `${p.price} ₽`;
  modal.style.display = "flex";
}
modalClose.onclick = modalBack.onclick = () => modal.style.display = "none";
modalAdd.onclick = () => { addToCart(currentModalProduct); modal.style.display = "none"; };

// --- Фильтры ---
searchInput.addEventListener("input", e => {
  const value = e.target.value.toLowerCase();
  renderProducts(products.filter(p => p.name.toLowerCase().includes(value)));
});

menuIcon.onclick = () => categories.classList.toggle("show");
categories.querySelectorAll("div").forEach(cat => {
  cat.onclick = () => {
    inCartScreen = false;
    renderProducts(
      cat.dataset.category === "Главная"
        ? products
        : products.filter(p => p.category === cat.dataset.category)
    );
    categories.classList.remove("show");
  };
});

mainTitle.onclick = () => { inCartScreen = false; renderProducts(products); };

// --- Корзина ---
cartButton.onclick = () => { inCartScreen = true; renderProducts(cart); };

// --- Оформление заказа ---
checkoutButton.onclick = () => {
  if(cart.length) alert(`Заказ на ${cart.reduce((s,p)=>s+p.price,0)} ₽`);
};

// --- Анимация в корзину ---
function flyToCart(img) {
  const fly = img.cloneNode();
  fly.className = "fly-to-cart";
  const rect = img.getBoundingClientRect();
  fly.style.left = rect.left + "px";
  fly.style.top = rect.top + "px";
  document.body.appendChild(fly);
  setTimeout(() => {
    const cartRect = cartButton.getBoundingClientRect();
    fly.style.transform = `translate(${cartRect.left - rect.left}px, ${cartRect.top - rect.top}px) scale(0.1)`;
    fly.style.opacity = "0";
  },10);
  setTimeout(() => fly.remove(),610);
}

// --- Начальный рендер ---
renderProducts();
