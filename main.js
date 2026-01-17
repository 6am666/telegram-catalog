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
    ).catch(()=>{});
  });
}

// ================== ТОВАРЫ ==================
const products = [/* ← ТВОЙ МАССИВ ТОВАРОВ БЕЗ ИЗМЕНЕНИЙ */];

// ================== ФОРМА ==================
orderForm.innerHTML = `
<label>ФИО</label>
<input type="text" name="fullname" required>

<label>Адрес</label>
<input type="text" name="address" id="addressInput" required>

<label>Доставка</label>
<select name="delivery" id="deliverySelect" required>
  <option value="" disabled selected>Выберите доставку</option>
  <option value="СДЭК">СДЭК — 450₽</option>
  <option value="Почта России">Почта России — 550₽</option>
  <option value="Яндекс.Доставка">Яндекс.Доставка — 400₽</option>
  <option value="Самовывоз">Самовывоз</option>
</select>
<div id="deliveryInfo"></div>

<label>Номер телефона</label>
<input type="text" name="phone" required>

<label>Telegram ID</label>
<input type="text" name="telegram" placeholder="@id" required>

<div id="orderSum">Итоговая сумма: 0 ₽</div>
<button type="submit">Оплатить</button>
`;

// ================== DADATA ==================
$(function(){
  $("#addressInput").suggestions({
    token:"4563b9c9765a1a2d7bf39e1c8944f7fadae05970",
    type:"ADDRESS",
    hint:false
  });
});

// ================== СУММА ==================
const deliverySelect = document.getElementById("deliverySelect");
const orderSumEl = document.getElementById("orderSum");
const deliveryInfo = document.getElementById("deliveryInfo");

function updateOrderSum() {
  let total = cart.reduce((s,i)=>s+i.count*i.product.price,0);
  let d = 0;

  if(deliverySelect.value==="СДЭК") d=450;
  if(deliverySelect.value==="Почта России") d=550;
  if(deliverySelect.value==="Яндекс.Доставка") d=400;

  orderSumEl.textContent = "Итоговая сумма: " + (total + d) + " ₽";
  deliveryInfo.textContent =
    deliverySelect.value==="Самовывоз"
    ? "Санкт-Петербург, Русановская 18к8"
    : "";
}
deliverySelect.onchange = updateOrderSum;

// ================== КОРЗИНА UI ==================
function updateCartUI(){
  const count = cart.reduce((s,i)=>s+i.count,0);
  const total = cart.reduce((s,i)=>s+i.count*i.product.price,0);

  cartCount.textContent = count;
  cartTotal.textContent = total ? "Итого: " + total + " ₽" : "";

  cartButton.style.display = inCartScreen ? "none" : "flex";
  cartTotal.style.display = inCartScreen && count ? "block" : "none";
  checkoutButton.style.display = inCartScreen && count ? "block" : "none";
  footerButtons.style.display = inCartScreen ? "none" : "flex";

  updateOrderSum();
}

// ================== РЕНДЕР ==================
function renderProducts(list){
  productsEl.innerHTML = "";

  if(inCartScreen){
    productsEl.style.background = "rgba(0,0,0,0.6)";
    productsEl.style.padding = "16px";
    productsEl.style.borderRadius = "16px";
  } else {
    productsEl.style.background = "";
    productsEl.style.padding = "";
    productsEl.style.borderRadius = "";
  }

  list.forEach(p=>{
    const card=document.createElement("div");
    card.className="product";

    const img=document.createElement("img");
    img.src=p.image;
    img.onclick=()=>openModal(p);

    const title=document.createElement("h3");
    title.textContent=p.name;

    const price=document.createElement("p");
    price.textContent=p.price+" ₽";

    const controls=document.createElement("div");
    controls.className="count-block";

    const item=cart.find(i=>i.product.id===p.id);
    if(item){
      controls.innerHTML = `
        <button>–</button>
        <div class="count-number">${item.count}</div>
        <button>+</button>
      `;
      controls.children[0].onclick=e=>{e.stopPropagation();removeFromCart(p)};
      controls.children[2].onclick=e=>{e.stopPropagation();addToCart(p)};
    } else {
      const btn=document.createElement("button");
      btn.textContent="В корзину";
      btn.onclick=e=>{e.stopPropagation();addToCart(p)};
      controls.appendChild(btn);
    }

    card.append(img,title,price,controls);
    productsEl.appendChild(card);
  });

  updateCartUI();
}

// ================== ДОБАВЛЕНИЕ ==================
function addToCart(p){
  const i=cart.find(x=>x.product.id===p.id);
  i?i.count++:cart.push({product:p,count:1});
  renderProducts(getCurrentList());
}
function removeFromCart(p){
  const i=cart.find(x=>x.product.id===p.id);
  if(!i)return;
  i.count--;
  if(i.count===0)cart=cart.filter(x=>x!==i);
  renderProducts(getCurrentList());
}

// ================== НАВИГАЦИЯ ==================
cartButton.onclick=()=>{
  inCartScreen=true;
  renderProducts(cart.map(i=>i.product));
};

mainTitle.onclick=()=>{
  inCartScreen=false;
  currentCategory="Главная";
  renderProducts(products);
};

categories.querySelectorAll("div").forEach(c=>{
  c.onclick=()=>{
    inCartScreen=false;
    currentCategory=c.dataset.category;
    renderProducts(getCurrentList());
    categories.classList.remove("show");
  };
});

// ================== МОДАЛКИ ==================
function openModal(p){
  modalImage.src=p.image;
  modalTitle.textContent=p.name;
  modalPrice.textContent=p.price+" ₽";
  modalDescription.innerHTML=p.description.join("<br>");
  modal.style.display="flex";
}
modalClose.onclick=()=>modal.style.display="none";
modal.onclick=e=>{if(e.target===modal)modal.style.display="none"};

// ================== СТАРТ ==================
renderProducts(products);
updateOrderSum();
