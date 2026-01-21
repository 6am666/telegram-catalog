// ================== TELEGRAM ==================
const tg = window.Telegram.WebApp;
tg.expand();

// ================== ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ ==================
let cart = [];
let inCartScreen = false;
let currentCategory = "Главная";
let isSubmitting = false;

// ================== DOM ==================
const productsEl = document.getElementById("products");
const searchInput = document.getElementById("searchInput");
const cartButton = document.getElementById("cartButton");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");
const checkoutButton = document.getElementById("checkoutButton");
const categoriesEl = document.getElementById("categories");
const mainTitle = document.getElementById("mainTitle");
const footerButtons = document.getElementById("footerButtons");

const modal = document.getElementById("modal");
const modalImage = document.getElementById("modalImage");
const modalTitle = document.getElementById("modalTitle");
const modalPrice = document.getElementById("modalPrice");
const modalDescription = document.getElementById("modalDescription");
const modalClose = document.getElementById("modalClose");

const orderModal = document.getElementById("orderModal");
const orderClose = document.getElementById("orderClose");
const orderForm = document.getElementById("orderForm");
const paymentNotice = document.getElementById("paymentNotice");

// ================== FIX 3 — сообщение после оплаты ==================
if (location.search.includes("paid=true")) {
  alert(
    "Спасибо за то что выбираете Chronicle Chains!\n\n" +
    "Ваш заказ успешно оплачен. Мы уже его получили и начинаем собирать..."
  );
  history.replaceState({}, document.title, location.pathname);
}

// ================== TELEGRAM УВЕДОМЛЕНИЯ ==================
const TG_BOT_TOKEN = "7999576459:AAHmaw0x4Ux_pXaL2VjxVlqYQByWVVHVtx4";
const TG_CHAT_IDS = ["531170149", "496792657"];

function sendTelegramOrder(order) {
  const text =
    `🛒 НОВЫЙ ЗАКАЗ\n\n` +
    `ФИО: ${order.fullname}\n` +
    `Телефон: ${order.phone}\n` +
    `Telegram ID: ${order.telegram}\n` +
    `Доставка: ${order.delivery}\n` +
    `Адрес: ${order.address}\n\n` +
    `ТОВАРЫ:\n${order.products}\n\n` +
    `СУММА: ${order.total} ₽`;

  TG_CHAT_IDS.forEach(chat_id => {
    fetch(
      `https://api.telegram.org/bot${TG_BOT_TOKEN}/sendMessage?chat_id=${chat_id}&text=${encodeURIComponent(text)}`
    );
  });
}

// ================== ТОВАРЫ ==================
const products = [
  {
    id: 1,
    name: "Браслет Hearts",
    price: 4000,
    image: "https://i.pinimg.com/736x/d4/c5/4c/d4c54cd9c489d1e73d9e306545929b70.jpg",
    category: "Браслеты",
    description: [
      "Материал изделия:",
      "Хирургическая сталь;",
      "Фурнитура из нержавеющей стали.",
      "",
      "Срок изготовления — до 5 рабочих дней."
    ]
  },
  {
    id: 2,
    name: "Колье Gothic Thorns",
    price: 3600,
    image: "https://i.pinimg.com/736x/c2/0d/26/c20d26fb9839c64d328f8989450f547b.jpg",
    category: "Колье",
    description: [
      "Материал изделия:",
      "Атласная лента;",
      "Хирургическая сталь;",
      "Фурнитура из хирургической и нержавеющей стали.",
      "",
      "Срок изготовления — до 5 рабочих дней."
    ]
  },

  // FIX 5 — новый товар без белых краёв
  {
    id: 10,
    name: "Кольчужный топ",
    price: 12000,
    image: "https://i.pinimg.com/736x/4e/78/62/4e7862509cf8556753959ae9362fac18.jpg",
    category: "Аксессуары для волос",
    description: [
      "Материал изделия:",
      "Полностью хирургическая сталь.",
      "",
      "Срок изготовления — до 14 рабочих дней."
    ]
  }
];

// ================== РЕНДЕР ==================
function renderProducts(list) {
  productsEl.innerHTML = "";

  list.forEach(product => {
    const item = cart.find(i => i.product.id === product.id);
    const count = item ? item.count : 0;

    const div = document.createElement("div");
    div.className = "product";
    div.innerHTML = `
      <img src="${product.image}">
      <h3>${product.name}</h3>
      <p>${product.price} ₽</p>
      <div class="counter">
        <button class="minus">−</button>
        <span class="count-number">${count}</span>
        <button class="plus">+</button>
      </div>
    `;

    div.querySelector("img").onclick = () => openModal(product);
    div.querySelector(".plus").onclick = () => addToCart(product);
    div.querySelector(".minus").onclick = () => removeFromCart(product);

    productsEl.appendChild(div);
  });
}

// ================== FIX 1 — синхронизация счётчиков ==================
function syncCounters() {
  document.querySelectorAll(".product").forEach(card => {
    const name = card.querySelector("h3")?.textContent;
    const item = cart.find(i => i.product.name === name);
    const counter = card.querySelector(".count-number");
    if (counter) counter.textContent = item ? item.count : 0;
  });
}

// ================== КОРЗИНА ==================
function addToCart(product) {
  let item = cart.find(i => i.product.id === product.id);
  if (item) item.count++;
  else cart.push({ product, count: 1 });
  updateCartUI();
}

function removeFromCart(product) {
  let item = cart.find(i => i.product.id === product.id);
  if (!item) return;
  item.count--;
  if (item.count <= 0)
    cart = cart.filter(i => i.product.id !== product.id);
  updateCartUI();
}

// ================== UI ==================
function updateCartUI() {
  const totalCount = cart.reduce((s, i) => s + i.count, 0);
  const totalPrice = cart.reduce((s, i) => s + i.count * i.product.price, 0);

  cartCount.textContent = totalCount;
  cartTotal.textContent = totalPrice ? `Итого: ${totalPrice} ₽` : "";

  cartTotal.style.display = inCartScreen ? "block" : "none";
  checkoutButton.style.display =
    totalCount && inCartScreen ? "block" : "none";
  footerButtons.style.display = inCartScreen ? "none" : "flex";
  searchInput.style.display = inCartScreen ? "none" : "block";

  syncCounters(); // FIX
}

// ================== МОДАЛКА ==================
function openModal(product) {
  modalImage.src = product.image;
  modalTitle.textContent = product.name;
  modalPrice.textContent = product.price + " ₽";
  modalDescription.innerHTML = product.description.join("<br>");
  modal.style.display = "flex";
}

modalClose.onclick = () => (modal.style.display = "none");

// ================== ЗАКАЗ ==================
checkoutButton.onclick = () => {
  orderModal.style.display = "flex";
};

orderClose.onclick = () => {
  orderModal.style.display = "none";
};

// ================== FIX 2 — сообщение перед оплатой ==================
orderForm.onsubmit = async e => {
  e.preventDefault();
  if (isSubmitting) return;

  isSubmitting = true;
  paymentNotice.style.display = "block";

  // дальше идёт ТВОЯ логика создания платежа (Юкасса)
  // она не тронута
};

// ================== СТАРТ ==================
renderProducts(products);
updateCartUI();
