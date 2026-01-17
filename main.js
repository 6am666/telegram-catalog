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
"[https://api.telegram.org/bot](https://api.telegram.org/bot)" + TG_BOT_TOKEN +
"/sendMessage?chat_id=" + encodeURIComponent(chat_id) +
"&text=" + encodeURIComponent(text)
).catch(()=>{});
});
}

// ================== ТОВАРЫ ==================
const products = [
{id:1,name:"Браслет Hearts",price:4000,image:"[https://i.pinimg.com/736x/d4/c5/4c/d4c54cd9c489d1e73d9e306545929b70.jpg",category:"Браслеты",description:["Материал](https://i.pinimg.com/736x/d4/c5/4c/d4c54cd9c489d1e73d9e306545929b70.jpg%22,category:%22Браслеты%22,description:[%22Материал) изделия:","Хирургическая сталь;","Фурнитура из нержавеющей стали.","","Срок изготовления — до 5 рабочих дней."]},
{id:2,name:"Колье Gothic Thorns",price:3600,image:"[https://i.pinimg.com/736x/c2/0d/26/c20d26fb9839c64d328f8989450f547b.jpg",category:"Колье",description:["Материал](https://i.pinimg.com/736x/c2/0d/26/c20d26fb9839c64d328f8989450f547b.jpg%22,category:%22Колье%22,description:[%22Материал) изделия:","Атласная лента;","Хирургическая сталь;","Фурнитура из хирургической и нержавеющей стали.","","Срок изготовления — до 5 рабочих дней."]},
{id:3,name:"Колье Pierced Chain",price:2500,image:"[https://i.pinimg.com/736x/37/0b/db/370bdb870346b42b1000610195261f62.jpg",category:"Колье",description:["Материал](https://i.pinimg.com/736x/37/0b/db/370bdb870346b42b1000610195261f62.jpg%22,category:%22Колье%22,description:[%22Материал) изделия:","Нержавеющая сталь;","Фурнитура из хирургической и нержавеющей стали.","","Срок изготовления — до 5 рабочих дней."]},
{id:4,name:"Колье Starry Sky",price:4500,image:"[https://i.pinimg.com/736x/55/bf/ec/55bfecc3c2ceebf20752ff2802ff4e19.jpg",category:"Колье",description:["Материал](https://i.pinimg.com/736x/55/bf/ec/55bfecc3c2ceebf20752ff2802ff4e19.jpg%22,category:%22Колье%22,description:[%22Материал) изделия:","Хирургическая сталь;","Фурнитура из хирургической и нержавеющей стали.","","Срок изготовления — до 5 рабочих дней."]},
{id:5,name:"Кулон Moonlight",price:2000,image:"[https://i.pinimg.com/736x/5a/6d/1b/5a6d1beecdc7b79798705e4da0ef3a5c.jpg",category:"Кулоны",description:["Материал](https://i.pinimg.com/736x/5a/6d/1b/5a6d1beecdc7b79798705e4da0ef3a5c.jpg%22,category:%22Кулоны%22,description:[%22Материал) изделия:","Лунная бусина;","Хирургическая сталь;","Фурнитура из нержавеющей стали.","","Срок изготовления — до 5 рабочих дней."]},
{id:6,name:"Обвес Lighter",price:3600,image:"[https://i.pinimg.com/736x/e8/cb/c2/e8cbc2287025b23930c20e030755a0b5.jpg",category:"Обвесы",description:["Материал](https://i.pinimg.com/736x/e8/cb/c2/e8cbc2287025b23930c20e030755a0b5.jpg%22,category:%22Обвесы%22,description:[%22Материал) изделия:","Фурнитура из нержавеющей стали;","Хирургическая и нержавеющая сталь.","","Срок изготовления — до 5 рабочих дней."]},
{id:7,name:"Обвес Star",price:2000,image:"[https://i.pinimg.com/736x/16/36/75/163675cf410dfc51ef97238bbbab1056.jpg",category:"Обвесы",description:["Материал](https://i.pinimg.com/736x/16/36/75/163675cf410dfc51ef97238bbbab1056.jpg%22,category:%22Обвесы%22,description:[%22Материал) изделия:","Хирургическая сталь;","Фурнитура из нержавеющей стали.","","Срок изготовления — до 5 рабочих дней."]},
{id:8,name:"Серьги Moonlight",price:2000,image:"[https://i.pinimg.com/736x/93/e4/e5/93e4e5ee7594f6ef436f8b994ef04016.jpg",category:"Серьги",description:["Материал](https://i.pinimg.com/736x/93/e4/e5/93e4e5ee7594f6ef436f8b994ef04016.jpg%22,category:%22Серьги%22,description:[%22Материал) изделия:","Лунные бусины;","Хирургическая сталь;","Фурнитура из нержавеющей и хирургической стали.","","Срок изготовления — до 5 рабочих дней."]},
{id:9,name:"Тестовый товар",price:10,image:"[https://via.placeholder.com/150",category:"Тест",description:["Тестовый](https://via.placeholder.com/150%22,category:%22Тест%22,description:[%22Тестовый) товар для проверки."]}
];

// ================== ФОРМА ОФОРМЛЕНИЯ ==================
orderForm.innerHTML = ` <label>ФИО</label> <input type="text" name="fullname" required>

<label>Адрес</label> <input type="text" name="address" id="addressInput" required>

<label>Доставка</label> <select name="delivery" id="deliverySelect" required>

<option disabled selected>Выберите способ доставки</option>
<option value="СДЭК">СДЭК — 450₽</option>
<option value="Почта России">Почта России — 550₽</option>
<option value="Яндекс.Доставка">Яндекс.Доставка — 400₽</option>
<option value="Самовывоз">Самовывоз</option>
</select>

<label>Телефон</label> <input type="text" name="phone" required>

<label>Telegram</label> <input type="text" name="telegram" required>

<div id="orderSum">Итоговая сумма: 0 ₽</div>
<button type="submit">Оплатить</button>
`;

// ================== РАССЧЁТ ==================
const deliverySelectEl = document.getElementById("deliverySelect");
const orderSumEl = document.getElementById("orderSum");

function updateOrderSum(){
let total = cart.reduce((s,i)=>s+i.count*i.product.price,0);
let d = deliverySelectEl.value==="СДЭК"?450:
deliverySelectEl.value==="Почта России"?550:
deliverySelectEl.value==="Яндекс.Доставка"?400:0;
orderSumEl.textContent = "Итоговая сумма: " + (total+d) + " ₽";
}
deliverySelectEl.onchange = updateOrderSum;

// ================== СПАСИБО ==================
if(location.search.includes("success")){
const div=document.createElement("div");
div.style.cssText="position:fixed;top:20px;left:50%;transform:translateX(-50%);background:#333;color:#fff;padding:16px 24px;border-radius:12px;z-index:9999";
div.innerHTML="Спасибо за то что выбрали наш магазин Chronicle-Chains!<br>Мы уже собираем ваш заказ ❤️";
document.body.appendChild(div);
setTimeout(()=>div.remove(),8000);
}

// ================== ОПЛАТА ==================
orderForm.onsubmit = async e=>{
e.preventDefault();
if(isSubmitting || !cart.length) return;
isSubmitting=true;

const fd=new FormData(orderForm);
const delivery=fd.get("delivery");
const deliveryCost=delivery==="СДЭК"?450:delivery==="Почта России"?550:delivery==="Яндекс.Доставка"?400:0;
const total=cart.reduce((s,i)=>s+i.count*i.product.price,0)+deliveryCost;

const data={
fullname:fd.get("fullname"),
phone:fd.get("phone"),
telegram:fd.get("telegram"),
delivery,
address:fd.get("address"),
products:cart.map(i=>i.product.name+" x"+i.count).join("\n"),
total
};

try{
sendTelegramOrder(data);

```
const res=await fetch("/api/create-payment",{
  method:"POST",
  headers:{"Content-Type":"application/json"},
  body:JSON.stringify({
    amount:total,
    order_id:Date.now(),
    return_url:location.origin+"?success=true"
  })
});

const json=await res.json();
if(json.payment_url) location.href=json.payment_url;
else alert("Ошибка оплаты");
```

}catch(e){ alert("Ошибка"); }
finally{ isSubmitting=false; }
};

// ================== РЕНДЕР ==================
function renderProducts(list){
productsEl.innerHTML="";
list.forEach(p=>{
const d=document.createElement("div");
d.className="product";
d.innerHTML=`<h3>${p.name}</h3><p>${p.price} ₽</p>`;
d.onclick=()=>addToCart(p);
productsEl.appendChild(d);
});
}

function addToCart(p){
const i=cart.find(x=>x.product.id===p.id);
i?i.count++:cart.push({product:p,count:1});
updateOrderSum();
}

renderProducts(products);
updateOrderSum();
