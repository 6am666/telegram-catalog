const tg = window.Telegram.WebApp;
tg.expand();

/* ================= СОСТОЯНИЕ ================= */
let cart = [];
let inCartScreen = false;
let currentList = [];
let currentModalProduct = null;

/* ================= ЭЛЕМЕНТЫ ================= */
const productsEl = document.getElementById("products");
const searchInput = document.getElementById("searchInput");
const cartButton = document.getElementById("cartButton");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");
const checkoutButton = document.getElementById("checkoutButton");
const mainTitle = document.getElementById("mainTitle");
const menuIcon = document.getElementById("menuIcon");
const categories = document.getElementById("categories");
const footerButtons = document.getElementById("footerButtons");

const modal = document.getElementById("modal");
const modalImage = document.getElementById("modalImage");
const modalTitle = document.getElementById("modalTitle");
const modalPrice = document.getElementById("modalPrice");
const modalClose = document.getElementById("modalClose");

/* ================= ТОВАРЫ ================= */
const products = [
  {
    id:1,
    name:"Колье Pierced Chain",
    price:2500,
    image:"https://i.pinimg.com/736x/37/0b/db/370bdb870346b42b1000610195261f62.jpg",
    category:"Колье",
    description:`Материал изделия:
Нержавеющая сталь;
Фурнитура из хирургической и нержавеющей стали.

Срок изготовления — до 5 рабочих дней.`
  },
  {
    id:2,
    name:"Колье Starry Sky",
    price:4500,
    image:"https://i.pinimg.com/736x/55/bf/ec/55bfecc3c2ceebf20752ff2802ff4e19.jpg",
    category:"Колье",
    description:`Материал изделия:
Хирургическая сталь;
Фурнитура из хирургической и нержавеющей стали.

Срок изготовления — до 5 рабочих дней.`
  },
  {
    id:3,
    name:"Колье Gothic Thorns",
    price:3600,
    image:"https://i.pinimg.com/736x/c2/0d/26/c20d26fb9839c64d328f8989450f547b.jpg",
    category:"Колье",
    description:`Материал изделия:
Атласная лента;
Хирургическая сталь;
Фурнитура из хирургической и нержавеющей стали.

Срок изготовления — до 5 рабочих дней.`
  },
  {
    id:4,
    name:"Браслет Hearts",
    price:4000,
    image:"https://i.pinimg.com/736x/d4/c5/4c/d4c54cd9c489d1e73d9e306545929b70.jpg",
    category:"Браслеты",
    description:`Материал изделия:
Хирургическая сталь;
Фурнитура из нержавеющей стали.

Срок изготовления — до 5 рабочих дней.`
  }
];

/* ================= РЕНДЕР ================= */
function renderProducts(list){
  currentList = list;
  productsEl.innerHTML = "";

  searchInput.style.display = inCartScreen ? "none" : "block";
  cartTotal.style.display = inCartScreen ? "block" : "none";
  checkoutButton.style.display = inCartScreen && cart.length ? "block" : "none";
  footerButtons.style.display = inCartScreen ? "none" : "flex";

  list.forEach(p=>{
    const card = document.createElement("div");
    card.className = "product";

    // КЛИК НА ВСЮ КАРТОЧКУ
    card.addEventListener("click",()=>openModal(p));

    const img = document.createElement("img");
    img.src = p.image;
    img.alt = p.name;

    const title = document.createElement("h3");
    title.textContent = p.name;

    const price = document.createElement("p");
    price.textContent = `${p.price} ₽`;

    card.append(img,title,price);

    const cartItem = cart.find(i=>i.product.id===p.id);

    if(cartItem){
      const block = document.createElement("div");
      block.className = "count-block";

      const minus = document.createElement("button");
      minus.textContent = "−";
      minus.onclick = e=>{
        e.stopPropagation();
        removeFromCart(p);
      };

      const count = document.createElement("div");
      count.className = "count-number";
      count.textContent = cartItem.count;

      const plus = document.createElement("button");
      plus.textContent = "+";
      plus.onclick = e=>{
        e.stopPropagation();
        addToCart(p);
      };

      block.append(minus,count,plus);
      card.appendChild(block);
    } else {
      const btn = document.createElement("button");
      btn.className = "add-btn";
      btn.textContent = "В корзину";
      btn.onclick = e=>{
        e.stopPropagation();
        addToCart(p);
      };
      card.appendChild(btn);
    }

    productsEl.appendChild(card);
  });

  updateCartCount();
  updateCartTotal();
}

/* ================= КОРЗИНА ================= */
function addToCart(product){
  const item = cart.find(i=>i.product.id===product.id);
  if(item) item.count++;
  else cart.push({product,count:1});
  renderProducts(inCartScreen ? cart.map(i=>i.product) : currentList);
}

function removeFromCart(product){
  const item = cart.find(i=>i.product.id===product.id);
  if(!item) return;
  item.count--;
  if(item.count===0) cart = cart.filter(i=>i.product.id!==product.id);
  renderProducts(inCartScreen ? cart.map(i=>i.product) : currentList);
}

function updateCartCount(){
  cartCount.textContent = cart.reduce((s,i)=>s+i.count,0);
}

function updateCartTotal(){
  cartTotal.textContent =
    "Итог: " + cart.reduce((s,i)=>s+i.product.price*i.count,0) + " ₽";
}

/* ================= МОДАЛКА ================= */
function openModal(p){
  modalImage.src = p.image;
  modalTitle.textContent = p.name;
  modalPrice.textContent = `${p.price} ₽`;

  let desc = modal.querySelector(".modal-description");
  if(!desc){
    desc = document.createElement("div");
    desc.className = "modal-description";
    modal.querySelector(".modal-content").appendChild(desc);
  }
  desc.textContent = p.description;

  modal.style.display = "flex";
}

modalClose.onclick = ()=>modal.style.display="none";
modal.onclick = e=>{ if(e.target===modal) modal.style.display="none"; };

/* ================= НАВИГАЦИЯ ================= */
cartButton.onclick = ()=>{
  inCartScreen = true;
  renderProducts(cart.map(i=>i.product));
};

mainTitle.onclick = ()=>{
  inCartScreen = false;
  renderProducts(products);
};

menuIcon.onclick = ()=>categories.classList.toggle("show");

categories.querySelectorAll("div").forEach(cat=>{
  cat.onclick = ()=>{
    inCartScreen = false;
    const list =
      cat.dataset.category==="Главная"
        ? products
        : products.filter(p=>p.category===cat.dataset.category);
    renderProducts(list);
    categories.classList.remove("show");
  };
});

/* ================= INIT ================= */
renderProducts(products);
