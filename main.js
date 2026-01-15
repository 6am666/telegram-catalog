const tg = window.Telegram.WebApp;
tg.expand();
tg.MainButton.setParams({ color: '#333', textColor: '#fff' });

let cart = [];
let currentModalProduct = null;
let inCartScreen = false;

const containerEl = document.getElementById("products");
const mainTitle = document.getElementById("mainTitle");
const menuIcon = document.getElementById("menuIcon");
const categories = document.getElementById("categories");
const cartButton = document.getElementById("cartButton");

const modal = document.getElementById("modal");
const modalImage = document.getElementById("modalImage");
const modalTitle = document.getElementById("modalTitle");
const modalPrice = document.getElementById("modalPrice");
const modalAdd = document.getElementById("modalAdd");
const modalClose = document.getElementById("modalClose");

const products = [
  { id: 1, name: "Колье Pierced Chain", price: 2500, image: "https://i.pinimg.com/736x/37/0b/db/370bdb870346b42b1000610195261f62.jpg", category: "Колье" },
  { id: 2, name: "Колье Starry Sky", price: 4500, image: "https://i.pinimg.com/736x/55/bf/ec/55bfecc3c2ceebf20752ff2802ff4e19.jpg", category: "Колье" },
  { id: 3, name: "Колье Gothic Thorns", price: 3600, image: "https://i.pinimg.com/736x/c2/0d/26/c20d26fb9839c64d328f8989450f547b.jpg", category: "Колье" },
  { id: 4, name: "Браслет Hearts", price: 4000, image: "https://i.pinimg.com/736x/d4/c5/4c/d4c54cd9c489d1e73d9e306545929b70.jpg", category: "Браслеты" },
  { id: 5, name: "Обвес Lighter", price: 3600, image: "https://i.pinimg.com/736x/e8/cb/c2/e8cbc2287025b23930c20e030755a0b5.jpg", category: "Обвесы" },
  { id: 6, name: "Обвес Star", price: 2000, image: "https://i.pinimg.com/736x/16/36/75/163675cf410dfc51ef97238bbbab1056.jpg", category: "Обвесы" },
  { id: 7, name: "Серьги Moonlight", price: 2000, image: "https://i.pinimg.com/736x/93/e4/e5/93e4e5ee7594f6ef436f8b994ef04016.jpg", category: "Серьги" },
  { id: 8, name: "Кулон с цепочкой Moonlight", price: 2000, image: "https://i.pinimg.com/736x/5a/6d/1b/5a6d1beecdc7b79798705e4da0ef3a5c.jpg", category: "Кулоны" },
];

// Рендер товаров
function renderProducts(list = products) {
  containerEl.innerHTML = "";
  inCartScreen = false;
  list.forEach(p => {
    const card = document.createElement("div");
    card.className = "product";

    const img = new Image();
    img.src = p.image;
    img.alt = p.name;
    img.onerror = () => img.src = "https://via.placeholder.com/300";

    card.innerHTML = `<h3>${p.name}</h3><p>${p.price} ₽</p><button class="add-btn">В корзину</button>`;
    card.prepend(img);

    // Открыть модальное окно
    card.onclick = () => openModal(p);

    card.querySelector(".add-btn").onclick = (e) => {
      e.stopPropagation();
      addToCart(p);
    };

    containerEl.appendChild(card);
  });
  updateCartButton();
}

// Модальное окно
function openModal(p) {
  currentModalProduct = p;
  modalImage.src = p.image;
  modalTitle.textContent = p.name;
  modalPrice.textContent = `${p.price} ₽`;
  modal.style.display = "flex";
}
modalClose.onclick = () => modal.style.display = "none";
window.onclick = (e) => { if(e.target === modal) modal.style.display = "none"; }
modalAdd.onclick = () => { if(currentModalProduct) addToCart(currentModalProduct); }

// Поиск
function filterProducts(value) {
  value = value.toLowerCase();
  renderProducts(products.filter(p => p.name.toLowerCase().includes(value)));
}

// Гамбургер
menuIcon.onclick = () => categories.classList.toggle("show");
categories.querySelectorAll("div").forEach(cat => {
  cat.onclick = () => {
    const catName = cat.dataset.category;
    if(catName === "Главная") renderProducts();
    else renderProducts(products.filter(p => p.category === catName));
    categories.classList.remove("show");
  };
});

// КОРЗИНА
function addToCart(product) {
  cart.push(product);
  updateCartButton();
}

function updateCartButton() {
  cartButton.textContent = `Корзина (${cart.length})`;
}

cartButton.onclick = () => {
  inCartScreen = true;
  containerEl.innerHTML = "";
  if(cart.length === 0){
    containerEl.innerHTML = `<p style="color:white; text-align:center; margin-top:20px;">Корзина пуста</p>`;
  } else {
    cart.forEach((p,i)=>{
      const card = document.createElement("div");
      card.className = "product";
      card.innerHTML = `<img src="${p.image}" style="width:100%;height:60%;object-fit:cover;border-radius:10px"><h3>${p.name}</h3><p>${p.price} ₽</p><button class="remove-btn">Удалить</button>`;
      card.querySelector(".remove-btn").onclick = () => {
        cart.splice(i,1);
        updateCartButton();
        cartButton.click();
      };
      containerEl.appendChild(card);
    });
    const total = cart.reduce((sum,item)=>sum+item.price,0);
    const totalDiv = document.createElement("div");
    totalDiv.className = "cart-total";
    totalDiv.textContent = `Итого: ${total} ₽`;
    containerEl.appendChild(totalDiv);
  }
}

renderProducts();
