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
const products = [ /* ТВОЙ МАССИВ БЕЗ ИЗМЕНЕНИЙ */ ];

// ================== ПЛАВНЫЙ РЕНДЕР ==================
function smoothRender(list) {
  productsEl.classList.add("products-hide");
  setTimeout(() => {
    renderProducts(list);
    productsEl.classList.remove("products-hide");
    productsEl.classList.add("products-show");
  }, 280);
}

// ================== АНИМАЦИЯ В КОРЗИНУ ==================
function flyToCart(img) {
  const imgRect = img.getBoundingClientRect();
  const cartRect = cartButton.getBoundingClientRect();

  const clone = img.cloneNode(true);
  clone.className = "fly-img";
  clone.style.left = imgRect.left + "px";
  clone.style.top = imgRect.top + "px";
  clone.style.width = imgRect.width + "px";
  clone.style.height = imgRect.height + "px";

  document.body.appendChild(clone);

  requestAnimationFrame(() => {
    clone.style.left = cartRect.left + cartRect.width / 2 + "px";
    clone.style.top = cartRect.top + cartRect.height / 2 + "px";
    clone.style.width = "18px";
    clone.style.height = "18px";
    clone.style.opacity = "0";
  });

  clone.addEventListener("transitionend", () => clone.remove());
}

// ================== КОРЗИНА UI ==================
function updateCartUI(){
  const c = cart.reduce((s,i)=>s+i.count,0);
  const t = cart.reduce((s,i)=>s+i.count*i.product.price,0);
  cartCount.textContent = c;
  cartTotal.textContent = t ? "Итого: " + t + " ₽" : "";
  cartTotal.style.display = inCartScreen ? "block" : "none";
  checkoutButton.style.display = c && inCartScreen ? "block" : "none";
  footerButtons.style.display = inCartScreen ? "none" : "flex";
  searchInput.style.display = inCartScreen ? "none" : "block";
}

// ================== ДОБАВЛЕНИЕ / УДАЛЕНИЕ ==================
function addToCart(p){
  const i = cart.find(x=>x.product.id===p.id);
  i ? i.count++ : cart.push({product:p,count:1});
  smoothRender(getCurrentList());
}

function removeFromCart(p){
  const i = cart.find(x=>x.product.id===p.id);
  if(!i) return;
  i.count--;
  if(i.count===0) cart = cart.filter(x=>x!==i);
  smoothRender(getCurrentList());
}

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
      btn.onclick=e=>{
        e.stopPropagation();
        flyToCart(img);
        addToCart(p);
      };
      controls.appendChild(btn);
    }

    card.append(img,title,price,controls);
    productsEl.appendChild(card);
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
modalClose.onclick=()=>modal.style.display="none";
modal.onclick=e=>{if(e.target===modal)modal.style.display="none"};

// ================== НАВИГАЦИЯ ==================
function getCurrentList(){
  if(inCartScreen) return cart.map(i=>i.product);
  if(currentCategory==="Главная") return products;
  return products.filter(p=>p.category===currentCategory);
}

cartButton.onclick=()=>{
  inCartScreen=true;
  smoothRender(cart.map(i=>i.product));
};

mainTitle.onclick=()=>{
  inCartScreen=false;
  currentCategory="Главная";
  smoothRender(products);
};

categories.querySelectorAll("div").forEach(c=>{
  c.onclick=()=>{
    inCartScreen=false;
    currentCategory=c.dataset.category;
    smoothRender(getCurrentList());
    categories.classList.remove("show");
  };
});

// ================== ПОИСК ==================
searchInput.oninput=()=>{
  if(inCartScreen) return;
  const v=searchInput.value.toLowerCase();
  smoothRender(getCurrentList().filter(p=>p.name.toLowerCase().includes(v)));
};

// ================== СТАРТ ==================
smoothRender(products);
