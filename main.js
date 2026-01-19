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

// ================== ТОВАРЫ ==================
const products = [
  {id:1,name:"Браслет Hearts",price:4000,image:"https://i.pinimg.com/736x/d4/c5/4c/d4c54cd9c489d1e73d9e306545929b70.jpg",category:"Браслеты",description:["Материал: Хирургическая сталь","Срок изготовления — до 5 рабочих дней"]},
  {id:2,name:"Колье Gothic Thorns",price:3600,image:"https://i.pinimg.com/736x/c2/0d/26/c20d26fb9839c64d328f8989450f547b.jpg",category:"Колье",description:["Материал: Атласная лента, сталь","Срок изготовления — до 5 рабочих дней"]},
  {id:3,name:"Колье Pierced Chain",price:2500,image:"https://i.pinimg.com/736x/37/0b/db/370bdb870346b42b1000610195261f62.jpg",category:"Колье",description:["Материал: Нержавеющая сталь","Срок изготовления — до 5 рабочих дней"]}
];

// ================== ФОРМА ==================
orderForm.innerHTML = `
<label>ФИО</label><input type="text" name="fullname" placeholder="Введите ФИО" required>
<label>Адрес</label><input type="text" name="address" id="addressInput" placeholder="Город, улица, дом, индекс" required>
<label>Доставка</label>
<select name="delivery" id="deliverySelect" required>
  <option value="" disabled selected>Выберите способ доставки</option>
  <option value="СДЭК">СДЭК — 450₽</option>
  <option value="Почта России">Почта России — 550₽</option>
  <option value="Яндекс.Доставка">Яндекс.Доставка — 400₽</option>
  <option value="Самовывоз">Самовывоз</option>
</select>
<div id="deliveryInfo" style="color:#aaa;margin-top:4px;"></div>
<label>Телефон</label><input type="text" name="phone" placeholder="Введите номер" required>
<label>Telegram ID</label><input type="text" name="telegram" placeholder="@id" required>
<div id="orderSum" style="color:#aaa;margin:10px 0;font-weight:500;">Итоговая сумма: 0 ₽</div>
<button type="submit">Оплатить</button>
`;

// ================== РАСЧЁТ СУММЫ ==================
const deliverySelectEl = document.getElementById("deliverySelect");
const deliveryInfoEl = document.getElementById("deliveryInfo");
const orderSumEl = document.getElementById("orderSum");

function updateOrderSum() {
  let total = cart.reduce((s,i)=>s+i.count*i.product.price,0);
  let deliveryCost = 0;
  switch(deliverySelectEl.value){
    case "СДЭК": deliveryCost=450; break;
    case "Почта России": deliveryCost=550; break;
    case "Яндекс.Доставка": deliveryCost=400; break;
    default: deliveryCost=0;
  }
  orderSumEl.textContent="Итоговая сумма: "+(total+deliveryCost)+" ₽";
  deliveryInfoEl.textContent=deliverySelectEl.value==="Самовывоз"?"Самовывоз — Санкт-Петербург, Русановская 18к8":"";
}
deliverySelectEl.addEventListener("change", updateOrderSum);

// ================== КНОПКА ОФОРМИТЬ ЗАКАЗ ==================
checkoutButton.onclick = ()=> {
  if(!cart.length) return alert("Корзина пуста!");
  orderModal.style.display="flex";
  updateOrderSum();
};

// ================== ЗАКРЫТИЕ МОДАЛКИ ==================
orderClose.onclick=()=>orderModal.style.display="none";
orderModal.onclick=e=>{if(e.target===orderModal) orderModal.style.display="none";};

// ================== ОФОРМЛЕНИЕ ЗАКАЗА ==================
orderForm.onsubmit = e=>{
  e.preventDefault();
  if(isSubmitting) return;
  if(!cart.length) return alert("Корзина пуста!");
  isSubmitting=true;

  const fd = new FormData(orderForm);
  let deliveryCost=0;
  switch(fd.get("delivery")){
    case "СДЭК": deliveryCost=450; break;
    case "Почта России": deliveryCost=550; break;
    case "Яндекс.Доставка": deliveryCost=400; break;
    default: deliveryCost=0;
  }

  const total = cart.reduce((s,i)=>s+i.count*i.product.price,0)+deliveryCost;

  const orderData = {
    fullname: fd.get("fullname"),
    phone: fd.get("phone"),
    telegram: fd.get("telegram"),
    delivery: fd.get("delivery"),
    address: fd.get("address"),
    products: cart.map(i=>({name:i.product.name, price:i.product.price, count:i.count})),
    total
  };

  localStorage.setItem("orderData", JSON.stringify(orderData));

  // Мини App редирект на checkout
  window.location.href = "checkout.html";

  isSubmitting=false;
};

// ================== РЕНДЕР ==================
function renderProducts(list){
  productsEl.innerHTML="";
  list.forEach(p=>{
    const card=document.createElement("div"); card.className="product";
    const img=document.createElement("img"); img.src=p.image;
    const title=document.createElement("h3"); title.textContent=p.name;
    const price=document.createElement("p"); price.textContent=p.price+" ₽";

    const controls=document.createElement("div"); controls.className="count-block";
    const item = cart.find(i=>i.product.id===p.id);
    if(item){
      const minus=document.createElement("button"); minus.textContent="–"; minus.onclick=e=>{e.stopPropagation(); item.count--; if(item.count===0) cart=cart.filter(x=>x!==item); renderProducts(list); };
      const count=document.createElement("div"); count.className="count-number"; count.textContent=item.count;
      const plus=document.createElement("button"); plus.textContent="+"; plus.onclick=e=>{e.stopPropagation(); item.count++; renderProducts(list); };
      controls.append(minus,count,plus);
    } else{
      const btn=document.createElement("button"); btn.textContent="В корзину"; btn.onclick=e=>{e.stopPropagation(); cart.push({product:p,count:1}); renderProducts(list); };
      controls.appendChild(btn);
    }
    card.append(img,title,price,controls);
    productsEl.appendChild(card);
  });
  updateCartUI();
}

function updateCartUI(){
  const c=cart.reduce((s,i)=>s+i.count,0);
  const t=cart.reduce((s,i)=>s+i.count*i.product.price,0);
  cartCount.textContent=c;
  cartTotal.textContent=t?"Итого: "+t+" ₽":"";
  cartTotal.style.display=inCartScreen?"block":"none";
  footerButtons.style.display=inCartScreen?"none":"flex";
  searchInput.style.display=inCartScreen?"none":"block";
  updateOrderSum();
}

// ================== СТАРТ ==================
renderProducts(products);
updateCartUI();
