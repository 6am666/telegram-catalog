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

// ================== ФОРМА ОФОРМЛЕНИЯ ==================
orderForm.innerHTML = `
<label>ФИО</label>
<input type="text" name="fullname" placeholder="Введите ФИО" required>

<label>Адрес</label>
<input type="text" name="address" id="addressInput" placeholder="Город, улица, дом, индекс" required>

<label>Доставка</label>
<select name="delivery" id="deliverySelect" required>
  <option value="" disabled selected>Выберите способ доставки</option>
  <option value="СДЭК">СДЭК — 450₽</option>
  <option value="Почта России">Почта России — 550₽</option>
  <option value="Яндекс.Доставка">Яндекс.Доставка — 400₽</option>
  <option value="Самовывоз">Самовывоз</option>
</select>
<div id="deliveryInfo" style="color:#aaa;margin-top:4px;"></div>

<label>Номер телефона</label>
<input type="text" name="phone" placeholder="Введите номер" required>

<label>Telegram ID</label>
<input type="text" name="telegram" placeholder="@id" required>

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

// ================== РАССЧЁТ СУММЫ ==================
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
    case "Самовывоз": deliveryCost = 0; break;
  }
  orderSumEl.textContent = "Итоговая сумма: " + (total + deliveryCost) + " ₽";
  if(deliverySelectEl.value === "Самовывоз") deliveryInfoEl.textContent="Забрать заказ можно будет — Санкт-Петербург, Русановская 18к8";
  else deliveryInfoEl.textContent="";
}

deliverySelectEl.addEventListener("change", updateOrderSum);

// ================== EMAIL + TELEGRAM ==================
orderForm.onsubmit = e=>{
  e.preventDefault();
  if(isSubmitting) return;
  if(!cart.length) return alert("Корзина пуста!");
  isSubmitting = true;

  const fd = new FormData(orderForm);
  const productsList = cart.map(i=>"• "+i.product.name+" x"+i.count).join("\n");
  const deliveryCost = (()=>{switch(fd.get("delivery")){
    case "СДЭК": return 450;
    case "Почта России": return 550;
    case "Яндекс.Доставка": return 400;
    default: return 0;
  }})();

  const total = cart.reduce((s,i)=>s+i.count*i.product.price,0) + deliveryCost;

  const data = {
    fullname: fd.get("fullname"),
    phone: fd.get("phone"),
    telegram: fd.get("telegram"),
    delivery: fd.get("delivery"),
    address: fd.get("address"),
    products: productsList,
    total
  };

  emailjs.send("service_6drenuw","template_90b82bq",data)
    .then(()=>{
      sendTelegramOrder(data);
      cart=[];
      renderProducts(products);
      updateOrderSum();
      orderModal.style.display="none";
      isSubmitting=false;
      document.activeElement.blur();
      alert("Заказ принят!");
    })
    .catch(()=>{
      isSubmitting=false;
      alert("Ошибка отправки");
    });
};

// ================== КНОПКА ЗАКРЫТИЯ + ФОН ==================
orderClose.onclick = () => {
  orderModal.style.display = "none";
  document.activeElement.blur();
};
orderModal.onclick = e => {
  if(e.target===orderModal){
    orderModal.style.display = "none";
    document.activeElement.blur();
  }
};

// ================== ГАМБУРГЕР ==================
menuIcon.onclick = () => {
  categories.classList.toggle("show");
};
categories.querySelectorAll("div").forEach(c => {
  c.onclick = () => categories.classList.remove("show");
});
document.addEventListener("click", e => {
  if (!categories.contains(e.target) && !menuIcon.contains(e.target)) {
    categories.classList.remove("show");
  }
});

// ================== ОБНОВЛЕНИЕ КОРЗИНЫ ==================
function updateCartUI(){
  const c = cart.reduce((s,i)=>s+i.count,0);
  const t = cart.reduce((s,i)=>s+i.count*i.product.price,0);
  cartCount.textContent=c;
  cartTotal.textContent=t?"Итого: "+t+" ₽":"";
  cartTotal.style.display=inCartScreen?"block":"none";
  checkoutButton.style.display=c&&inCartScreen?"block":"none";
  footerButtons.style.display=inCartScreen?"none":"flex";

  updateOrderSum();

  // 🔴 ПРАВКА: скрываем поиск в корзине
  searchInput.style.display = inCartScreen ? "none" : "block";
}

// ================== КОРЗИНА ==================
checkoutButton.textContent="Оформить заказ";
checkoutButton.onclick=()=>{
  if(!cart.length)return alert("Корзина пуста!");
  orderModal.style.display="flex";
  updateOrderSum();
};

// ================== ПОИСК ==================
searchInput.oninput=()=>{const val=searchInput.value.toLowerCase(); renderProducts(getCurrentList().filter(p=>p.name.toLowerCase().includes(val)));};

// ================== РЕНДЕР ==================
function renderProducts(list){
  productsEl.innerHTML="";
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
      const minus=document.createElement("button");
      minus.textContent="–";
      minus.onclick=e=>{e.stopPropagation();removeFromCart(p)};
      const count=document.createElement("div");
      count.className="count-number";
      count.textContent=item.count;
      const plus=document.createElement("button");
      plus.textContent="+";
      plus.onclick=e=>{e.stopPropagation();addToCart(p)};
      controls.append(minus,count,plus);
    }else{
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

// ================== ДОБАВЛЕНИЕ/УДАЛЕНИЕ ==================
function addToCart(p){
  const i = cart.find(x=>x.product.id===p.id);
  i?i.count++:cart.push({product:p,count:1});
  renderProducts(getCurrentList());
}
function removeFromCart(p){
  const i = cart.find(x=>x.product.id===p.id);
  if(!i)return;
  i.count--;
  if(i.count===0)cart=cart.filter(x=>x!==i);
  renderProducts(getCurrentList());
}

// ================== МОДАЛКА ==================
function openModal(p){
  modalImage.src=p.image;
  modalTitle.textContent=p.name;
  modalPrice.textContent=p.price+" ₽";
  modalDescription.innerHTML=p.description.join("<br>");
  modal.style.display="flex";
}
modalClose.onclick=()=>modal.style.display="none";
modal.onclick=e=>{if(e.target===modal)modal.style.display="none"};

function getCurrentList(){
  if(inCartScreen)return cart.map(i=>i.product);
  if(currentCategory==="Главная")return products;
  return products.filter(p=>p.category===currentCategory);
}

categories.querySelectorAll("div").forEach(c=>{
  c.onclick=()=>{
    inCartScreen=false;
    document.body.classList.remove("cart-mode"); // 🔴 фикс фона для категорий
    currentCategory=c.dataset.category;
    renderProducts(getCurrentList());
    categories.classList.remove("show");
  };
});

mainTitle.onclick=()=>{
  inCartScreen=false;
  document.body.classList.remove("cart-mode"); // 🔴 возвращаем фон
  currentCategory="Главная";
  renderProducts(products);
};

cartButton.onclick=()=>{
  inCartScreen=true;
  document.body.classList.add("cart-mode"); // 🔴 фикс фона
  renderProducts(cart.map(i=>i.product));
};

// ================== СТАРТ ==================
renderProducts(products);
updateOrderSum();
