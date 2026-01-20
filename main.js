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
const pageWrapper = document.querySelector(".page-wrapper"); // обертка для анимации

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
  {id:8,name:"Серьги Moonlight",price:2000,image:"https://i.pinimg.com/736x/93/e4/e5/93e4e5ee7594f6ef436f8b994ef04016.jpg",category:"Серьги",description:["Материал изделия:","Лунные бусины;","Хирургическая сталь;","Фурнитура из нержавеющей и хирургической стали.","","Срок изготовления — до 5 рабочих дней."]}
];

// ================== ФУНКЦИИ КОРЗИНЫ ==================
function addToCart(p){
  const item = cart.find(i => i.product.id === p.id);
  if(item) item.count++; else cart.push({product:p,count:1});
  renderProducts(getCurrentList());
}
function removeFromCart(p){
  const item = cart.find(i => i.product.id === p.id);
  if(!item) return;
  item.count--;
  if(item.count===0) cart = cart.filter(x=>x!==item);
  renderProducts(getCurrentList());
}
function getCurrentList(){
  if(inCartScreen) return cart.map(i=>i.product);
  if(currentCategory==="Главная") return products;
  return products.filter(p=>p.category===currentCategory);
}

// ================== РЕНДЕР ТОВАРОВ ==================
function renderProducts(list){
  productsEl.innerHTML="";
  list.forEach(p=>{
    const card = document.createElement("div");
    card.className="product";

    const img = document.createElement("img");
    img.src = p.image;
    img.onclick = ()=>openModal(p);

    const title = document.createElement("h3");
    title.textContent = p.name;

    const price = document.createElement("p");
    price.textContent = p.price+" ₽";

    const controls = document.createElement("div");
    controls.className="count-block";
    const item = cart.find(i=>i.product.id===p.id);

    if(item){
      const minus = document.createElement("button");
      minus.textContent="–";
      minus.onclick=e=>{e.stopPropagation(); removeFromCart(p);};
      const count = document.createElement("div");
      count.className="count-number";
      count.textContent=item.count;
      const plus = document.createElement("button");
      plus.textContent="+";
      plus.onclick=e=>{e.stopPropagation(); addToCart(p);};
      controls.append(minus,count,plus);
    }else{
      const btn = document.createElement("button");
      btn.textContent="В корзину";
      btn.onclick=e=>{e.stopPropagation(); addToCart(p);};
      controls.appendChild(btn);
    }

    card.append(img,title,price,controls);
    productsEl.appendChild(card);
  });
  updateCartUI();
}

// ================== МОДАЛКА ==================
function openModal(p){
  modalImage.src = p.image;
  modalTitle.textContent = p.name;
  modalPrice.textContent = p.price+" ₽";
  modalDescription.innerHTML = p.description.join("<br>");
  modal.style.display="flex";
}
modalClose.onclick = ()=>modal.style.display="none";
modal.onclick = e=>{if(e.target===modal) modal.style.display="none";}

// ================== ОБНОВЛЕНИЕ КОРЗИНЫ ==================
function updateCartUI(){
  const c = cart.reduce((s,i)=>s+i.count,0);
  const t = cart.reduce((s,i)=>s+i.count*i.product.price,0);
  cartCount.textContent = c;
  cartTotal.textContent = t?"Итого: "+t+" ₽":"";
  cartTotal.style.display = inCartScreen?"block":"none";
  checkoutButton.style.display = (c && inCartScreen)?"block":"none";
  footerButtons.style.display = inCartScreen?"none":"flex";
  searchInput.style.display = inCartScreen?"none":"block";
  updateOrderSum();
}

// ================== ПЕРЕХОД В КОРЗИНУ ==================
cartButton.onclick = ()=>{
  inCartScreen = true;
  document.body.classList.add("cart-mode");
  pageWrapper.style.transform = "translateX(-100vw)";
  renderProducts(cart.map(i=>i.product));
};
mainTitle.onclick = ()=>{
  inCartScreen = false;
  document.body.classList.remove("cart-mode");
  currentCategory="Главная";
  pageWrapper.style.transform = "translateX(0)";
  renderProducts(products);
};

// ================== ГАМБУРГЕР ==================
menuIcon.onclick = ()=>{
  categories.classList.toggle("show");
};

// ================== ПЕРЕХОД ПО ВКЛАДКАМ ГАМБУРГЕРА ==================
categories.querySelectorAll("div").forEach(cat=>{
  cat.onclick = ()=>{
    currentCategory = cat.textContent;
    inCartScreen = false;
    pageWrapper.style.transform = "translateX(0)";
    categories.classList.remove("show");
    renderProducts(getCurrentList());
  };
});

// ================== ПОИСК ==================
searchInput.oninput = ()=>{
  const val = searchInput.value.toLowerCase();
  renderProducts(getCurrentList().filter(p=>p.name.toLowerCase().includes(val)));
};

// ================== СТАРТ ==================
renderProducts(products);
updateCartUI();
updateOrderSum();
