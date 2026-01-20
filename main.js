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

// ================== РАСЧЁТ СУММЫ ==================
const deliverySelectEl = document.getElementById("deliverySelect");
const deliveryInfoEl = document.getElementById("deliveryInfo");
const orderSumEl = document.getElementById("orderSum");
function updateOrderSum() {
  let total = cart.reduce((s,i)=>s+i.count*i.product.price,0);
  let deliveryCost = 0;
  switch(deliverySelectEl.value){
    case "СДЭК": deliveryCost = 450; break;
    case "Почта России": deliveryCost = 550; break;
    case "Яндекс.Доставка": deliveryCost = 400; break;
    default: deliveryCost = 0;
  }
  orderSumEl.textContent = "Итоговая сумма: "+(total+deliveryCost)+" ₽";
  deliveryInfoEl.textContent = deliverySelectEl.value==="Самовывоз"?"Забрать заказ — Санкт-Петербург, Русановская 18к8":"";
}
deliverySelectEl.addEventListener("change", updateOrderSum);

// ================== ПОДСВЕТКА КОРЗИНЫ ==================
function animateAddToCart(){
  cartButton.classList.remove("cart-pulse");
  void cartButton.offsetWidth;
  cartButton.classList.add("cart-pulse");
}

// ================== КОРЗИНА ==================
function addToCart(p){
  let item = cart.find(x => x.product.id === p.id);
  const isNew = !item;

  if(item) item.count++;
  else {
    item = { product:p, count:1 };
    cart.push(item);
  }

  updateCartUI();

  const card = [...productsEl.children].find(c=>c.querySelector("h3")?.textContent===p.name);
  if(!card) return;
  const controls = card.querySelector(".count-block");

  if(isNew){
    controls.innerHTML="";
    const minus=document.createElement("button"); minus.textContent="–"; minus.onclick=e=>{e.stopPropagation();removeFromCart(p)};
    const count=document.createElement("div"); count.className="count-number"; count.textContent="1";
    const plus=document.createElement("button"); plus.textContent="+"; plus.onclick=e=>{e.stopPropagation();addToCart(p)};
    controls.append(minus,count,plus);
  } else {
    controls.querySelector(".count-number").textContent=item.count;
  }

  animateAddToCart();
}

function removeFromCart(p){
  const item = cart.find(x=>x.product.id===p.id);
  if(!item) return;
  item.count--;
  if(item.count===0) cart=cart.filter(x=>x!==item);
  updateCartUI();

  const card=[...productsEl.children].find(c=>c.querySelector("h3")?.textContent===p.name);
  if(!card) return;
  const controls=card.querySelector(".count-block");

  if(item.count>0){
    controls.querySelector(".count-number").textContent=item.count;
  } else {
    controls.innerHTML="";
    const btn=document.createElement("button");
    btn.textContent="В корзину";
    btn.classList.add("micro-btn");
    btn.onclick=e=>{e.stopPropagation();addToCart(p)};
    controls.appendChild(btn);
  }
}

// ================== ОСТАЛЬНОЕ БЕЗ ИЗМЕНЕНИЙ ==================
// ... тут оставляем весь твой renderProducts, модалки, гамбургер, поиск, checkout, updateCartUI ...
// ================== СТАРТ ==================
renderProducts(products);
updateCartUI();
updateOrderSum();

// ================== CSS ПОДСВЕТКИ ==================
const style=document.createElement("style");
style.innerHTML=`
.cart-pulse {
  animation: cartPulse 0.35s ease;
}
@keyframes cartPulse {
  0%   { transform: scale(1); }
  40%  { transform: scale(1.15); }
  100% { transform: scale(1); }
}
`;
document.head.appendChild(style);
