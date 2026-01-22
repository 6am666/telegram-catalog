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
 {id:9,name:'Кулон "ILG"',price:2500,image:"https://i.pinimg.com/736x/d2/4f/e4/d24fe4ea890cf2dfba6872676c255701.jpg",category:"Кулоны",description:[
    "Материал изделия:","Хирургическая и нержавеющая сталь.","","Цепочка:","Нержавеющая сталь.","","Срок изготовления - до 5 рабочих дней."
  ]},
  {id:10,name:"Кольчужный топ",price:18000,image:"https://i.pinimg.com/736x/a9/95/24/a995240ff0d58266a65e1edc78c366ed.jpg",category:"Топы",description:["Материал изделия: Полностью хирургическая сталь","","Срок изготовления — до 14 рабочих дней."]},
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
$("#addressInput").suggestions({
  token:"4563b9c9765a1a2d7bf39e1c8944f7fadae05970",
  type:"ADDRESS",
  hint:false
});

// ================== РАСЧЁТ СУММЫ ==================
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
  orderSumEl.textContent = "Итоговая сумма: "+(total+deliveryCost)+" ₽";
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

// ================== КНОПКА КОРЗИНЫ 🛒 С КРУЖКОМ ==================
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
cartButton.style.zIndex = "10000";

cartButton.innerHTML = `🛒<span id="cartCountCircle" style="display:none"></span>`;

const style = document.createElement("style");
style.innerHTML = `
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
`;
document.head.appendChild(style);

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

// ================== РЕНДЕР ==================
function renderProducts(list){
  productsEl.innerHTML="";
  list.forEach(p=>{
    const card=document.createElement("div"); card.className="product fade-slide";
    const img=document.createElement("img"); img.src=p.image; img.onclick=()=>openModal(p);
    const title=document.createElement("h3"); title.textContent=p.name;
    const price=document.createElement("p"); price.textContent=p.price+" ₽";

    const controls=document.createElement("div"); controls.className="count-block";
    const item = cart.find(i=>i.product.id===p.id);

    if(item){
      const minus = document.createElement("button"); minus.textContent="–"; minus.onclick=e=>{e.stopPropagation(); removeFromCart(p)};
      const count = document.createElement("div"); count.className="count-number"; count.textContent=item.count;
      const plus = document.createElement("button"); plus.textContent="+"; plus.onclick=e=>{e.stopPropagation(); addToCart(p)};
      controls.append(minus,count,plus);
    }else{
      const btn = document.createElement("button"); btn.textContent="В корзину"; btn.onclick=e=>{e.stopPropagation(); addToCart(p)};
      btn.classList.add("micro-btn");
      controls.appendChild(btn);
    }

    card.append(img,title,price,controls);
    productsEl.appendChild(card);
    requestAnimationFrame(()=>{ card.style.opacity="1"; card.style.transform="translateY(0)"; });
  });
  updateCartUI();
  updateCartCounter();
}

// ================== КОРЗИНА ==================
function addToCart(p){
  let item = cart.find(x=>x.product.id===p.id);
  if(item) item.count++;
  else cart.push({product: p, count:1});
  updateCartUI();
  updateCartCounter();
  if(inCartScreen){ renderProducts(cart.map(i=>i.product)); } 
  else {
    const card = [...productsEl.children].find(c=>c.querySelector("h3")?.textContent===p.name);
    if(card){
      const countDiv = card.querySelector(".count-number");
      if(countDiv) countDiv.textContent = item.count;
      else {
        const controls = card.querySelector(".count-block");
        controls.innerHTML = "";
        const minus=document.createElement("button"); minus.textContent="–"; minus.onclick=e=>{e.stopPropagation(); removeFromCart(p)};
        const count=document.createElement("div"); count.className="count-number"; count.textContent="1";
        const plus=document.createElement("button"); plus.textContent="+"; plus.onclick=e=>{e.stopPropagation(); addToCart(p)};
        controls.append(minus,count,plus);
      }
    }
  }
  animateAddToCart();
}

function removeFromCart(p){
  let item = cart.find(x=>x.product.id===p.id);
  if(!item) return;
  item.count--;
  if(item.count <= 0) cart = cart.filter(x=>x.product.id!==p.id);
  updateCartUI();
  updateCartCounter();
  if(inCartScreen){ renderProducts(cart.map(i=>i.product)); } 
  else {
    const card = [...productsEl.children].find(c=>c.querySelector("h3")?.textContent===p.name);
    if(card){
      const controls = card.querySelector(".count-block");
      if(item.count > 0){ controls.querySelector(".count-number").textContent = item.count; } 
      else {
        controls.innerHTML = "";
        const btn = document.createElement("button");
        btn.textContent = "В корзину";
        btn.classList.add("micro-btn");
        btn.onclick = e => { e.stopPropagation(); addToCart(p); };
        controls.appendChild(btn);
      }
    }
  }
}

// ================== МОДАЛКА ==================
function openModal(p){
  modalImage.src=p.image;
  modalTitle.textContent=p.name;
  modalPrice.textContent=p.price+" ₽";
  modalDescription.innerHTML=p.description.join("<br>");
  modal.style.display="flex";
}
modalClose.onclick = ()=>modal.style.display="none";
modal.onclick = e=>{if(e.target===modal) modal.style.display="none";}

// ================== КОРЗИНА НА ГЛАВНОЙ ==================
cartButton.onclick = ()=>{ if(!cart.length) return alert("Корзина пуста!"); inCartScreen = true; document.body.classList.add("cart-mode"); renderProducts(cart.map(i=>i.product)); };
mainTitle.onclick = ()=>{ inCartScreen = false; document.body.classList.remove("cart-mode"); currentCategory="Главная"; renderProducts(products); };

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

// ================== ГАМБУРГЕР ==================
menuIcon.onclick = ()=> categoriesEl.classList.toggle("show");
categoriesEl.querySelectorAll("div").forEach(cat=>{
  cat.onclick = ()=>{ currentCategory = cat.dataset.category; inCartScreen=false; categoriesEl.classList.remove("show"); renderProducts(getCurrentList()); }
});

// ================== КЛИК ПО ПУСТОМУ МЕСТУ ==================
document.addEventListener("click", (e)=>{ if(!categoriesEl.contains(e.target) && !menuIcon.contains(e.target) && e.target !== searchInput){ categoriesEl.classList.remove("show"); searchInput.blur(); } });

// ================== ПОИСК ==================
searchInput.oninput = ()=>{ const val = searchInput.value.toLowerCase(); renderProducts(getCurrentList().filter(p=>p.name.toLowerCase().includes(val))); };

// ================== GET LIST ==================
function getCurrentList(){ if(inCartScreen) return cart.map(i=>i.product); if(currentCategory==="Главная") return products; return products.filter(p=>p.category===currentCategory); }

// ================== ОПЛАТА С ФИКСОМ ==================
orderForm.onsubmit = async (e) => {
  e.preventDefault();
  if (isSubmitting) return;
  if (!cart.length) { alert("Корзина пуста"); return; }
  isSubmitting = true;

  // Модалка ожидания
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

  // Данные заказа
  const fd = new FormData(orderForm);
  let deliveryCost = 0;
  switch (fd.get("delivery")) {
    case "СДЭК": deliveryCost = 450; break;
    case "Почта России": deliveryCost = 550; break;
    case "Яндекс.Доставка": deliveryCost = 400; break;
  }
  const total = cart.reduce((s,i)=>s+i.count*i.product.price,0) + deliveryCost;

  sendTelegramOrder({
    fullname: fd.get("fullname"),
    phone: fd.get("phone"),
    telegram: fd.get("telegram"),
    delivery: fd.get("delivery"),
    address: fd.get("address"),
    products: cart.map(i=>`• ${i.product.name} x${i.count}`).join("\n"),
    total
  });

  // Открытие платежа
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

  // Спасибо через 10 секунд
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
    thankModal.innerText = "СПАСИБО ЗА ВЫБОР CHRONICLE CHAINS!\nМЫ УЖЕ ПРИНЯЛИ ВАШ ЗАКАЗ И НАЧИНАЕМ ЕГО СОБИРАТЬ <3";

    thankModal.onclick = () => {
      document.body.removeChild(thankModal);
      isSubmitting = false;
    };

    document.body.appendChild(thankModal);
  }, 10000);
};

// ================== СТАРТ ==================
renderProducts(products);
updateCartUI();
updateOrderSum();
updateCartCounter();
