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
  {id:9,name:"Тестовый товар",price:10,image:"https://via.placeholder.com/150",category:"Тест",description:["Тестовый товар."]}
];

// ================== ФОРМА ==================
orderForm.innerHTML = `
<label>ФИО</label><input name="fullname" required>
<label>Адрес</label><input name="address" id="addressInput" required>
<label>Доставка</label>
<select name="delivery" id="deliverySelect" required>
<option value="" disabled selected>Выберите</option>
<option value="СДЭК">СДЭК — 450₽</option>
<option value="Почта России">Почта России — 550₽</option>
<option value="Самовывоз">Самовывоз</option>
</select>
<label>Телефон</label><input name="phone" required>
<label>Telegram</label><input name="telegram" required>
<div id="orderSum">Итого: 0 ₽</div>
<button type="submit">Оплатить</button>
`;

// ================== СУММА ==================
const deliverySelectEl = document.getElementById("deliverySelect");
const orderSumEl = document.getElementById("orderSum");

function updateOrderSum(){
  let total = cart.reduce((s,i)=>s+i.count*i.product.price,0);
  if(deliverySelectEl.value==="СДЭК") total+=450;
  if(deliverySelectEl.value==="Почта России") total+=550;
  orderSumEl.textContent="Итого: "+total+" ₽";
}
deliverySelectEl.onchange = updateOrderSum;

// ================== ОФОРМЛЕНИЕ + ОПЛАТА ==================
orderForm.onsubmit = e => {
  e.preventDefault();
  if (isSubmitting || !cart.length) return;
  isSubmitting = true;

  const fd = new FormData(orderForm);
  const productsList = cart.map(i=>`• ${i.product.name} x${i.count}`).join("\n");

  let total = cart.reduce((s,i)=>s+i.count*i.product.price,0);
  if(fd.get("delivery")==="СДЭК") total+=450;
  if(fd.get("delivery")==="Почта России") total+=550;

  sendTelegramOrder({
    fullname: fd.get("fullname"),
    phone: fd.get("phone"),
    telegram: fd.get("telegram"),
    delivery: fd.get("delivery"),
    address: fd.get("address"),
    products: productsList,
    total
  });

  Telegram.WebApp.sendData(JSON.stringify({
    type:"invoice",
    payload:{
      title:"Заказ украшений",
      description:productsList,
      amount: total * 100,
      currency:"RUB"
    }
  }));

  isSubmitting = false;
};

// ================== РЕНДЕР ==================
function renderProducts(list){
  productsEl.innerHTML="";
  list.forEach(p=>{
    const card=document.createElement("div");
    card.className="product";

    const item=cart.find(i=>i.product.id===p.id);
    let controls="";

    if(item){
      controls=`
        <div class="count-block">
          <button onclick="removeFromCart(${p.id})">–</button>
          <div class="count-number">${item.count}</div>
          <button onclick="addToCart(${p.id})">+</button>
        </div>`;
    } else {
      controls=`<button onclick="addToCart(${p.id})">В корзину</button>`;
    }

    card.innerHTML=`
      <img src="${p.image}">
      <h3>${p.name}</h3>
      <p>${p.price} ₽</p>
      ${controls}
    `;
    productsEl.appendChild(card);
  });
  updateCartUI();
}

function addToCart(id){
  const p=products.find(x=>x.id===id);
  const i=cart.find(x=>x.product.id===id);
  i?i.count++:cart.push({product:p,count:1});
  renderProducts(getCurrentList());
}

function removeFromCart(id){
  const i=cart.find(x=>x.product.id===id);
  if(!i) return;
  i.count--;
  if(!i.count) cart=cart.filter(x=>x!==i);
  renderProducts(getCurrentList());
}

function getCurrentList(){
  if(inCartScreen) return cart.map(i=>i.product);
  if(currentCategory==="Главная") return products;
  return products.filter(p=>p.category===currentCategory);
}

function updateCartUI(){
  const c=cart.reduce((s,i)=>s+i.count,0);
  const t=cart.reduce((s,i)=>s+i.count*i.product.price,0);
  cartCount.textContent=c;
  cartTotal.textContent=t?"Итого: "+t+" ₽":"";
  checkoutButton.style.display=c&&inCartScreen?"block":"none";
}

// ================== КОРЗИНА ==================
cartButton.onclick=()=>{inCartScreen=true;renderProducts(cart.map(i=>i.product));};
mainTitle.onclick=()=>{inCartScreen=false;renderProducts(products);};

// ================== СТАРТ ==================
renderProducts(products);
updateOrderSum();
