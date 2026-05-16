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
const categoriesEl = document.getElementById("categories");
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

const modalImageWrapper = document.querySelector(".modal-img-wrapper");
const modalPrevBtn = document.createElement("button");
const modalNextBtn = document.createElement("button");
const modalDots = document.createElement("div");
const modalOptionsPanel = document.createElement("div");
const modalOptionWarning = document.createElement("div");
const modalOptions = document.createElement("div");
const modalActions = document.createElement("div");
const modalBuyBtn = document.createElement("button");
const modalCounterControls = document.createElement("div");
let modalImages = [];
let modalImageIndex = 0;
let touchStartX = 0;
let currentModalProduct = null;

const productOptionConfig = {
  9: [
    { label: "Конусы", imageIndex: 0 },
    { label: "Круги", imageIndex: 1 }
  ]
};
const selectedProductOptions = {};

// ================== ПРОМОКОДЫ ==================
const promoCodes = {
  "ValentinesDay": 10 // 10% скидка
};
let appliedPromo = null; // текущий примененный промокод

// ================== TELEGRAM ==================
const TG_BOT_TOKEN = "7999576459:AAHmaw0x4Ux_pXaL2VjxVlqYQByWVVHVtx4";
const TG_CHAT_IDS = ["531170149", "496792657"];
function sendTelegramOrder(order) {
  const text = `НОВЫЙ ЗАКАЗ\n\nФИО: ${order.fullname}\nТелефон: ${order.phone}\nTelegram ID: ${order.telegram}\nДоставка: ${order.delivery}\nАдрес: ${order.address}\n\nТОВАРЫ:\n${order.products}\n\nСУММА: ${order.total} ₽`;
  TG_CHAT_IDS.forEach(chat_id => {
    fetch(`https://api.telegram.org/bot${TG_BOT_TOKEN}/sendMessage?chat_id=${encodeURIComponent(chat_id)}&text=${encodeURIComponent(text)}`)
      .catch(err => console.error("Telegram error:", err));
  });
}

// ================== EMAILJS ==================
function sendEmailOrder(order){
  const templateParams = {
    fullname: order.fullname,
    phone: order.phone,
    telegram: order.telegram,
    delivery: order.delivery,
    address: order.address,
    products: order.products,
    total: order.total
  };

  emailjs.send('service_6drenuw','template_90b82bq',templateParams,'0K_N35aYR37FA5PAl')
    .then(response => console.log('Email sent!', response.status, response.text))
    .catch(err => console.error('Email error:', err));
}

// ================== ТОВАРЫ ==================
const products = [
{id:1,name:"Браслет Hearts",price:3500,image:"https://i.pinimg.com/736x/d7/37/93/d73793f350032805c10abe8e6e3a4116.jpg",category:"Браслеты",description:["Материал изделия:","Хирургическая сталь;","Фурнитура из нержавеющей стали.","","Срок изготовления — до 5 рабочих дней."]},
{id:2,name:"Колье Gothic Thorns",price:3600,image:"https://i.pinimg.com/736x/05/96/b7/0596b73673809194f7192af932a01545.jpg",category:"Колье",description:["Материал изделия:","Атласная лента;","Хирургическая сталь;","Фурнитура из хирургической и нержавеющей стали.","","Срок изготовления — до 5 рабочих дней."]},
{id:3,name:"Колье Pierced Chain",price:2500,image:"https://i.pinimg.com/736x/37/0b/db/370bdb870346b42b1000610195261f62.jpg",category:"Колье",description:["Материал изделия:","Нержавеющая сталь;","Фурнитура из хирургической и нержавеющей стали.","","Срок изготовления — до 5 рабочих дней."]},
{id:4,name:"Колье Starry Sky",price:4000,image:"https://i.pinimg.com/736x/5d/c8/eb/5dc8eb8813c389b66613c9cb3e53d3d1.jpg",category:"Колье",description:["Материал изделия:","Хирургическая сталь;","Фурнитура из хирургической и нержавеющей стали.","","Срок изготовления — до 5 рабочих дней."]},
{id:5,name:"Кулон Moonlight",price:2000,image:"https://i.pinimg.com/736x/5a/6d/1b/5a6d1beecdc7b79798705e4da0ef3a5c.jpg",category:"Кулоны",description:["Материал изделия:","Лунная бусина;","Хирургическая сталь;","Фурнитура из нержавеющей стали.","","Срок изготовления — до 5 рабочих дней."]},
{id:6,name:"Обвес Mesmerizer",price:3200,image:"https://i.pinimg.com/736x/c8/24/37/c82437e3a3066aa7aa1eb18761ddad83.jpg",category:"Обвесы",description:["Материал изделия:","Хирургическая сталь;","Фурнитура из нержавеющей стали.","","Срок изготовления — до 5 рабочих дней."]},
{id:7,name:"Обвес Lighter",price:3200,image:"https://i.pinimg.com/736x/72/f4/0d/72f40d5fea06bbb9532b45287853da0c.jpg",category:"Обвесы",description:["Материал изделия:","Фурнитура из нержавеющей стали;","Хирургическая и нержавеющая сталь.","","Срок изготовления — до 5 рабочих дней."]},
{id:8,name:"Обвес Star",price:2000,image:"https://i.pinimg.com/736x/47/e5/f3/47e5f371d67eb689ebbb0c8d84d2ac5b.jpg",category:"Обвесы",description:["Материал изделия:","Хирургическая сталь;","Фурнитура из нержавеющей стали.","","Срок изготовления — до 5 рабочих дней."]},
{id:9,name:"Серьги Moonlight",price:2000,image:"https://i.pinimg.com/736x/a8/c9/14/a8c9147f95a4e40ecebcb6c9b4e9ad8a.jpg",category:"Серьги",description:["Материал изделия:","Лунные бусины;","Хирургическая сталь;","Фурнитура из нержавеющей и хирургической стали.","","Срок изготовления — до 5 рабочих дней."]},
{id:10,name:"Кулон ILG",price:2500,image:"https://i.pinimg.com/736x/7d/a6/8b/7da68b9a23b9a56785387c0e2d128121.jpg",images:["https://i.pinimg.com/736x/7d/a6/8b/7da68b9a23b9a56785387c0e2d128121.jpg","https://i.pinimg.com/736x/66/40/4a/66404aac6b5200512d664e7f00be7f8b.jpg"],category:"Кулоны",description:["Материал изделия:","Хирургическая и нержавеющая сталь.","","Цепочка:","Нержавеющая сталь.","","Срок изготовления - до 5 рабочих дней."]},
{id:11,name:"Кольчужный топ",price:18000,image:"https://i.pinimg.com/736x/a9/95/24/a995240ff0d58266a65e1edc78c366ed.jpg",category:"Топы",description:["Материал изделия:","Хирургическая сталь","","Срок изготовления — до 14 рабочих дней."]},
{id:12,name:"Колье Pierced Soul",price:5500,image:"https://i.pinimg.com/736x/70/88/3f/70883f759c7d988eb91565955f9007a5.jpg",category:"Колье",description:["Материал изделия:","Хирургическая сталь;","Фурнитура из нержавеющей стали.","","Срок изготовления — до 5 рабочих дней."]},
{id:13,name:"Колье Painful Love",price:3000,image:"https://i.pinimg.com/736x/45/99/a2/4599a2f82ad4752fad58113f3125aa1d.jpg",category:"Колье",description:["Материал изделия:","Хирургическая сталь;","Фурнитура из нержавеющей стали.","","Срок изготовления — до 5 рабочих дней."]},
{id:14,name:"Колье Fragile Faith",price:5700,image:"https://i.pinimg.com/736x/b8/dd/bf/b8ddbfe339a731f7a65d3f837d4c53c3.jpg",images:["https://i.pinimg.com/736x/b8/dd/bf/b8ddbfe339a731f7a65d3f837d4c53c3.jpg","https://i.pinimg.com/736x/e1/0d/ea/e10dea32734a1075b49eb24cdd54fb69.jpg"],imageTitles:["Silver","Black"],category:"Колье",description:["Материал изделия:","Хирургическая сталь;","Фурнитура из нержавеющей стали.","","Срок изготовления — до 5 рабочих дней."]},
{id:15,name:"Браслет Trifecta",price:3500,image:"https://i.pinimg.com/736x/00/10/85/001085bdd3559fe09db4bfc229dfea3e.jpg",category:"Браслеты",description:["Материал изделия:","Хирургическая сталь;","Фурнитура из нержавеющей стали.","","Срок изготовления — до 5 рабочих дней."]},
{id:16,name:"Колье Nightfire",price:4000,image:"https://i.pinimg.com/736x/2f/da/b1/2fdab13d9ef59ae4cceca5399a5ba45b.jpg",category:"Колье",description:["Материал изделия:","Нержавеющая сталь;","Хирургическая сталь и фианиты.","","Срок изготовления — до 5 рабочих дней."]},
{id:17,name:"Серьги Biohazard",price:2500,image:"https://i.pinimg.com/736x/17/50/74/175074bab7105ecbc0a4cfc04982275d.jpg",category:"Серьги",description:["Материал изделия:","Хирургическая сталь;","Фурнитура из нержавеющей стали.","","Срок изготовления — до 5 рабочих дней."]},
{id:18,name:"Серьги Blood Cross",price:2000,image:"https://i.pinimg.com/736x/a8/31/6b/a8316bf1dec1c14b6a1c0884955b6164.jpg",images:["https://i.pinimg.com/736x/a8/31/6b/a8316bf1dec1c14b6a1c0884955b6164.jpg","https://i.pinimg.com/736x/ef/77/48/ef7748a67843be5c47a7d46daa982aed.jpg"],imageTitles:["Black","Red"],category:"Серьги",description:["Материал изделия:","Хирургическая сталь;","Фурнитура из нержавеющей стали.","","Срок изготовления — до 5 рабочих дней."]},
{id:19,name:"Серьги Cupid's Trick",price:2000,image:"https://i.pinimg.com/736x/c0/58/09/c05809e2aa398e44198a0d06845c0b80.jpg",category:"Серьги",description:["Материал изделия:","Хирургическая сталь;","Фурнитура из нержавеющей стали.","","Срок изготовления — до 5 рабочих дней."]},
{id:20,name:"Кулон Blackthorn",price:2000,image:"https://i.pinimg.com/736x/e9/d1/ed/e9d1ed17ff723fee65ee8cbd687b8de5.jpg",category:"Кулоны",description:["Материал изделия:","Хирургическая сталь;","Фурнитура из нержавеющей стали.","","Срок изготовления — до 5 рабочих дней."]},
{id:21,name:"Кулон Seraphim",price:2500,image:"https://i.pinimg.com/736x/ae/ce/f6/aecef69cff58a290c14677449109422f.jpg",category:"Кулоны",description:["Материал изделия:","Хирургическая сталь;","Фурнитура из нержавеющей стали.","","Срок изготовления — до 5 рабочих дней."]},
{id:22,name:"Кулон RE:",price:2100,image:"https://i.pinimg.com/736x/a3/d3/a6/a3d3a6123076477ec7a24c4157ab7b06.jpg",category:"Кулоны",description:["Материал изделия:","Ракушка;","Фурнитура из нержавеющей стали.","","Срок изготовления — до 5 рабочих дней."]},
{id:23,name:"Кольцо Labyrinth",price:2500,image:"https://i.pinimg.com/736x/fd/6a/de/fd6ade96f19faca8bb934659636794d4.jpg",category:"Кольца",description:["Материал изделия:","Хирургическая сталь.","","Срок изготовления — до 5 рабочих дней."]},
{id:24,name:"Кулон Proxy",price:2800,image:"https://i.pinimg.com/736x/8f/65/53/8f65538fb39bfeedf61ed75ad913adb6.jpg",category:"Кулоны",description:["Материал изделия:","Хирургическая сталь;","Фурнитура из нержавеющей стали.","","Срок изготовления — до 5 рабочих дней."]},
{id:25,name:"Кольцо Celestia",price:2500,image:"https://i.pinimg.com/736x/47/73/99/47739992c6bdcd39a11dcb1d80da5abd.jpg",category:"Кольца",description:["Материал изделия:","Хирургическая сталь;","Фурнитура из нержавеющей стали.","","Срок изготовления — до 5 рабочих дней."]},
{id:26,name:"Кольцо End",price:2300,image:"https://i.pinimg.com/736x/96/70/1b/96701bd895dd35eba330eeb1e136d05b.jpg",category:"Кольца",description:["Материал изделия:","Хирургическая сталь;","Фурнитура из нержавеющей стали.","","Срок изготовления — до 5 рабочих дней."]},
{id:27,name:"Серьги Tears",price:2000,image:"https://i.pinimg.com/736x/14/61/8a/14618af6202e7d4bb8aad9a805830018.jpg",category:"Серьги",description:["Материал изделия:","Хирургическая сталь;","Фурнитура из нержавеющей стали.","","Срок изготовления — до 5 рабочих дней."]},
{id:28,name:"Серьги Tears 2.0",price:2200,image:"https://i.pinimg.com/736x/fe/4d/d7/fe4dd765debf9777f082c288fff46d73.jpg",category:"Серьги",description:["Материал изделия:","Хирургическая сталь;","Фурнитура из нержавеющей стали.","","Срок изготовления — до 5 рабочих дней."]},
{id:29,name:"Колье Aquafina",price:4000,image:"https://i.pinimg.com/736x/ee/c1/f6/eec1f63dfac11d778b9f07d2b9dbed14.jpg",category:"Колье",description:["Материал изделия:","Хирургическая сталь;","Фурнитура из нержавеющей стали.","","Срок изготовления — до 5 рабочих дней."]},
{id:30,name:"Колье Femme",price:4000,image:"https://i.pinimg.com/736x/cb/75/30/cb7530bcf67a8b1228f27380af0c2ac8.jpg",category:"Колье",description:["Материал изделия:","Хирургическая сталь;","Фурнитура из нержавеющей стали.","","Срок изготовления — до 5 рабочих дней."]},
{id:31,name:"Колье Danse de cirque",price:5200,image:"https://i.pinimg.com/736x/e1/dd/12/e1dd12999a022cf617a6d434287f091b.jpg",images:["https://i.pinimg.com/736x/e1/dd/12/e1dd12999a022cf617a6d434287f091b.jpg","https://i.pinimg.com/736x/af/da/f3/afdaf38d5f440884e12a599cbe443946.jpg","https://i.pinimg.com/736x/b7/ff/d2/b7ffd273aa664490341e90d8893af6a0.jpg"],category:"Колье",description:["Материал изделия:","Хирургическая сталь;","Фурнитура из нержавеющей стали.","","Срок изготовления — до 5 рабочих дней."]},
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

<label id="promoLabel">Промокод</label>
<div style="display:flex;align-items:center;margin-bottom:10px;">
  <input type="text" id="promoInput" placeholder="Введите промокод" style="flex:1;margin-right:8px;">
  <button type="button" id="applyPromoBtn">Применить</button>
</div>
<div id="promoMessage" style="color:green;margin-bottom:10px;font-weight:500;"></div>

<div id="orderSum" style="color:#aaa;margin:10px 0;font-weight:500;">Итоговая сумма: 0 ₽</div>
<button type="submit">Оплатить</button>
`;

// ================== DaData ==================
$("#addressInput").suggestions({
  token:"4563b9c9765a1a2d7bf39e1c8944f7fadae05970",
  type:"ADDRESS",
  hint:false
});

// ================== МАСКА ТЕЛЕФОНА ==================
const phoneInput = orderForm.querySelector('input[name="phone"]');

function formatPhoneFlexible(value) {
  let digits = value.replace(/\D/g,'');
  if(!digits) return '';
  let parts = digits.match(/(\d{0,1})(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})/);
  if(!parts) return '';
  let formatted = '';
  if(parts[1]) formatted += parts[1];
  if(parts[2]) formatted += ` (${parts[2]}`;
  if(parts[3]) formatted += `) ${parts[3]}`;
  if(parts[4]) formatted += `-${parts[4]}`;
  if(parts[5]) formatted += `-${parts[5]}`;
  return formatted;
}

phoneInput.addEventListener('input', (e) => {
  const start = e.target.selectionStart;
  const oldLength = e.target.value.length;
  e.target.value = formatPhoneFlexible(e.target.value);
  const newLength = e.target.value.length;
  const diff = newLength - oldLength;
  e.target.setSelectionRange(start + diff, start + diff);
});

// ================== TELEGRAM ID С @ ==================
const tgInput = orderForm.querySelector('input[name="telegram"]');
tgInput.value = '@';
tgInput.addEventListener('input', ()=>{
  if(!tgInput.value.startsWith('@')) tgInput.value = '@' + tgInput.value.replace(/@/g,'');
});
if(window.Telegram?.WebApp?.initDataUnsafe?.user?.username){
  tgInput.value = '@' + Telegram.WebApp.initDataUnsafe.user.username;
}

// ================== ПРИМЕНЕНИЕ ПРОМОКОДА ==================
const promoInputEl = document.getElementById("promoInput");
const applyPromoBtn = document.getElementById("applyPromoBtn");
const promoMessageEl = document.getElementById("promoMessage");

applyPromoBtn.onclick = () => {
  const code = promoInputEl.value.trim();
  if(promoCodes[code]){
    appliedPromo = { code, discount: promoCodes[code] };
    promoMessageEl.style.color = "green";
    promoMessageEl.textContent = `Промокод применен: ${appliedPromo.discount}% скидка`;
  } else {
    appliedPromo = null;
    promoMessageEl.style.color = "red";
    promoMessageEl.textContent = "Неверный промокод";
  }
  updateOrderSum();
};

// ================== РАСЧЁТ СУММЫ С ПРОМОКОДОМ ==================
const deliverySelectEl = document.getElementById("deliverySelect");
const deliveryInfoEl = document.getElementById("deliveryInfo");
const orderSumEl = document.getElementById("orderSum");

function updateOrderSum() {
  let total = cart.reduce((s,i)=>s+i.count*i.product.price,0);
  let deliveryCost = 0;
  switch (deliverySelectEl.value){
    case "СДЭК": deliveryCost = 450; break;
    case "Почта России": deliveryCost = 550; break;
    case "Яндекс.Доставка": deliveryCost = 400; break;
  }
  let finalTotal = total + deliveryCost;

  if(appliedPromo){
    const discountAmount = Math.round(total * appliedPromo.discount / 100);
    finalTotal = finalTotal - discountAmount;
    orderSumEl.innerHTML = `Итоговая сумма: <span style="text-decoration:line-through;color:#aaa;">${total + deliveryCost} ₽</span> → ${finalTotal} ₽`;
  } else {
    orderSumEl.textContent = "Итоговая сумма: "+finalTotal+" ₽";
  }

  deliveryInfoEl.textContent = deliverySelectEl.value==="Самовывоз"?"Забрать заказ — Санкт-Петербург, Русановская 18к8":"";
}
deliverySelectEl.addEventListener("change", updateOrderSum);

// ================== КНОПКА ОФОРМИТЬ ЗАКАЗ ==================
checkoutButton.onclick = () => {
  if(!cart.length) return alert("Корзина пуста!");
  orderModal.style.display="flex";
  orderModal.style.pointerEvents="auto";
  updateOrderSum();
  document.activeElement.blur();
};

// ================== ЗАКРЫТИЕ МОДАЛКИ ==================
orderClose.onclick = ()=>orderModal.style.display="none";
orderModal.onclick = e=>{if(e.target===orderModal) orderModal.style.display="none";};

// ================== ПОДСВЕТКА КОРЗИНЫ ==================
function animateAddToCart() {
  cartButton.classList.remove("cart-pulse");
  void cartButton.offsetWidth;
  cartButton.classList.add("cart-pulse");
}

// ================== КНОПКА КОРЗИНЫ ==================
cartButton.style.position = "fixed"; 
cartButton.style.top = "10px"; 
cartButton.style.right = "20px"; 
cartButton.style.background = "none";
cartButton.style.border = "none";
cartButton.style.fontSize = "28px";
cartButton.style.display = "flex";
cartButton.style.alignItems = "center";
cartButton.style.justifyContent = "center";
cartButton.style.cursor = "pointer";
cartButton.style.padding = "0";
cartButton.style.lineHeight = "1";
cartButton.style.zIndex = "20000";

cartButton.innerHTML = `🛒<span id="cartCountCircle" style="display:none"></span>`;

const style = document.createElement("style");
style.innerHTML = `
body,
body.cart-mode,
body.tab-mode {
  background-image:url("https://i.pinimg.com/originals/6d/7c/65/6d7c65bbef77082a19ff4a2a2327d50d.jpg") !important;
  background-size:cover !important;
  background-position:center center !important;
  background-attachment:fixed !important;
  background-repeat:no-repeat !important;
}
#cartCountCircle {
  position: absolute;
  top: -6px;
  right: -6px;
  background: #aaa;
  color: white;
  font-size: 12px;
  font-weight: 600;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  transition: all 0.2s ease;
}
.modal-img-wrapper {
  position: relative;
}
.modal-gallery-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 34px;
  height: 34px;
  border: none;
  border-radius: 50%;
  background: rgba(0,0,0,0.5);
  color: #fff;
  cursor: pointer;
  font-size: 20px;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3;
}
.modal-gallery-btn.prev { left: 8px; }
.modal-gallery-btn.next { right: 8px; }
.modal-dots {
  display: flex;
  gap: 6px;
  justify-content: center;
  margin-top: 10px;
}
.modal-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: none;
  background: rgba(255,255,255,0.45);
  padding: 0;
}
.modal-dot.active {
  background: #fff;
}
.modal-option-panel {
  display: none;
  position: relative;
  margin-top: 10px;
  margin-bottom: 10px;
  background: #252525;
  border-radius: 10px;
  padding: 10px;
}
.modal-option-warning {
  display: none;
  position: absolute;
  left: 50%;
  top: -30px;
  transform: translateX(-50%);
  font-size: 11px;
  color: #ffdfdf;
  background: rgba(170, 40, 40, 0.92);
  border-radius: 999px;
  padding: 4px 10px;
  text-align: center;
  white-space: nowrap;
  z-index: 4;
}
.modal-options {
  display: flex;
  gap: 8px;
  justify-content: center;
}
.modal-option-btn {
  border: 1px solid #666;
  background: #2c2c2c;
  color: #fff;
  border-radius: 999px;
  padding: 6px 12px;
  cursor: pointer;
  font-size: 13px;
}
.modal-option-btn.active {
  border-color: #fff;
  background: #4a4a4a;
}
.modal-actions {
  display: flex;
  gap: 10px;
  margin-top: 14px;
}
.modal-actions > * {
  flex: 1;
}
.modal-actions .count-block {
  margin-top: 0;
}
.modal-action-btn {
  border: none;
  border-radius: 8px;
  padding: 10px 12px;
  cursor: pointer;
  font-size: 14px;
  min-height: 40px;
  outline: none;
}
.modal-action-btn.buy {
  background: #2c2c2c;
  color: #fff;
}
.modal-action-btn.cart {
  background: #2c2c2c;
  color: #fff;
}
.micro-btn {
  border: none;
  border-radius: 8px;
  background: #2c2c2c;
  color: #fff;
  padding: 10px 12px;
  font-size: 14px;
  cursor: pointer;
  min-height: 40px;
  width: 100%;
  outline: none;
}
.micro-btn:hover {
  background: #555;
}
#orderForm label,
#orderForm input,
#orderForm select,
#orderForm button,
#orderForm #deliveryInfo,
#orderForm #promoMessage,
#orderForm #orderSum {
  margin-bottom: 6px;
}
#promoLabel {
  margin-top: 12px;
}

`;
document.head.appendChild(style);
modalClose.style.position = "absolute";
modalClose.style.top = "10px";
modalClose.style.right = "10px";
modalClose.style.zIndex = "40";

// ================== ОБНОВЛЕНИЕ КОРЗИНЫ ==================
function updateCartCounter() {
  const c = cart.reduce((s,i)=>s+i.count,0);
  const counter = document.getElementById("cartCountCircle");
  if(counter) {
    if(c > 0){
      counter.style.display = "flex";  
      counter.textContent = c;
    } else {
      counter.style.display = "none";  
    }
  }
}

function getCartItemKey(productId, selectedOptionIndex){
  return `${productId}:${selectedOptionIndex ?? "none"}`;
}

function findCartItemByProduct(product, selectedOptionIndex){
  return cart.find(item => item.product.id===product.id && (item.selectedOptionIndex ?? null)===(selectedOptionIndex ?? null));
}

function getProductCartCount(productId){
  return cart
    .filter(item => item.product.id === productId)
    .reduce((sum, item) => sum + item.count, 0);
}

function getProductSearchName(product){
  return String(product.displayName || product.name || "").toLowerCase();
}

function getFilteredCurrentList(){
  const query = (searchInput?.value || "").toLowerCase().trim();
  const baseList = getCurrentList();
  if(!query) return baseList;
  return baseList.filter(p => getProductSearchName(p).includes(query));
}

function refreshProductList(){
  if(!productsEl) return;
  renderProducts(getFilteredCurrentList());
}

function renderProductControls(controls, originalProduct, selectedOptionIndex){
  const productCount = inCartScreen
    ? (findCartItemByProduct(originalProduct, selectedOptionIndex)?.count || 0)
    : getProductCartCount(originalProduct.id);

  controls.innerHTML = "";

  if(productCount > 0){
    const minus = document.createElement("button");
    minus.textContent="–";
    minus.onclick=e=>{
      e.stopPropagation();
      if(!inCartScreen && Array.isArray(productOptionConfig[originalProduct.id])) return openModal(originalProduct);
      removeFromCart(originalProduct, selectedOptionIndex);
    };
    const count = document.createElement("div");
    count.className="count-number";
    count.textContent=productCount;
    const plus = document.createElement("button");
    plus.textContent="+";
    plus.onclick=e=>{
      e.stopPropagation();
      if(!inCartScreen) return addToCart(originalProduct);
      addToCart(originalProduct, selectedOptionIndex);
    };
    controls.append(minus,count,plus);
  }else{
    const btn = document.createElement("button");
    btn.textContent="В корзину";
    btn.onclick=e=>{
      e.stopPropagation();
      if(!inCartScreen) return addToCart(originalProduct);
      addToCart(originalProduct, selectedOptionIndex);
    };
    btn.classList.add("micro-btn");
    controls.appendChild(btn);
  }
}

function updateVisibleProductCardControls(productId){
  if(inCartScreen) return;
  productsEl.querySelectorAll('.count-block').forEach(controls => {
    const cardProductId = Number(controls.dataset.productId || 0);
    if(cardProductId !== productId) return;
    const selectedOptionIndex = controls.dataset.selectedOptionIndex === "" ? null : Number(controls.dataset.selectedOptionIndex);
    renderProductControls(controls, controls._originalProduct, selectedOptionIndex);
  });
}

// ================== РЕНДЕР ==================
function renderProducts(list){
  productsEl.innerHTML="";
  list.forEach(p=>{
    const card=document.createElement("div"); card.className="product fade-slide";
    const originalProduct = p.originalProduct || p;
    const img=document.createElement("img"); img.src=originalProduct.image; img.onclick=()=>openModal(originalProduct);
    const title=document.createElement("h3"); title.textContent=p.displayName || originalProduct.name;
    const price=document.createElement("p"); price.textContent=p.price+" ₽";

    const controls=document.createElement("div"); controls.className="count-block";
    const selectedOptionIndex = p.selectedOptionIndex ?? null;
    controls.dataset.productId = String(originalProduct.id);
    controls.dataset.selectedOptionIndex = selectedOptionIndex ?? "";
    controls._originalProduct = originalProduct;
    renderProductControls(controls, originalProduct, selectedOptionIndex);

    card.append(img,title,price,controls);
    productsEl.appendChild(card);
    requestAnimationFrame(()=>{ card.style.opacity="1"; card.style.transform="translateY(0)"; });
  });
  updateCartUI();
  updateCartCounter();
}

// ================== КОРЗИНА ==================
function addToCart(p, forcedOptionIndex){
  const hasOptions = Array.isArray(productOptionConfig[p.id]);
  if(!inCartScreen && hasOptions && (forcedOptionIndex === undefined || forcedOptionIndex === null)){
    openModal(p);
    showOptionWarning("Выберите тип товара");
    return;
  }
  const selectedOptionIndex = forcedOptionIndex !== undefined ? forcedOptionIndex : getSelectedOptionIndex(p.id);
  const optionIndex = hasOptions ? selectedOptionIndex : null;

  let item = findCartItemByProduct(p, optionIndex);
  if(item) item.count++;
  else {
    item = {product: p, count:1, selectedOptionIndex: optionIndex};
    cart.push(item);
  }
  updateCartUI();
  updateCartCounter();
  if(inCartScreen) refreshProductList();
  else updateVisibleProductCardControls(p.id);
  if(currentModalProduct && currentModalProduct.id===p.id){ renderModalCounterControls(); }
  animateAddToCart();
}

function removeFromCart(p, forcedOptionIndex){
  const hasOptions = Array.isArray(productOptionConfig[p.id]);
  const selectedOptionIndex = forcedOptionIndex !== undefined ? forcedOptionIndex : getSelectedOptionIndex(p.id);
  const optionIndex = hasOptions ? selectedOptionIndex : null;

  let item = findCartItemByProduct(p, optionIndex);
  if(!item) return;
  item.count--;
  if(item.count <= 0) cart = cart.filter(x => getCartItemKey(x.product.id, x.selectedOptionIndex)!==getCartItemKey(p.id, optionIndex));
  updateCartUI();
  updateCartCounter();
  if(inCartScreen) refreshProductList();
  else updateVisibleProductCardControls(p.id);
  if(currentModalProduct && currentModalProduct.id===p.id){ renderModalCounterControls(); }
}

// ================== МОДАЛКА ==================
if(modalImageWrapper){
  modalPrevBtn.className = "modal-gallery-btn prev";
  modalPrevBtn.innerHTML = "&#8249;";
  modalNextBtn.className = "modal-gallery-btn next";
  modalNextBtn.innerHTML = "&#8250;";
  modalDots.className = "modal-dots";

  modalOptionsPanel.className = "modal-option-panel";
  modalOptionWarning.className = "modal-option-warning";
  modalOptions.className = "modal-options";
  modalOptionsPanel.append(modalOptionWarning, modalOptions);

  modalActions.className = "modal-actions";
  modalBuyBtn.type = "button";
  modalBuyBtn.className = "micro-btn";
  modalBuyBtn.textContent = "Купить";
  modalCounterControls.className = "count-block";
  modalActions.append(modalBuyBtn, modalCounterControls);

  modalImageWrapper.append(modalPrevBtn, modalNextBtn);
  modalImageWrapper.insertAdjacentElement("afterend", modalDots);
  modalPrice.insertAdjacentElement("afterend", modalOptionsPanel);
  modalDescription.insertAdjacentElement("afterend", modalActions);

  modalPrevBtn.onclick = (e) => { e.stopPropagation(); changeModalImage(-1); };
  modalNextBtn.onclick = (e) => { e.stopPropagation(); changeModalImage(1); };
  modalBuyBtn.onclick = (e) => { e.stopPropagation(); openOrderFromModal(); };

  modalImageWrapper.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].clientX;
  });
  modalImageWrapper.addEventListener("touchend", (e) => {
    const delta = e.changedTouches[0].clientX - touchStartX;
    if(Math.abs(delta) > 40){
      changeModalImage(delta > 0 ? -1 : 1);
    }
  });
}

function getProductImages(p){
  return Array.isArray(p.images) && p.images.length ? p.images : [p.image];
}

function getSelectedOptionIndex(productId){
  if(Object.prototype.hasOwnProperty.call(selectedProductOptions, productId)) return selectedProductOptions[productId];
  return Array.isArray(productOptionConfig[productId]) ? null : 0;
}

function setSelectedOption(productId, optionIndex){
  selectedProductOptions[productId] = optionIndex;
}

function getCartProductLabel(item){
  const options = productOptionConfig[item.product.id];
  if(!options || !options.length) return item.product.name;
  const selectedOption = options[item.selectedOptionIndex ?? 0] || options[0];
  return `${item.product.name} (${selectedOption.label})`;
}

function renderProductOptions(p){
  const options = productOptionConfig[p.id];
  modalOptions.innerHTML = "";

  if(!options || !options.length){
    modalOptionsPanel.style.display = "none";
    return;
  }

  const selectedIndex = getSelectedOptionIndex(p.id);
  options.forEach((option, idx) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "modal-option-btn" + (idx === selectedIndex ? " active" : "");
    btn.textContent = option.label;
    btn.onclick = (e) => {
      e.stopPropagation();
      setSelectedOption(p.id, idx);
      if(typeof option.imageIndex === "number" && modalImages.length){
        modalImageIndex = Math.max(0, Math.min(option.imageIndex, modalImages.length - 1));
        renderModalImage();
      }
      hideOptionWarning();
      renderProductOptions(p);
      renderModalCounterControls();
    };
    modalOptions.appendChild(btn);
  });

  modalOptionsPanel.style.display = "block";
}

function ensureModalOptionSelected(){
  if(!currentModalProduct) return false;
  const options = productOptionConfig[currentModalProduct.id];
  if(!options || !options.length) return true;
  if(getSelectedOptionIndex(currentModalProduct.id) === null){
    showOptionWarning("Выберите тип товара");
    return false;
  }
  hideOptionWarning();
  return true;
}

function showOptionWarning(message){
  modalOptionWarning.textContent = message;
  modalOptionWarning.style.display = "block";
}

function hideOptionWarning(){
  modalOptionWarning.textContent = "";
  modalOptionWarning.style.display = "none";
}

function renderModalCounterControls(){
  modalCounterControls.innerHTML = "";
  if(!currentModalProduct) return;

  const hasOptions = Array.isArray(productOptionConfig[currentModalProduct.id]);
  const selectedOptionIndex = getSelectedOptionIndex(currentModalProduct.id);
  const optionKey = hasOptions ? selectedOptionIndex : null;
  const item = findCartItemByProduct(currentModalProduct, optionKey);

  if(item){
    const minus = document.createElement("button");
    minus.textContent = "–";
    minus.onclick = (e) => { e.stopPropagation(); removeFromCart(currentModalProduct, optionKey); };

    const count = document.createElement("div");
    count.className = "count-number";
    count.textContent = item.count;

    const plus = document.createElement("button");
    plus.textContent = "+";
    plus.onclick = (e) => {
      e.stopPropagation();
      if(!ensureModalOptionSelected()) return;
      addToCart(currentModalProduct, optionKey);
    };

    modalCounterControls.append(minus, count, plus);
  } else {
    const addBtn = document.createElement("button");
    addBtn.type = "button";
    addBtn.className = "micro-btn";
    addBtn.textContent = "В корзину";
    addBtn.onclick = (e) => {
      e.stopPropagation();
      if(!ensureModalOptionSelected()) return;
      addToCart(currentModalProduct, optionKey);
    };
    modalCounterControls.appendChild(addBtn);
  }
}

function openOrderFromModal(){
  if(!currentModalProduct) return;
  if(!ensureModalOptionSelected()) return;
  const hasOptions = Array.isArray(productOptionConfig[currentModalProduct.id]);
  const selectedOptionIndex = getSelectedOptionIndex(currentModalProduct.id);
  addToCart(currentModalProduct, hasOptions ? selectedOptionIndex : null);
  modal.style.display = "none";
  orderModal.style.display = "flex";
  orderModal.style.pointerEvents = "auto";
  updateOrderSum();
}

function renderModalImage(){
  if(!modalImages.length) return;
  modalImage.src = modalImages[modalImageIndex];
  modalDots.innerHTML = "";
  modalImages.forEach((_, idx) => {
    const dot = document.createElement("button");
    dot.className = "modal-dot" + (idx === modalImageIndex ? " active" : "");
    dot.onclick = (e) => {
      e.stopPropagation();
      modalImageIndex = idx;
      renderModalImage();
    };
    modalDots.appendChild(dot);
  });
}

function changeModalImage(step){
  if(modalImages.length < 2) return;
  modalImageIndex = (modalImageIndex + step + modalImages.length) % modalImages.length;
  renderModalImage();
}

function openModal(p){
  currentModalProduct = p;
  modalImages = getProductImages(p);
  modalImageIndex = 0;

  renderModalImage();
  renderProductOptions(p);
  renderModalCounterControls();
  hideOptionWarning();

  const hasGallery = modalImages.length > 1;
  modalPrevBtn.style.display = hasGallery ? "flex" : "none";
  modalNextBtn.style.display = hasGallery ? "flex" : "none";
  modalDots.style.display = hasGallery ? "flex" : "none";

  modalImage.alt = p.name;
  modalTitle.textContent=p.name;
  modalPrice.textContent=p.price+" ₽";
  modalDescription.innerHTML=p.description.join("<br>");
  modal.style.display="flex";
}
modalClose.onclick = ()=>{ modal.style.display="none"; currentModalProduct = null; };
modal.onclick = e=>{if(e.target===modal) { modal.style.display="none"; currentModalProduct = null; }}
document.addEventListener("keydown", (e) => {
  if(modal.style.display !== "flex") return;
  if(e.key === "ArrowLeft") changeModalImage(-1);
  if(e.key === "ArrowRight") changeModalImage(1);
});

// ================== КОРЗИНА НА ГЛАВНОЙ ==================
cartButton.onclick = ()=>{
  if(!cart.length) return alert("Корзина пуста!");
  if(modal.style.display === "flex"){
    modal.style.display = "none";
    currentModalProduct = null;
  }
  inCartScreen = true;
  document.body.classList.add("cart-mode");
  refreshProductList();
};
mainTitle.onclick = ()=>{
  inCartScreen = false;
  document.body.classList.remove("cart-mode");
  currentCategory="Главная";
  refreshProductList();
};

// ================== ОБНОВЛЕНИЕ КОРЗИНЫ ==================
function updateCartUI(){
  const c = cart.reduce((s,i)=>s+i.count,0);
  const t = cart.reduce((s,i)=>s+i.count*i.product.price,0);
  cartCount.textContent = c;
  cartTotal.textContent = t?"Итого: "+t+" ₽":"";  
  cartTotal.style.display = inCartScreen?"block":"none";
  checkoutButton.style.display = c && inCartScreen?"block":"none";
  footerButtons.style.display = inCartScreen?"none":"flex";
  searchInput.style.display = inCartScreen?"none":"block";
  updateOrderSum();
}

function setupCategoriesMenu(){
  const orderedCategories = ["Главная","Браслеты","Кулоны","Колье","Обвесы","Серьги","Кольца"];
  const categoryMap = new Map();

  categoriesEl.querySelectorAll("div").forEach(cat => {
    categoryMap.set((cat.dataset.category || "").toLowerCase(), cat);
  });

  categoriesEl.innerHTML = "";
  orderedCategories.forEach((name, index) => {
    const existing = categoryMap.get(name.toLowerCase());
    if(!existing) return;
    existing.style.order = String(index);
    existing.style.marginTop = index === 0 ? "0" : "";
    if(index === 0){
      existing.style.fontWeight = "700";
      existing.style.paddingTop = "4px";
      existing.style.paddingBottom = "10px";
      existing.style.borderBottom = "1px solid rgba(255,255,255,0.2)";
      existing.style.marginBottom = "8px";
    } else {
      existing.style.fontWeight = "500";
      existing.style.borderBottom = "";
      existing.style.marginBottom = "0";
      existing.style.paddingTop = "";
      existing.style.paddingBottom = "";
    }
    categoriesEl.appendChild(existing);
  });
}

setupCategoriesMenu();

// ================== ГАМБУРГЕР ==================
menuIcon.onclick = ()=> categoriesEl.classList.toggle("show");
categoriesEl.querySelectorAll("div").forEach(cat=>{
  cat.onclick = ()=>{
    currentCategory = cat.dataset.category;
    inCartScreen=false;
    categoriesEl.classList.remove("show");
    refreshProductList();
  }
});

// ================== КЛИК ПО ПУСТОМУ МЕСТУ ==================
document.addEventListener("click", (e)=>{ if(!categoriesEl.contains(e.target) && !menuIcon.contains(e.target) && e.target !== searchInput){ categoriesEl.classList.remove("show"); searchInput.blur(); } });

// ================== ПОИСК ==================
if(searchInput){
  searchInput.oninput = refreshProductList;
}

// ================== GET LIST ==================
function getCurrentList(){
  if(inCartScreen) {
    return cart.map(i=>({
      ...i.product,
      originalProduct: i.product,
      selectedOptionIndex: i.selectedOptionIndex,
      displayName: getCartProductLabel(i)
    }));
  }
  if(currentCategory==="Главная") return products;
  return products.filter(p=>p.category===currentCategory);
}

// ================== ОПЛАТА С ФИКСОМ ==================
orderForm.onsubmit = async (e) => {
  e.preventDefault();
  if (isSubmitting) return;
  if (!cart.length) { alert("Корзина пуста"); return; }
  isSubmitting = true;

  const waitModal = document.createElement("div");
  waitModal.style.position = "fixed";
  waitModal.style.top = "0";
  waitModal.style.left = "0";
  waitModal.style.width = "100%";
  waitModal.style.height = "100%";
  waitModal.style.backgroundColor = "rgba(44,44,44,0.95)";
  waitModal.style.color = "#fff";
  waitModal.style.display = "flex";
  waitModal.style.flexDirection = "column";
  waitModal.style.alignItems = "center";
  waitModal.style.justifyContent = "center";
  waitModal.style.fontSize = "16px";
  waitModal.style.textAlign = "center";
  waitModal.style.zIndex = 9999;
  waitModal.style.pointerEvents = "auto";
  waitModal.innerHTML = `
    <div style="margin-bottom:5px; font-weight:600;">Переносим вас на оплату</div>
    <div>Пожалуйста, подождите пару секунд...</div>
  `;
  document.body.appendChild(waitModal);

  const fd = new FormData(orderForm);
  let deliveryCost = 0;
  switch (fd.get("delivery")) {
    case "СДЭК": deliveryCost = 450; break;
    case "Почта России": deliveryCost = 550; break;
    case "Яндекс.Доставка": deliveryCost = 400; break;
  }

  let total = cart.reduce((s,i)=>s+i.count*i.product.price,0) + deliveryCost;

  // применяем промокод при отправке заказа
  if(appliedPromo){
    const discountAmount = Math.round(cart.reduce((s,i)=>s+i.count*i.product.price,0) * appliedPromo.discount / 100);
    total -= discountAmount;
  }

  const orderData = {
    fullname: fd.get("fullname"),
    phone: fd.get("phone"),
    telegram: fd.get("telegram"),
    delivery: fd.get("delivery"),
    address: fd.get("address"),
    products: cart.map(i=>`• ${getCartProductLabel(i)} x${i.count}`).join("\n"),
    total
  };

  sendTelegramOrder(orderData);
  sendEmailOrder(orderData);

  try {
    const orderId = Date.now();
    const res = await fetch("https://telegram-catalog-alpha.vercel.app/api/create-payment", {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body: JSON.stringify({
        amount: total,
        order_id: orderId,
        return_url: "https://t.me/CChronicleChains_bot"
      })
    });
    const data = await res.json();
    if(!data.payment_url){ alert("Ошибка создания платежа"); isSubmitting=false; document.body.removeChild(waitModal); return; }

    if(window.Telegram?.WebApp?.openLink){
      Telegram.WebApp.openLink(data.payment_url, { try_instant_view:false });
    } else {
      window.location.href = data.payment_url;
    }
  } catch(err){
    console.error(err);
    alert("Ошибка при оплате");
    isSubmitting=false;
    document.body.removeChild(waitModal);
    return;
  }

  setTimeout(() => {
    if(document.body.contains(waitModal)) document.body.removeChild(waitModal);
    const thankModal = document.createElement("div");
    thankModal.style.position="fixed";
    thankModal.style.top="0";
    thankModal.style.left="0";
    thankModal.style.width="100%";
    thankModal.style.height="100%";
    thankModal.style.backgroundColor="rgba(44,44,44,0.95)";
    thankModal.style.color="#fff";
    thankModal.style.display="flex";
    thankModal.style.alignItems="center";
    thankModal.style.justifyContent = "center";
    thankModal.style.fontSize = "18px";
    thankModal.style.textAlign = "center";
    thankModal.style.padding = "20px";
    thankModal.style.zIndex = 9999;
    thankModal.style.cursor = "pointer";
    thankModal.style.flexDirection = "column";
    thankModal.innerText = "СПАСИБО ЗА ВЫБОР CHRONICLE CHAINS!\n\nМЫ УЖЕ ПРИНЯЛИ ВАШ ЗАКАЗ И НАЧИНАЕМ ЕГО СОБИРАТЬ <3\n\nС вами свяжутся когда посылка будет отправлена!!";

    thankModal.onclick = () => {
      document.body.removeChild(thankModal);
      isSubmitting = false;
    };

    document.body.appendChild(thankModal);
  }, 10000);
};

// ================== СТАРТ ==================
refreshProductList();
updateCartUI();
updateOrderSum();
updateCartCounter();
