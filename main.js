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
  {id:9,name:"Кольчужный топ",price:18000,image:"https://i.pinimg.com/736x/a9/95/24/a995240ff0d58266a65e1edc78c366ed.jpg",category:"Тест",description:["Материал изделия: Полностью хирургическая сталь.","","Срок изготовления — до 14 рабочих дней."]},
  {id:10,name:"Тестовый товар",price:1,image:"https://i.pinimg.com/736x/d4/c5/4c/d4c54cd9c489d1e73d9e306545929b70.jpg",category:"Тест",description:["Товар для тестов"]}
];

// ================== КОРЗИНА ==================
function addToCart(p){
  const item = cart.find(x=>x.product.id===p.id);
  if(item) item.count++;
  else cart.push({product:p,count:1});
  updateCartUI();
}

function removeFromCart(p){
  const item = cart.find(x=>x.product.id===p.id);
  if(!item) return;
  item.count--;
  if(item.count<=0) cart = cart.filter(x=>x.product.id!==p.id); // удаляем полностью
  updateCartUI();
}

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

  [...productsEl.children].forEach(card=>{
    const pName = card.querySelector("h3")?.textContent;
    const item = cart.find(x=>x.product.name===pName);
    const controls = card.querySelector(".count-block");
    if(!controls) return;
    controls.innerHTML = "";
    if(item){
      const minus = document.createElement("button"); minus.textContent="–"; minus.onclick=e=>{e.stopPropagation(); removeFromCart(cart.find(x=>x.product.name===pName).product)};
      const count = document.createElement("div"); count.className="count-number"; count.textContent=item.count;
      const plus = document.createElement("button"); plus.textContent="+"; plus.onclick=e=>{e.stopPropagation(); addToCart(cart.find(x=>x.product.name===pName).product)};
      controls.append(minus,count,plus);
    } else {
      const btn = document.createElement("button"); btn.textContent="В корзину"; btn.onclick=e=>{e.stopPropagation(); addToCart(products.find(x=>x.name===pName))};
      btn.classList.add("micro-btn");
      controls.appendChild(btn);
    }
  });
  updateOrderSum();
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
    } else {
      const btn = document.createElement("button"); btn.textContent="В корзину"; btn.onclick=e=>{e.stopPropagation(); addToCart(p)};
      btn.classList.add("micro-btn");
      controls.appendChild(btn);
    }

    card.append(img,title,price,controls);
    productsEl.appendChild(card);
    requestAnimationFrame(()=>{ card.style.opacity="1"; card.style.transform="translateY(0)"; });
  });
  updateCartUI();
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

// ================== ОПЛАТА ==================
orderForm.onsubmit = async (e) => {
  e.preventDefault();
  if (isSubmitting) return;
  if (!cart.length) { alert("Корзина пуста"); return; }
  isSubmitting = true;

  // сообщение с рамкой
  const msgOverlay = document.createElement("div");
  msgOverlay.style.position = "fixed";
  msgOverlay.style.top="0";
  msgOverlay.style.left="0";
  msgOverlay.style.width="100%";
  msgOverlay.style.height="100%";
  msgOverlay.style.background="rgba(0,0,0,0.7)";
  msgOverlay.style.display="flex";
  msgOverlay.style.justifyContent="center";
  msgOverlay.style.alignItems="center";
  msgOverlay.style.zIndex="9999";

  const msgBox = document.createElement("div");
  msgBox.style.background="#333";
  msgBox.style.color="#fff";
  msgBox.style.padding="20px";
  msgBox.style.borderRadius="12px";
  msgBox.style.textAlign="center";
  msgBox.innerHTML = "<b>Переносим вас на страницу оплаты!</b><br>Буквально пару секунд...";
  msgOverlay.appendChild(msgBox);
  document.body.appendChild(msgOverlay);

  try {
    if (window.Telegram?.WebApp) Telegram.WebApp.ready();

    const fd = new FormData(orderForm);
    let deliveryCost = 0;
    switch (fd.get("delivery")) {
      case "СДЭК": deliveryCost = 450; break;
      case "Почта России": deliveryCost = 550; break;
      case "Яндекс.Доставка": deliveryCost = 400; break;
      default: deliveryCost = 0;
    }
    const total = cart.reduce((s, i) => s + i.count * i.product.price, 0) + deliveryCost;
    const orderId = Date.now();

    sendTelegramOrder({
      fullname: fd.get("fullname"),
      phone: fd.get("phone"),
      telegram: fd.get("telegram"),
      delivery: fd.get("delivery"),
      address: fd.get("address"),
      products: cart.map(i => `• ${i.product.name} x${i.count}`).join("\n"),
      total
    });

    const res = await fetch("https://spbbank.ru/pay", {
      method: "POST",
      body: JSON.stringify({ orderId, total })
    });
    const data = await res.json();
    window.location.href = data.pay_url;
  } catch (err) {
    alert("Ошибка при оплате: "+err.message);
  }
};

// ================== ИНИЦИАЛЬНЫЙ РЕНДЕР ==================
renderProducts(products);
