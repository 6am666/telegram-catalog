const tg = window.Telegram.WebApp;
tg.expand();

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

menuIcon.onclick = () => { categories.classList.toggle("show"); };

// ================== ТОВАРЫ ==================
// (оставляем твой массив products без изменений)

// ================== ФУНКЦИИ ==================
function renderProducts(list){
  productsEl.innerHTML="";
  list.forEach(item=>{
    const p = item.product || item;
    const count = item.count || 0;
    const card = document.createElement("div");
    card.className="product";

    const img = document.createElement("img");
    img.src = p.image;
    img.onclick = () => openModal(p);

    const title = document.createElement("h3");
    title.textContent = p.name;

    const price = document.createElement("p");
    price.textContent = `${p.price} ₽`;

    const controls = document.createElement("div");
    controls.className="count-block";

    if(count > 0){
      const minus = document.createElement("button");
      minus.textContent = "–";
      minus.onclick = e => { e.stopPropagation(); removeFromCart(p); };

      const num = document.createElement("div");
      num.className = "count-number";
      num.textContent = count;

      const plus = document.createElement("button");
      plus.textContent = "+";
      plus.onclick = e => { e.stopPropagation(); addToCart(p); };

      controls.append(minus,num,plus);
    } else {
      const btn = document.createElement("button");
      btn.className = "add-btn";
      btn.textContent = "В корзину";
      btn.onclick = e => { e.stopPropagation(); addToCart(p); };
      controls.appendChild(btn);
    }

    card.append(img,title,price,controls);
    productsEl.appendChild(card);
  });
  updateCartUI();
}

function addToCart(product){
  const item = cart.find(i=>i.product?.id===product.id || i.id===product.id);
  if(item){ item.count = (item.count||0)+1; }
  else{ cart.push({product, count:1}); }
  renderProducts(getCurrentList());
}

function removeFromCart(product){
  const item = cart.find(i=>i.product?.id===product.id || i.id===product.id);
  if(!item) return;
  item.count--;
  if(item.count===0) cart = cart.filter(i=>i!==item);
  renderProducts(getCurrentList());
}

function updateCartUI(){
  const totalCount = cart.reduce((s,i)=>s+i.count,0);
  const totalPrice = cart.reduce((s,i)=>s+i.count*(i.product?.price || i.price),0);
  cartCount.textContent = totalCount;
  cartTotal.textContent = totalPrice? `Итого: ${totalPrice} ₽` : "";
  cartTotal.style.display = inCartScreen? "block":"none";
  checkoutButton.style.display = totalCount && inCartScreen? "block":"none";
  updateUIVisibility();
}

function openModal(p){
  modalImage.src = p.image;
  modalTitle.textContent = p.name;
  modalPrice.textContent = `${p.price} ₽`;
  modalDescription.innerHTML = p.description.map((line,i)=> i===p.description.length-1? `<span>${line}</span>`:line ).join("<br>");
  modal.style.display = "flex";
}
modalClose.onclick = () => modal.style.display="none";
modal.onclick = e => { if(e.target===modal) modal.style.display="none"; };

function getCurrentList(){
  if(inCartScreen) return cart;
  if(currentCategory==="Главная") return products;
  return products.filter(p=>p.category===currentCategory);
}

categories.querySelectorAll("div").forEach(c=>{
  c.onclick=()=>{
    inCartScreen=false;
    currentCategory=c.dataset.category;
    renderProducts(getCurrentList());
    categories.classList.remove("show");
  }
});
mainTitle.onclick=()=>{inCartScreen=false; currentCategory="Главная"; renderProducts(products);};
cartButton.onclick=()=>{inCartScreen=true; renderProducts(cart);};

function updateUIVisibility(){
  if(inCartScreen){searchInput.style.display="none"; footerButtons.style.display="none";}
  else{searchInput.style.display="block"; footerButtons.style.display="flex";}
}

// ================== МОДАЛКА ЗАКАЗА ==================
checkoutButton.onclick=()=>{if(cart.length===0) return alert("Корзина пуста!"); orderModal.style.display="flex";}
orderClose.onclick=()=>orderModal.style.display="none";
orderModal.onclick=e=>{if(e.target===orderModal) orderModal.style.display="none";}

// ================== ОТПРАВКА ЗАКАЗА В GOOGLE SHEET ==================
const SHEETDB_API = "https://sheetdb.io/api/v1/1vejwdm4odk54";

orderForm.onsubmit = e => {
  e.preventDefault();
  if(cart.length===0) return alert("Корзина пуста!");

  checkoutButton.textContent = "Переходим на оплату..."; // текст плашки

  const fd = new FormData(orderForm);
  const order = {
    "ФИО": fd.get("fullname"),
    "Адрес": fd.get("address"),
    "Доставка": fd.get("delivery"),
    "телефон или ник в Telegram": fd.get("phone"),
    "товар": cart.map(i=> `${i.product?.name} x${i.count}`).join("; "),
    "цена": cart.reduce((s,i)=>s+i.count*(i.product?.price || i.price),0)
  };

  // POST в таблицу SheetDB
  fetch(SHEETDB_API, {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({data: order})
  })
  .then(res => res.json())
  .then(() => {
    cart = [];
    renderProducts(getCurrentList());
    orderModal.style.display="none";
    window.location.href = "payment.html"; // редирект на оплату
  })
  .catch(err => {
    alert("Ошибка отправки: " + err);
    checkoutButton.textContent = "Оформить заказ"; // вернуть текст кнопки при ошибке
  });
};

// ================== ПОИСК ==================
searchInput.oninput=()=>{const val=searchInput.value.toLowerCase(); renderProducts(getCurrentList().filter(p=>(p.product?.name || p.name).toLowerCase().includes(val)));};

// ================== DaData ==================
$(function() {
  $("#addressInput").suggestions({
    token: "4563b9c9765a1a2d7bf39e1c8944f7fadae05970",
    type: "ADDRESS",
    hint: false,
    onSelect: function(suggestion) { $("#addressInput").val(suggestion.value); },
    formatResult: function(suggestion) { return suggestion.value; },
    style: {backgroundColor:"#333", color:"#fff"}
  });
});

// ================== СТАРТ ==================
renderProducts(products);
updateUIVisibility();
