<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
<title>Chronicle Chains</title>
<link rel="stylesheet" href="style.css">

<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/suggestions-jquery/dist/css/suggestions.min.css">
<script src="https://cdn.jsdelivr.net/npm/suggestions-jquery/dist/js/jquery.suggestions.min.js"></script>

<!-- EmailJS SDK -->
<script src="https://cdn.jsdelivr.net/npm/emailjs-com@3/dist/email.min.js"></script>
<script>
  emailjs.init("0K_N35aYR37FA5PAl"); // Public Key
</script>

<style>
/* ===== Добавки для плавного перелистывания ===== */
.page-wrapper {
  transition: transform 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  will-change: transform;
}

body.cart-mode .page-wrapper {
  transform: translateX(-100vw);
  box-shadow: -10px 0 30px rgba(0,0,0,0.1);
}
</style>
</head>
<body>

<div class="header">
  <div class="menu-icon" id="menuIcon"><div></div><div></div><div></div></div>
  <h1 id="mainTitle">Chronicle Chains</h1>
  <button class="cart-btn" id="cartButton">🛒<span id="cartCount" class="cart-count">0</span></button>
</div>

<div class="container">
  <div class="page-wrapper" id="pageWrapper">
    <div class="categories" id="categories">
      <div data-category="Главная">Главная</div>
      <div data-category="Браслеты">Браслеты</div>
      <div data-category="Колье">Колье</div>
      <div data-category="Кулоны">Кулоны</div>
      <div data-category="Серьги">Серьги</div>
      <div data-category="Обвесы">Обвесы</div>
      <div data-category="Аксессуары для волос">Аксессуары для волос</div>
    </div>

    <input type="text" class="search" placeholder="Мне нужно..." id="searchInput">
    <div class="products" id="products"></div>
    <div class="cart-total" id="cartTotal"></div>

    <div class="footer-buttons" id="footerButtons">
      <a href="https://t.me/whxt4ru" target="_blank" class="footer-btn">Связь</a>
      <a href="https://t.me/chroniclechains" target="_blank" class="footer-btn">Магазин</a>
    </div>
  </div>
</div>

<!-- Модалка товара -->
<div class="modal" id="modal">
  <div class="modal-content">
    <span class="modal-close" id="modalClose">&times;</span>
    <div class="modal-img-wrapper"><img id="modalImage" src="" alt=""></div>
    <div class="modal-title-price">
      <h3 id="modalTitle"></h3>
      <p id="modalPrice"></p>
    </div>
    <div class="modal-desc"><p id="modalDescription"></p></div>
  </div>
</div>

<!-- Модалка заказа -->
<div class="order-modal" id="orderModal">
  <div class="order-modal-content">
    <span class="order-modal-close" id="orderClose">&times;</span>
    <h2>Оформление заказа</h2>
    <form id="orderForm"></form>
  </div>
</div>

<button class="checkout-btn" id="checkoutButton">Оформить заказ</button>

<script>
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

// ================== ТОВАРЫ ==================
const products = [
  {id:1,name:"Браслет Hearts",price:4000,image:"https://i.pinimg.com/736x/d4/c5/4c/d4c54cd9c489d1e73d9e306545929b70.jpg",category:"Браслеты",description:["Материал изделия:","Хирургическая сталь;","Фурнитура из нержавеющей стали.","","Срок изготовления — до 5 рабочих дней."]},
  {id:2,name:"Колье Gothic Thorns",price:3600,image:"https://i.pinimg.com/736x/c2/0d/26/c20d26fb9839c64d328f8989450f547b.jpg",category:"Колье",description:["Материал изделия:","Атласная лента;","Хирургическая сталь;","Фурнитура из хирургической и нержавеющей стали.","","Срок изготовления — до 5 рабочих дней."]},
  {id:3,name:"Колье Pierced Chain",price:2500,image:"https://i.pinimg.com/736x/37/0b/db/370bdb870346b42b1000610195261f62.jpg",category:"Колье",description:["Материал изделия:","Нержавеющая сталь;","Фурнитура из хирургической и нержавеющей стали.","","Срок изготовления — до 5 рабочих дней."]},
  {id:4,name:"Колье Starry Sky",price:4500,image:"https://i.pinimg.com/736x/55/bf/ec/55bfecc3c2ceebf20752ff2802ff4e19.jpg",category:"Колье",description:["Материал изделия:","Хирургическая сталь;","Фурнитура из хирургической и нержавеющей стали.","","Срок изготовления — до 5 рабочих дней."]},
  {id:5,name:"Кулон Moonlight",price:2000,image:"https://i.pinimg.com/736x/5a/6d/1b/5a6d1beecdc7b79798705e4da0ef3a5c.jpg",category:"Кулоны",description:["Материал изделия:","Лунная бусина;","Хирургическая сталь;","Фурнитура из нержавеющей стали.","","Срок изготовления — до 5 рабочих дней."]},
  {id:6,name:"Обвес Lighter",price:3600,image:"https://i.pinimg.com/736x/e8/cb/c2/e8cbc2287025b23930c20e030755a0b5.jpg",category:"Обвесы",description:["Материал изделия:","Фурнитура из нержавеющей стали;","Хирургическая и нержавеющая сталь.","","Срок изготовления — до 5 рабочих дней."]},
  {id:7,name:"Обвес Star",price:2000,image:"https://i.pinimg.com/736x/16/36/75/163675cf410dfc51ef97238bbbab1056.jpg",category:"Обвесы",description:["Материал изделия:","Хирургическая сталь;","Фурнитура из нержавеющей стали.","","Срок изготовления — до 5 рабочих дней."]},
  {id:8,name:"Серьги Moonlight",price:2000,image:"https://i.pinimg.com/736x/93/e4/e5/93e4e5ee7594f6ef436f8b994ef04016.jpg",category:"Серьги",description:["Материал изделия:","Лунные бусины;","Хирургическая сталь;","Фурнитура из нержавеющей и хирургической стали.","","Срок изготовления — до 5 рабочих дней."]},
  {id:9,name:"Тестовый товар",price:10,image:"https://via.placeholder.com/150",category:"Тест",description:["Тестовый товар для проверки.","","Срок изготовления — 1 день."]}
];

// ================== ФОРМА ==================
orderForm.innerHTML = `
<label>ФИО</label><input type="text" name="fullname" placeholder="Введите ФИО" required>
<label>Адрес</label><input type="text" name="address" id="addressInput" placeholder="Город, улица, дом, индекс" required>
<label>Доставка</label><select name="delivery" id="deliverySelect" required>
<option value="" disabled selected>Выберите способ доставки</option>
<option value="СДЭК">СДЭК — 450₽</option>
<option value="Почта России">Почта России — 550₽</option>
<option value="Яндекс.Доставка">Яндекс.Доставка — 400₽</option>
<option value="Самовывоз">Самовывоз</option>
</select>
<div id="deliveryInfo" style="color:#aaa;margin-top:4px;"></div>
<label>Номер телефона</label><input type="text" name="phone" placeholder="Введите номер" required>
<label>Telegram ID</label><input type="text" name="telegram" placeholder="@id" required>
<div id="orderSum" style="color:#aaa;margin:10px 0;font-weight:500;">Итоговая сумма: 0 ₽</div>
<button type="submit">Оплатить</button>
`;

// ================== DaData ==================
$(function(){
  $("#addressInput").suggestions({
    token:"4563b9c9765a1a2d7bf39e1c8944f7fadae05970",
    type:"ADDRESS",
    hint:false
  });
});

// ================== ПЛАВНАЯ КОРЗИНА ==================
cartButton.onclick = () => {
  inCartScreen = true;
  document.body.classList.add("cart-mode");
  renderProducts(cart.map(i => i.product));
};

mainTitle.onclick = () => {
  inCartScreen = false;
  document.body.classList.remove("cart-mode");
  currentCategory = "Главная";
  renderProducts(products);
};

// Остальной JS оставляем полностью твой (рендер карточек, модалки, поиск, оформление заказа)
</script>

<script src="main.js"></script>
</body>
</html>
