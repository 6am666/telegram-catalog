```js
// ================== TELEGRAM INIT ==================
if (window.Telegram?.WebApp) {
  Telegram.WebApp.ready();
  Telegram.WebApp.expand();
}

// ================== ИНИЦИАЛИЗАЦИЯ ==================
let cart = [];
let inCartScreen = false;
let currentCategory = "Главная";
let isSubmitting = false;

const API_URL = "https://telegram-catalog-alpha.vercel.app/api/create-payment";

const productsEl = document.getElementById("products");
const searchInput = document.getElementById("searchInput");
const cartButton = document.getElementById("cartButton");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");
const checkoutButton = document.getElementById("checkoutButton");
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

orderForm.setAttribute("onsubmit", "return false");

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
    fetch(
      "https://api.telegram.org/bot" + TG_BOT_TOKEN +
      "/sendMessage?chat_id=" + chat_id +
      "&text=" + encodeURIComponent(text)
    ).catch(console.error);
  });
}

// ================== ОФОРМЛЕНИЕ ЗАКАЗА ==================
orderForm.onsubmit = async e => {
  e.preventDefault();
  e.stopPropagation();
  if (isSubmitting || !cart.length) return;

  isSubmitting = true;

  const fd = new FormData(orderForm);
  const productsList = cart.map(i => `• ${i.product.name} x${i.count}`).join("\n");

  let deliveryCost = { "СДЭК": 450, "Почта России": 550, "Яндекс.Доставка": 400 }[fd.get("delivery")] || 0;
  const total = cart.reduce((s,i)=>s+i.count*i.product.price,0) + deliveryCost;

  const orderData = {
    fullname: fd.get("fullname"),
    phone: fd.get("phone"),
    telegram: fd.get("telegram"),
    delivery: fd.get("delivery"),
    address: fd.get("address"),
    products: productsList,
    total
  };

  try {
    sendTelegramOrder(orderData);

    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: total,
        order_id: Date.now(),
        return_url: window.location.href
      })
    });

    const json = await res.json();
    console.log("PAYMENT:", json);

    if (!json.payment_url) throw new Error("Нет payment_url");

    cart = [];
    orderModal.style.display = "none";

    if (window.Telegram?.WebApp?.openLink) {
      Telegram.WebApp.openLink(json.payment_url, { try_instant_view: false });
    } else {
      window.open(json.payment_url, "_blank");
    }

  } catch (err) {
    console.error(err);
    alert("Ошибка оплаты");
  } finally {
    isSubmitting = false;
  }
};

// ================== СТАРТ ==================
renderProducts(products);
updateCartUI();
updateOrderSum();
```
