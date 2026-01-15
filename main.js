const tg = window.Telegram.WebApp;
tg.expand();

/* -------------------- STATE -------------------- */
let cart = [];
let inCartScreen = false;
let currentModalProduct = null;

/* -------------------- ELEMENTS -------------------- */
const containerEl = document.getElementById("products");
const searchInput = document.getElementById("searchInput");
const cartButton = document.getElementById("cartButton");
const checkoutButton = document.getElementById("checkoutButton");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");
const mainTitle = document.getElementById("mainTitle");
const menuIcon = document.getElementById("menuIcon");
const categories = document.getElementById("categories");
const footerButtons = document.getElementById("footerButtons");

const modal = document.getElementById("modal");
const modalImage = document.getElementById("modalImage");
const modalTitle = document.getElementById("modalTitle");
const modalPrice = document.getElementById("modalPrice");
const modalClose = document.getElementById("modalClose");
const modalAdd = document.getElementById("modalAdd");
const modalBack = document.getElementById("modalBack");

/* -------------------- PRODUCTS -------------------- */
const products = [
  {
    id: 1,
    name: "Колье Pierced Chain",
    price: 2500,
    image: "https://i.pinimg.com/736x/37/0b/db/370bdb870346b42b1000610195261f62.jpg",
    category: "Колье",
    description:
`Материал изделия:
Нержавеющая сталь;
Фурнитура из хирургической и нержавеющей стали.

Срок изготовления — до 5 рабочих дней.`
  },
  {
    id: 2,
    name: "Колье Starry Sky",
    price: 4500,
    image: "https://i.pinimg.com/736x/55/bf/ec/55bfecc3c2ceebf20752ff2802ff4e19.jpg",
    category: "Колье",
    description:
`Материал изделия:
Хирургическая сталь;
Фурнитура из хирургической и нержавеющей стали.

Срок изготовления — до 5 рабочих дней.`
  },
  {
    id: 3,
    name: "Колье Gothic Thorns",
    price: 3600,
    image: "https://i.pinimg.com/736x/c2/0d/26/c20d26fb9839c64d328f8989450f547b.jpg",
    category: "Колье",
    description:
`Материал изделия:
Атласная лента;
Хирургическая сталь;
Фурнитура из хирургической и нержавеющей стали.

Срок изготовления — до 5 рабочих дней.`
  },
  {
    id: 4,
    name: "Браслет Hearts",
    price: 4000,
    image: "https://i.pinimg.com/736x/d4/c5/4c/d4c54cd9c489d1e73d9e306545929b70.jpg",
    category: "Браслеты",
    description:
`Материал изделия:
Хирургическая сталь;
Фурнитура из нержавеющей стали.

Срок изготовления — до 5 рабочих дней.`
  },
  {
    id: 5,
    name: "Обвес Lighter",
    price: 3600,
    image: "https://i.pinimg.com/736x/e8/cb/c2/e8cbc2287025b23930c20e030755a0b5.jpg",
    category: "Обвесы",
    description:
`Материал изделия:
Фурнитура из нержавеющей стали;
Хирургическая и нержавеющая сталь.

Срок изготовления — до 5 рабочих дней.`
  },
  {
    id: 6,
    name: "Обвес Star",
    price: 2000,
    image: "https://i.pinimg.com/736x/16/36/75/163675cf410dfc51ef97238bbbab1056.jpg",
    category: "Обвесы",
    description:
`Материал изделия:
Хирургическая сталь;
Фурнитура из нержавеющей стали.

Срок изготовления — до 5 рабочих дней.`
  },
  {
    id: 7,
    name: "Серьги Moonlight",
    price: 2000,
    image: "https://i.pinimg.com/736x/93/e4/e5/93e4e5ee7594f6ef436f8b994ef04016.jpg",
    category: "Серьги",
    description:
`Материал изделия:
Лунные бусины;
Хирургическая сталь;
Фурнитура из нержавеющей и хирургической стали.

Срок изготовления — до 5 рабочих дней.`
  },
  {
    id: 8,
    name: "Кулон с цепочкой Moonlight",
    price: 2000,
    image: "https://i.pinimg.com/736x/5a/6d/1b/5a6d1beecdc7b79798705e4da0ef3a5c.jpg",
    category: "Кулоны",
    description:
`Материал изделия:
Лунная бусина;
Хирургическая сталь;
Фурнитура из нержавеющей стали.

Срок изготовления — до 5 рабочих дней.`
  }
];

/* -------------------- RENDER -------------------- */
function renderProducts(list = products) {
  containerEl.innerHTML = "";

  searchInput.style.display = inCartScreen ? "none" : "block";
  cartTotal.style.display = inCartScreen ? "block" : "none";
  checkoutButton.style.display = inCartScreen && cart.length ? "block" : "none";
  footerButtons.style.display = inCartScreen ? "none" : "flex";

  list.forEach(p => {
    const card = document.createElement("div");
    card.className = "product";

    const img = new Image();
    img.src = p.image;
    img.alt = p.name;
    img.onclick = e => {
      e.stopPropagation();
      openModal(p);
    };

    const cartItem = cart.find(i => i.product.id === p.id);
    const count = cartItem ? cartItem.count : 0;

    card.appendChild(img);
    card.innerHTML += `<h3>${p.name}</h3><p>${p.price} ₽</p>`;

    if (count > 0) {
      card.innerHTML += `
        <div class="count-block">
          <button class="remove-btn">−</button>
          <div class="count-number">${count}</div>
          <button class="add-btn">+</button>
        </div>`;
    } else {
      card.innerHTML += `<button class="add-btn">В корзину</button>`;
    }

    containerEl.appendChild(card);

    const addBtn = card.querySelector(".add-btn");
    const removeBtn = card.querySelector(".remove-btn");

    if (addBtn) addBtn.onclick = e => { e.stopPropagation(); addToCart(p); };
    if (removeBtn) removeBtn.onclick = e => { e.stopPropagation(); removeFromCart(p); };
  });

  updateCartCount();
  updateCartTotal();
}

/* -------------------- CART -------------------- */
function addToCart(product) {
  const item = cart.find(i => i.product.id === product.id);
  if (item) item.count++;
  else cart.push({ product, count: 1 });
  renderProducts(inCartScreen ? cart.map(i => i.product) : products);
}

function removeFromCart(product) {
  const item = cart.find(i => i.product.id === product.id);
  if (!item) return;
  item.count--;
  if (item.count === 0) cart = cart.filter(i => i.product.id !== product.id);
  renderProducts(inCartScreen ? cart.map(i => i.product) : products);
}

function updateCartCount() {
  cartCount.textContent = cart.reduce((s, i) => s + i.count, 0);
}

function updateCartTotal() {
  cartTotal.textContent =
    "Итог: " + cart.reduce((s, i) => s + i.product.price * i.count, 0) + " ₽";
}

/* -------------------- MODAL -------------------- */
function openModal(p) {
  currentModalProduct = p;
  modalImage.src = p.image;
  modalTitle.textContent = p.name;
  modalPrice.textContent = `${p.price} ₽`;
  modalAdd.style.display = "none";
  modalBack.style.display = "none";

  modal.querySelector(".modal-text").innerHTML =
    `<h3>${p.name}</h3><p>${p.price} ₽</p>
     <div style="margin-top:8px; white-space:pre-line; font-size:13px;">
       ${p.description}
     </div>`;

  modal.style.display = "flex";
}

modalClose.onclick = () => modal.style.display = "none";
modal.onclick = e => { if (e.target === modal) modal.style.display = "none"; };

/* -------------------- EVENTS -------------------- */
cartButton.onclick = () => {
  inCartScreen = true;
  renderProducts(cart.map(i => i.product));
};

mainTitle.onclick = () => {
  inCartScreen = false;
  renderProducts(products);
};

menuIcon.onclick = () => categories.classList.toggle("show");

categories.querySelectorAll("div").forEach(cat => {
  cat.onclick = () => {
    inCartScreen = false;
    renderProducts(
      cat.dataset.category === "Главная"
        ? products
        : products.filter(p => p.category === cat.dataset.category)
    );
    categories.classList.remove("show");
  };
});

searchInput.addEventListener("input", e => {
  const v = e.target.value.toLowerCase();
  renderProducts(products.filter(p => p.name.toLowerCase().includes(v)));
});

/* -------------------- INIT -------------------- */
renderProducts();
