// ================== INIT ==================
let cart = [];
let inCartScreen = false;
let currentCategory = "Главная";

const productsEl = document.getElementById("products");
const cartButton = document.getElementById("cartButton");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");
const checkoutButton = document.getElementById("checkoutButton");
const categories = document.getElementById("categories");
const menuIcon = document.getElementById("menuIcon");
const overlay = document.getElementById("menuOverlay");
const mainTitle = document.getElementById("mainTitle");
const footerButtons = document.getElementById("footerButtons");

// ================== PRODUCTS ==================
const products = [
  {id:1,name:"Браслет Hearts",price:4000,image:"https://i.pinimg.com/736x/d4/c5/4c/d4c54cd9c489d1e73d9e306545929b70.jpg",category:"Браслеты"},
  {id:2,name:"Колье Gothic Thorns",price:3600,image:"https://i.pinimg.com/736x/c2/0d/26/c20d26fb9839c64d328f8989450f547b.jpg",category:"Колье"},
  {id:3,name:"Кулон Moonlight",price:2000,image:"https://i.pinimg.com/736x/5a/6d/1b/5a6d1beecdc7b79798705e4da0ef3a5c.jpg",category:"Кулоны"}
];

// ================== RENDER ==================
function renderProducts(list) {
  productsEl.innerHTML = "";
  list.forEach(p => {
    const card = document.createElement("div");
    card.className = "product";

    const img = document.createElement("img");
    img.src = p.image;

    const title = document.createElement("h3");
    title.textContent = p.name;

    const price = document.createElement("p");
    price.textContent = p.price + " ₽";

    const btn = document.createElement("button");
    btn.textContent = "В корзину";
    btn.onclick = () => addToCart(p);

    card.append(img,title,price,btn);
    productsEl.appendChild(card);
  });
  updateCartUI();
}

// ================== CART ==================
function addToCart(p){
  const item = cart.find(i=>i.product.id===p.id);
  item ? item.count++ : cart.push({product:p,count:1});
  updateCartUI();
}

function updateCartUI(){
  const c = cart.reduce((s,i)=>s+i.count,0);
  const t = cart.reduce((s,i)=>s+i.count*i.product.price,0);
  cartCount.textContent = c;
  cartTotal.textContent = t ? "Итого: " + t + " ₽" : "";
  checkoutButton.style.display = c && inCartScreen ? "block" : "none";
  footerButtons.style.display = inCartScreen ? "none" : "flex";
}

// ================== NAV ==================
cartButton.onclick = () => {
  inCartScreen = true;
  document.body.classList.add("cart-mode");
  renderProducts(cart.map(i=>i.product));
};

mainTitle.onclick = () => {
  inCartScreen = false;
  document.body.classList.remove("cart-mode");
  renderProducts(products);
};

// ================== HAMBURGER ==================
menuIcon.onclick = () => {
  categories.classList.add("show");
  overlay.classList.add("show");
};

overlay.onclick = closeMenu;
function closeMenu(){
  categories.classList.remove("show");
  overlay.classList.remove("show");
}

document.querySelectorAll(".categories div").forEach(el=>{
  el.onclick = ()=>{
    currentCategory = el.dataset.category;
    inCartScreen = false;
    document.body.classList.remove("cart-mode");
    const list = currentCategory==="Главная" ? products : products.filter(p=>p.category===currentCategory);
    renderProducts(list);
    closeMenu();
  };
});

// ================== START ==================
renderProducts(products);
updateCartUI();
