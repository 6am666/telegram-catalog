// ================== TELEGRAM INIT ==================
if (window.Telegram && window.Telegram.WebApp) {
  Telegram.WebApp.ready();
  Telegram.WebApp.expand();
}

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

const modal = document.getElementById("modal");
const modalImage = document.getElementById("modalImage");
const modalTitle = document.getElementById("modalTitle");
const modalPrice = document.getElementById("modalPrice");
const modalDescription = document.getElementById("modalDescription");
const modalClose = document.getElementById("modalClose");

const orderModal = document.getElementById("orderModal");
const orderClose = document.getElementById("orderClose");
const orderForm = document.getElementById("orderForm");

// ================== TELEGRAM ORDER ==================
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
      `https://api.telegram.org/bot${TG_BOT_TOKEN}/sendMessage?chat_id=${chat_id}&text=${encodeURIComponent(text)}`
    );
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
];

// ================== ГАМБУРГЕР ==================
menuIcon.onclick = () => {
  categories.classList.toggle("show");
};

Array.from(categories.children).forEach(div => {
  div.onclick = () => {
    currentCategory = div.dataset.category;
    inCartScreen = false;
    document.body.classList.remove("cart-mode");
    categories.classList.remove("show");
    renderProducts(getCurrentList());
  };
});

document.addEventListener("click", e => {
  if (!categories.contains(e.target) && !menuIcon.contains(e.target)) {
    categories.classList.remove("show");
  }
});

// ================== ОПЛАТА ==================
orderForm.onsubmit = async e => {
  e.preventDefault();
  if (!cart.length || isSubmitting) return;

  isSubmitting = true;

  const total = cart.reduce((s,i)=>s+i.count*i.product.price,0);

  const res = await fetch("/api/create-payment", {
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({
      amount: total,
      order_id: Date.now(),
      return_url: window.location.href
    })
  });

  const json = await res.json();

  if (json.payment_url) {
    if (window.Telegram && Telegram.WebApp) {
      Telegram.WebApp.openLink(json.payment_url);
    } else {
      window.open(json.payment_url, "_blank");
    }
  } else {
    alert("Ошибка оплаты");
  }

  isSubmitting = false;
};

// ================== РЕНДЕР ==================
function renderProducts(list) {
  productsEl.innerHTML = "";
  list.forEach(p => {
    const el = document.createElement("div");
    el.className = "product";
    el.innerHTML = `
      <img src="${p.image}">
      <h3>${p.name}</h3>
      <p>${p.price} ₽</p>
      <button>В корзину</button>
    `;
    el.querySelector("button").onclick = () => {
      const item = cart.find(i => i.product.id === p.id);
      item ? item.count++ : cart.push({product:p,count:1});
      updateCartUI();
    };
    productsEl.appendChild(el);
  });
}

function updateCartUI() {
  const c = cart.reduce((s,i)=>s+i.count,0);
  const t = cart.reduce((s,i)=>s+i.count*i.product.price,0);
  cartCount.textContent = c;
  cartTotal.textContent = t ? `Итого: ${t} ₽` : "";
  checkoutButton.style.display = c ? "block" : "none";
}

function getCurrentList() {
  return currentCategory === "Главная"
    ? products
    : products.filter(p => p.category === currentCategory);
}

// ================== START ==================
renderProducts(products);
updateCartUI();
