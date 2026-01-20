// ================== ИНИЦИАЛИЗАЦИЯ ==================
let cart = [];
let inCartScreen = false;
let currentCategory = "Главная";
let isSubmitting = false;

const productsEl = document.getElementById("products");
const searchInput = document.getElementById("searchInput");
const cartButton = document.getElementById("cartButton");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");
const checkoutButton = document.getElementById("checkoutButton");
const categories = document.getElementById("categories");
const mainTitle = document.getElementById("mainTitle");
const menuIcon = document.getElementById("menuIcon");
const footerButtons = document.getElementById("footerButtons");
const pageWrapper = document.getElementById("pageWrapper");

const modal = document.getElementById("modal");
const modalImage = document.getElementById("modalImage");
const modalTitle = document.getElementById("modalTitle");
const modalPrice = document.getElementById("modalPrice");
const modalDescription = document.getElementById("modalDescription");
const modalClose = document.getElementById("modalClose");

const orderModal = document.getElementById("orderModal");
const orderClose = document.getElementById("orderClose");
const orderForm = document.getElementById("orderForm");

// ================== TELEGRAM ==================
const TG_BOT_TOKEN = "7999576459:AAHmaw0x4Ux_pXaL2VjxVlqYQByWVVHVtx4";
const TG_CHAT_IDS = ["531170149", "496792657"];
function sendTelegramOrder(order) {
  const text =
    "НОВЫЙ ЗАКАЗ\n\n" +
    "ФИО: " + order.fullname + "\n" +
    "Телефон: " + order.phone + "\n" +
    "Telegram ID: " + order.telegram + "\n" +
    "Доставка: " + order.delivery + "\n" +
    "Адрес: " + order.address + "\n\n" +
    "ТОВАРЫ:\n" + order.products + "\n\n" +
    "СУММА: " + order.total + " ₽";

  TG_CHAT_IDS.forEach(chat_id => {
    const url =
      "https://api.telegram.org/bot" + TG_BOT_TOKEN +
      "/sendMessage?chat_id=" + encodeURIComponent(chat_id) +
      "&text=" + encodeURIComponent(text);
    fetch(url).catch(err => console.error("Telegram error:", err));
  });
}

// ================== ПЛАВНАЯ КОРЗИНА ==================
cartButton.onclick = () => {
  inCartScreen = true;
  document.body.classList.add("cart-mode"); // плавное сдвижение
  renderProducts(cart.map(i => i.product));
};

mainTitle.onclick = () => {
  inCartScreen = false;
  document.body.classList.remove("cart-mode"); // плавное возвращение
  currentCategory = "Главная";
  renderProducts(products);
};

// ================== ФУНКЦИИ РЕНДЕРА ==================
function renderProducts(list) {
  productsEl.innerHTML = "";

  list.forEach(p => {
    const card = document.createElement("div");
    card.className = "product";

    const img = document.createElement("img");
    img.src = p.image;
    img.onclick = () => openModal(p);

    const title = document.createElement("h3");
    title.textContent = p.name;

    const price = document.createElement("p");
    price.textContent = p.price + " ₽";

    const controls = document.createElement("div");
    controls.className = "count-block";

    const item = cart.find(i => i.product.id === p.id);

    if (item) {
      const minus = document.createElement("button");
      minus.textContent = "–";
      minus.onclick = e => {
        e.stopPropagation();
        removeFromCart(p);
      };

      const count = document.createElement("div");
      count.className = "count-number";
      count.textContent = item.count;

      const plus = document.createElement("button");
      plus.textContent = "+";
      plus.onclick = e => {
        e.stopPropagation();
        addToCart(p);
      };

      controls.append(minus, count, plus);
    } else {
      const btn = document.createElement("button");
      btn.textContent = "В корзину";
      btn.onclick = e => {
        e.stopPropagation();
        addToCart(p);
      };
      controls.appendChild(btn);
    }

    card.append(img, title, price, controls);
    productsEl.appendChild(card);
  });

  updateCartUI();
}

// ================== КОРЗИНА ==================
function addToCart(p) {
  const i = cart.find(x => x.product.id === p.id);
  if (i) i.count++;
  else cart.push({ product: p, count: 1 });
  renderProducts(getCurrentList());
}

function removeFromCart(p) {
  const i = cart.find(x => x.product.id === p.id);
  if (!i) return;
  i.count--;
  if (i.count === 0) cart = cart.filter(x => x !== i);
  renderProducts(getCurrentList());
}

function getCurrentList() {
  if (inCartScreen) return cart.map(i => i.product);
  if (currentCategory === "Главная") return products;
  return products.filter(p => p.category === currentCategory);
}

// ================== МОДАЛКА ==================
function openModal(p) {
  modalImage.src = p.image;
  modalTitle.textContent = p.name;
  modalPrice.textContent = p.price + " ₽";
  modalDescription.innerHTML = p.description.join("<br>");
  modal.style.display = "flex";
}
modalClose.onclick = () => (modal.style.display = "none");
modal.onclick = e => {
  if (e.target === modal) modal.style.display = "none";
};

// ================== ОБНОВЛЕНИЕ КОРЗИНЫ ==================
function updateCartUI() {
  const c = cart.reduce((s, i) => s + i.count, 0);
  const t = cart.reduce((s, i) => s + i.count * i.product.price, 0);

  cartCount.textContent = c;
  cartTotal.textContent = t ? "Итого: " + t + " ₽" : "";
  cartTotal.style.display = inCartScreen ? "block" : "none";
  checkoutButton.style.display = c && inCartScreen ? "block" : "none";
  footerButtons.style.display = inCartScreen ? "none" : "flex";
  searchInput.style.display = inCartScreen ? "none" : "block";
}

// ================== ПОИСК ==================
searchInput.oninput = () => {
  const val = searchInput.value.toLowerCase();
  renderProducts(
    getCurrentList().filter(p => p.name.toLowerCase().includes(val))
  );
};

// ================== СТАРТ ==================
renderProducts(products);
updateCartUI();
