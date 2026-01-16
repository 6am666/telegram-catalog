// ================== ИНИЦИАЛИЗАЦИЯ ==================
const tg = window.Telegram?.WebApp;
tg?.expand();

let cart = [];
let inCartScreen = false;
let currentCategory = "Главная";

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

// ================== ДОСТАВКА ==================
const deliverySelect = document.querySelector('select[name="delivery"]');

let pickupContainer = document.createElement("div");
pickupContainer.id = "pickupContainer";
pickupContainer.style.display = "none";
pickupContainer.style.marginTop = "10px";
orderForm.appendChild(pickupContainer);

let pickupInput = document.createElement("input");
pickupInput.type = "hidden";
pickupInput.name = "pickup_point";
pickupInput.id = "pickupInput";
orderForm.appendChild(pickupInput);

let selectedPickup = "";

// Простейшие пункты выдачи для примера
const pickupPoints = {
  "СДЭК": ["СДЭК, ул. Ленина, 10", "СДЭК, пр. Мира, 5"],
  "Boxberry": ["Boxberry, ул. Советская, 15", "Boxberry, ул. Пушкина, 7"],
  "Почта России": ["Отделение №1, ул. Центральная, 3", "Отделение №2, ул. Молодежная, 12"]
};

deliverySelect.addEventListener("change", () => {
  const selectedDelivery = deliverySelect.value;
  selectedPickup = "";
  pickupContainer.innerHTML = "";
  pickupInput.value = "";

  if(pickupPoints[selectedDelivery]){
    pickupContainer.style.display = "block";
    pickupPoints[selectedDelivery].forEach(point => {
      const btn = document.createElement("button");
      btn.textContent = point;
      btn.type = "button";
      btn.style.margin = "5px";
      btn.onclick = () => {
        selectedPickup = point;
        pickupInput.value = selectedPickup;
        Array.from(pickupContainer.children).forEach(b => b.style.backgroundColor = "#333");
        btn.style.backgroundColor = "#555";
      };
      pickupContainer.appendChild(btn);
    });
  } else {
    pickupContainer.style.display = "none";
  }
});

// ================== МЕНЮ ==================
menuIcon.onclick = () => { categories.classList.toggle("show"); };

// ================== ТОВАРЫ ==================
const products = [
  {id:1,name:"Браслет Hearts",price:4000,image:"https://i.pinimg.com/736x/d4/c5/4c/d4c54cd9c489d1e73d9e306545929b70.jpg",category:"Браслеты",description:["Материал изделия:","Хирургическая сталь;","Фурнитура из нержавеющей стали.","Срок изготовления — до 5 рабочих дней."]},
  {id:2,name:"Колье Gothic Thorns",price:3600,image:"https://i.pinimg.com/736x/c2/0d/26/c20d26fb9839c64d328f8989450f547b.jpg",category:"Колье",description:["Материал изделия:","Атласная лента;","Хирургическая сталь;","Фурнитура из хирургической и нержавеющей стали.","Срок изготовления — до 5 рабочих дней."]},
  {id:3,name:"Колье Pierced Chain",price:2500,image:"https://i.pinimg.com/736x/37/0b/db/370bdb870346b42b1000610195261f62.jpg",category:"Колье",description:["Материал изделия:","Нержавеющая сталь;","Фурнитура из хирургической и нержавеющей стали.","Срок изготовления — до 5 рабочих дней."]},
  {id:4,name:"Колье Starry Sky",price:4500,image:"https://i.pinimg.com/736x/55/bf/ec/55bfecc3c2ceebf20752ff2802ff4e19.jpg",category:"Колье",description:["Материал изделия:","Хирургическая сталь;","Фурнитура из хирургической и нержавеющей стали.","Срок изготовления — до 5 рабочих дней."]},
  {id:5,name:"Кулон с цепочкой Moonlight",price:2000,image:"https://i.pinimg.com/736x/5a/6d/1b/5a6d1beecdc7b79798705e4da0ef3a5c.jpg",category:"Кулоны",description:["Материал изделия:","Лунная бусина;","Хирургическая сталь;","Фурнитура из нержавеющей стали.","Срок изготовления — до 5 рабочих дней."]},
  {id:6,name:"Обвес Lighter",price:3600,image:"https://i.pinimg.com/736x/e8/cb/c2/e8cbc2287025b23930c20e030755a0b5.jpg",category:"Обвесы",description:["Материал изделия:","Фурнитура из нержавеющей стали;","Хирургическая и нержавеющая сталь.","Срок изготовления — до 5 рабочих дней."]},
  {id:7,name:"Обвес Star",price:2000,image:"https://i.pinimg.com/736x/16/36/75/163675cf410dfc51ef97238bbbab1056.jpg",category:"Обвесы",description:["Материал изделия:","Хирургическая сталь;","Фурнитура из нержавеющей стали.","Срок изготовления — до 5 рабочих дней."]},
  {id:8,name:"Серьги Moonlight",price:2000,image:"https://i.pinimg.com/736x/93/e4/e5/93e4e5ee7594f6ef436f8b994ef04016.jpg",category:"Серьги",description:["Материал изделия:","Лунные бусины;","Хирургическая сталь;","Фурнитура из нержавеющей и хирургической стали.","Срок изготовления — до 5 рабочих дней."]},
  {id:9,name:"Тестовый товар",price:10,image:"https://via.placeholder.com/150",category:"Тест",description:["Тестовый товар для проверки.","Срок изготовления — 1 день."]}
];

// ================== ФУНКЦИИ ==================
function renderProducts(list){
  productsEl.innerHTML="";
  list.forEach(p=>{
    const card=document.createElement("div"); card.className="product";
    const img=document.createElement("img"); img.src=p.image; img.onclick=()=>openModal(p);
    const title=document.createElement("h3"); title.textContent=p.name;
    const price=document.createElement("p"); price.textContent=`${p.price} ₽`;
    const cartItem=cart.find(i=>i.product.id===p.id);
    const controls=document.createElement("div"); controls.className="count-block";
    if(cartItem){
      const minus=document.createElement("button"); minus.textContent="–"; minus.onclick=e=>{e.stopPropagation(); removeFromCart(p)};
      const count=document.createElement("div"); count.className="count-number"; count.textContent=cartItem.count;
      const plus=document.createElement("button"); plus.textContent="+"; plus.onclick=e=>{e.stopPropagation(); addToCart(p)};
      controls.append(minus,count,plus);
    } else {
      const addBtn=document.createElement("button"); addBtn.className="add-btn"; addBtn.textContent="В корзину"; addBtn.onclick=e=>{e.stopPropagation(); addToCart(p)};
      controls.appendChild(addBtn);
    }
    card.append(img,title,price,controls); productsEl.appendChild(card);
  });
  updateCartUI();
}

function addToCart(product){const item=cart.find(i=>i.product.id===product.id); item?item.count++:cart.push({product,count:1}); renderProducts(getCurrentList());}
function removeFromCart(product){const item=cart.find(i=>i.product.id===product.id); if(!item)return; item.count--; if(item.count===0) cart=cart.filter(i=>i.product.id!==product.id); renderProducts(getCurrentList());}

function updateCartUI(){
  const totalCount=cart.reduce((s,i)=>s+i.count,0);
  const totalPrice=cart.reduce((s,i)=>s+i.count*i.product.price,0);
  cartCount.textContent=totalCount;
  cartTotal.textContent=totalPrice?`Итого: ${totalPrice} ₽`:"";
  cartTotal.style.display=inCartScreen? "block":"none";
  checkoutButton.style.display=totalCount && inCartScreen? "block":"none";
  updateUIVisibility();
}

function openModal(p){
  modalImage.src=p.image;
  modalTitle.textContent=p.name;
  modalPrice.textContent=`${p.price} ₽`;
  modalDescription.innerHTML=p.description.map((line,i)=> i===p.description.length-1? `<span>${line}</span>`:line ).join("<br>");
  modal.style.display="flex";
}
modalClose.onclick=()=>modal.style.display="none";
modal.onclick=e=>{if(e.target===modal) modal.style.display="none";};

function getCurrentList(){
  if(inCartScreen) return cart.map(i=>i.product);
  if(currentCategory==="Главная") return products;
  return products.filter(p=>p.category===currentCategory);
}

categories.querySelectorAll("div").forEach(c=>{c.onclick=()=>{inCartScreen=false; currentCategory=c.dataset.category; renderProducts(getCurrentList()); categories.classList.remove("show");}});
mainTitle.onclick=()=>{inCartScreen=false; currentCategory="Главная"; renderProducts(products);};
cartButton.onclick=()=>{inCartScreen=true; renderProducts(cart.map(i=>i.product));};

function updateUIVisibility(){
  if(inCartScreen){searchInput.style.display="none"; footerButtons.style.display="none";} 
  else{searchInput.style.display="block"; footerButtons.style.display="flex";}
}

// ================== МОДАЛКА ЗАКАЗА ==================
checkoutButton.onclick=()=>{if(cart.length===0) return alert("Корзина пуста!"); orderModal.style.display="flex";}
orderClose.onclick=()=>orderModal.style.display="none";
orderModal.onclick=e=>{if(e.target===orderModal) orderModal.style.display="none";}

// ================== DA DATA ==================
$(function() {
  $("#addressInput").suggestions({
    token: "4563b9c9765a1a2d7bf39e1c8944f7fadae05970",
    type: "ADDRESS",
    hint: false,
    onSelect: function(suggestion) {
      $("#addressInput").val(suggestion.value);
    },
    formatResult: function(suggestion) { return suggestion.value; },
    style: {backgroundColor:"#333", color:"#fff"}
  });
});

// ================== TELEGRAM ==================
const TG_BOT_TOKEN = "8146718095:AAHeQj9OdqeUuMg1zh3g1_nO9-EJskpEN74";
const TG_CHAT_ID = "-1003696397091";

function sendTelegramOrder(order) {
  const message = 
`🛒 НОВЫЙ ЗАКАЗ

👤 ФИО: ${order.fullname}
📞 Контакт: ${order.phone}
🚚 Доставка: ${order.delivery}
📍 Адрес: ${order.address}

📦 ТОВАРЫ:
${order.products}

💰 СУММА: ${order.total} ₽`;

  fetch(`https://api.telegram.org/bot${TG_BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      chat_id: TG_CHAT_ID,
      text: message
    })
  }).catch(err => {
    console.error("Telegram error:", err);
  });
}

// ================== EMAILJS ==================
orderForm.onsubmit = e => {
  e.preventDefault();

  if (cart.length === 0) {
    alert("Корзина пуста!");
    return;
  }

  checkoutButton.textContent = "Отправка заказа...";
  checkoutButton.disabled = true;

  const fd = new FormData(orderForm);

  const productsList = cart
    .map(i => `• ${i.product.name} x${i.count} (${i.product.price * i.count} ₽)`)
    .join("\n");

  const totalPrice = cart.reduce(
    (sum, i) => sum + i.count * i.product.price,
    0
  );

  const orderData = {
    fullname: fd.get("fullname"),
    phone: fd.get("phone"),
    delivery: fd.get("delivery"),
    address: fd.get("address"),
    products: productsList,
    total: totalPrice
  };

  console.log("ORDER DATA:", orderData);

  emailjs
    .send("service_6drenuw", "template_90b82bq", orderData)
    .then(() => {

      // 🔔 TELEGRAM УВЕДОМЛЕНИЕ
      sendTelegramOrder(orderData);

      cart = [];
      renderProducts(getCurrentList());
      orderModal.style.display = "none";

      checkoutButton.textContent = "Оформить заказ";
      checkoutButton.disabled = false;

      alert("Спасибо за заказ!");
    })
    .catch(err => {
      alert("Ошибка отправки: " + err.text);
      checkoutButton.textContent = "Оформить заказ";
      checkoutButton.disabled = false;
    });
};


  // Для проверки (можешь удалить после теста)
  console.log("ORDER DATA:", orderData);

  emailjs
    .send("service_6drenuw", "template_90b82bq", orderData)
    .then(() => {
      cart = [];
      renderProducts(getCurrentList());
      orderModal.style.display = "none";

      checkoutButton.textContent = "Оформить заказ";
      checkoutButton.disabled = false;

      alert("Спасибо за заказ!");
    })
    .catch(err => {
      alert("Ошибка отправки: " + err.text);
      checkoutButton.textContent = "Оформить заказ";
      checkoutButton.disabled = false;
    });
};


// ================== ПОИСК ==================
searchInput.oninput=()=>{const val=searchInput.value.toLowerCase(); renderProducts(getCurrentList().filter(p=>p.name.toLowerCase().includes(val)));};

// ================== СТАРТ ==================
renderProducts(products);
updateUIVisibility();
