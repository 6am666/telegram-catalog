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

menuIcon.onclick = () => categories.classList.toggle("show");

const products = [
  {id:1,name:"Браслет Hearts",price:4000,image:"https://i.pinimg.com/736x/d4/c5/4c/d4c54cd9c489d1e73d9e306545929b70.jpg",category:"Браслеты",description:["Хирургическая сталь","Срок изготовления — 5 дней"]},
  {id:2,name:"Колье Gothic Thorns",price:3600,image:"https://i.pinimg.com/736x/c2/0d/26/c20d26fb9839c64d328f8989450f547b.jpg",category:"Колье",description:["Атлас","Хирургическая сталь"]}
];

function renderProducts(list){
  productsEl.innerHTML = "";

  list.forEach(p => {
    const card = document.createElement("div");
    card.className = "product";

    const img = document.createElement("img");
    img.src = p.image;
    img.onclick = () => openModal(p);

    const title = document.createElement("h3");
    title.textContent = p.name;

    const price = document.createElement("p");
    price.textContent = `${p.price} ₽`;

    const btn = document.createElement("button");
    btn.className = "add-btn";
    btn.textContent = "В корзину";
    btn.onclick = () => addToCart(p);

    card.append(img, title, price, btn);
    productsEl.appendChild(card);
  });

  updateCartUI();
  updateUIVisibility();
}

function addToCart(p){
  const item = cart.find(i => i.id === p.id);
  if(item) item.count++;
  else cart.push({...p, count:1});
  updateCartUI();
}

function updateCartUI(){
  cartCount.textContent = cart.reduce((s,i)=>s+i.count,0);
}

function updateUIVisibility(){
  footerButtons.style.display = inCartScreen ? "none" : "flex";
}

function openModal(p){
  modalImage.src = p.image;
  modalTitle.textContent = p.name;
  modalPrice.textContent = `${p.price} ₽`;
  modalDescription.innerHTML = p.description.join("<br>");
  modal.style.display = "flex";
}

modalClose.onclick = () => modal.style.display = "none";
orderClose.onclick = () => orderModal.style.display = "none";

checkoutButton.onclick = () => orderModal.style.display = "flex";

orderForm.onsubmit = e => {
  e.preventDefault();
  alert("Заказ сформирован (отправка будет через бота)");
};

searchInput.oninput = () => {
  const v = searchInput.value.toLowerCase();
  renderProducts(products.filter(p => p.name.toLowerCase().includes(v)));
};

$(function(){
  $("#addressInput").suggestions({
    token: "4563b9c9765a1a2d7bf39e1c8944f7fadae05970",
    type: "ADDRESS",
    hint: false
  });
});

renderProducts(products);
