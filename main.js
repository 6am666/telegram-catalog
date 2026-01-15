const tg = window.Telegram.WebApp;
tg.expand();

const productsEl = document.getElementById("products");
const searchInput = document.getElementById("searchInput");
const cartButton = document.getElementById("cartButton");
const cartCount = document.getElementById("cartCount");
const orderButton = document.getElementById("orderButton");
const mainTitle = document.getElementById("mainTitle");
const menuIcon = document.getElementById("menuIcon");
const categories = document.getElementById("categories");

let inCart = false;
let currentCategory = "Главная";
let cart = {}; // {id: {product, qty}}

const products = [
  {id:1,name:"Колье Pierced Chain",price:2500,image:"https://i.pinimg.com/736x/37/0b/db/370bdb870346b42b1000610195261f62.jpg",category:"Колье"},
  {id:2,name:"Колье Starry Sky",price:4500,image:"https://i.pinimg.com/736x/55/bf/ec/55bfecc3c2ceebf20752ff2802ff4e19.jpg",category:"Колье"},
  {id:3,name:"Колье Gothic Thorns",price:3600,image:"https://i.pinimg.com/736x/c2/0d/26/c20d26fb9839c64d328f8989450f547b.jpg",category:"Колье"},
  {id:4,name:"Браслет Hearts",price:4000,image:"https://i.pinimg.com/736x/d4/c5/4c/d4c54cd9c489d1e73d9e306545929b70.jpg",category:"Браслеты"},
  {id:5,name:"Обвес Lighter",price:3600,image:"https://i.pinimg.com/736x/e8/cb/c2/e8cbc2287025b23930c20e030755a0b5.jpg",category:"Обвесы"},
];

function render() {
  productsEl.innerHTML = "";

  if (inCart) {
    searchInput.style.display = "none";
    cartButton.style.display = "none";
    orderButton.style.display = "block";
    renderCart();
    return;
  }

  searchInput.style.display = "block";
  cartButton.style.display = "flex";
  orderButton.style.display = "none";

  let list = products;
  if (currentCategory !== "Главная") {
    list = products.filter(p => p.category === currentCategory);
  }

  const q = searchInput.value.toLowerCase();
  list = list.filter(p => p.name.toLowerCase().includes(q));

  list.forEach(p => {
    const card = document.createElement("div");
    card.className = "product";

    const qty = cart[p.id]?.qty || 0;

    card.innerHTML = `
      <img src="${p.image}">
      <h3>${p.name}</h3>
      <p>${p.price} ₽</p>
      ${
        qty === 0
          ? `<button class="add-btn">В корзину</button>`
          : `
            <div class="counter">
              <button class="minus">−</button>
              <span>${qty}</span>
              <button class="plus">+</button>
            </div>`
      }
    `;

    if (qty === 0) {
      card.querySelector(".add-btn").onclick = e => {
        e.stopPropagation();
        cart[p.id] = {product:p, qty:1};
        updateCart();
        render();
      };
    } else {
      card.querySelector(".plus").onclick = e => {
        e.stopPropagation();
        cart[p.id].qty++;
        updateCart();
        render();
      };
      card.querySelector(".minus").onclick = e => {
        e.stopPropagation();
        cart[p.id].qty--;
        if (cart[p.id].qty <= 0) delete cart[p.id];
        updateCart();
        render();
      };
    }

    productsEl.appendChild(card);
  });
}

function renderCart() {
  let total = 0;

  Object.values(cart).forEach(({product, qty}) => {
    total += product.price * qty;

    const card = document.createElement("div");
    card.className = "product";

    card.innerHTML = `
      <img src="${product.image}">
      <h3>${product.name}</h3>
      <p>${product.price} ₽ × ${qty}</p>
      <button class="remove-btn">Удалить</button>
    `;

    card.querySelector(".remove-btn").onclick = () => {
      delete cart[product.id];
      updateCart();
      render();
    };

    productsEl.appendChild(card);
  });

  const totalEl = document.createElement("div");
  totalEl.className = "total";
  totalEl.textContent = `Итого: ${total} ₽`;
  productsEl.appendChild(totalEl);
}

function updateCart() {
  const count = Object.values(cart).reduce((s,i)=>s+i.qty,0);
  cartCount.textContent = count;
}

cartButton.onclick = () => {
  inCart = true;
  render();
};

orderButton.onclick = () => {
  alert("Заказ оформлен (заглушка)");
};

mainTitle.onclick = () => {
  inCart = false;
  currentCategory
