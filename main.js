const tg = window.Telegram.WebApp;
tg.expand();

let cart = [];
let inCartScreen = false;

const containerEl = document.getElementById("products");
const searchInput = document.getElementById("searchInput");
const cartButton = document.getElementById("cartButton");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");

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

/* РЕНДЕР */
function renderProducts(list = products) {
  containerEl.innerHTML = "";
  searchInput.style.display = inCartScreen ? "none" : "block";
  cartTotal.style.display = inCartScreen ? "block" : "none";

  list.forEach(p => {
    const card = document.createElement("div");
    card.className = "product";
    const img = new Image();
    img.src = p.image;
    img.alt = p.name;
    img.onerror = () => img.src = "https://via.placeholder.com/300";

    let btnHTML = inCartScreen 
      ? `<button class="remove-btn">Удалить</button>` 
      : `<button class="add-btn">В корзину</button>`;

    card.innerHTML = `<h3>${p.name}</h3><p>${p.price} ₽</p>${btnHTML}`;
    card.prepend(img);

    card.onclick = () => openModal(p);

    if (!inCartScreen) {
      card.querySelector(".add-btn").onclick = e => {
        e.stopPropagation();
        flyToCart(img);
        addToCart(p);
      }
    } else {
      card.querySelector(".remove-btn").onclick = e => {
        e.stopPropagation();
        removeFromCart(p);
      }
    }

    containerEl.appendChild(card);
  });

  updateCartCount();
  updateCartTotal();
}

/* ПОИСК */
searchInput.addEventListener("input", e => {
  const value = e.target.value.toLowerCase();
  renderProducts(products.filter(p => p.name.toLowerCase().includes(value)));
});

/* ГАМБУРГЕР */
menuIcon.onclick = () => categories.classList.toggle("show");
categories.querySelectorAll("div").forEach(cat => {
  cat.onclick = () => {
    const catName = cat.dataset.category;
    inCartScreen = false;
    if (catName === "Главная") renderProducts();
    else renderProducts(products.filter(p => p.category === catName));
    categories.classList.remove("show");
  }
});

/* МОДАЛ */
function openModal(p) {
  if (inCartScreen) return; // модалка в корзине не открывать
  currentModalProduct = p;
  modalImage.src = p.image;
  modalTitle.textContent = p.name;
  modalPrice.textContent = `${p.price} ₽`;
  modal.style.display = "flex";
}
modalClose.onclick = modalBack.onclick = () => modal.style.display = "none";
window.onclick = e => { if (e.target === modal) modal.style.display = "none"; }
modalAdd.onclick = () => { if(currentModalProduct) addToCart(currentModalProduct); }

/* КОРЗИНА */
function addToCart(product) {
  cart.push(product);
  updateCartCount();
}
function removeFromCart(product){
  cart = cart.filter(p => p !== product);
  renderProducts(cart);
}

/* Кнопка корзины снизу */
cartButton.onclick = () => {
  inCartScreen = true;
  renderProducts(cart);
}

/* Анимация добавления в корзину */
function flyToCart(img) {
  const fly = document.createElement("img");
  fly.src = img.src;
  fly.className = "fly-to-cart";
  const rect = img.getBoundingClientRect();
  fly.style.left = rect.left + "px";
  fly.style.top = rect.top + "px";
  document.body.appendChild(fly);

  const cartRect = cartButton.getBoundingClientRect();
  requestAnimationFrame(() => {
    fly.style.transform = `translate(${cartRect.left - rect.left}px,${cartRect.top - rect.top}px) scale(0.2)`;
    fly.style.opacity = "0";
  });
  fly.addEventListener("transitionend", () => fly.remove());
}

/* ОБНОВЛЕНИЕ */
function updateCartCount() {
  cartCount.textContent = cart.length;
}
function updateCartTotal() {
  const total = cart.reduce((sum,p) => sum + p.price,0);
  cartTotal.textContent = `Итог: ${total} ₽`;
}

renderProducts();
