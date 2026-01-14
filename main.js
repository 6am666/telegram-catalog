const tg = window.Telegram.WebApp;
tg.expand();

let cart = [];
let inCartScreen = false;

const products = [
  { id: 1, name: "Колье Pierced Chain", price: 2500, image: "https://i.pinimg.com/736x/37/0b/db/370bdb870346b42b1000610195261f62.jpg" },
  { id: 2, name: "Колье Starry Sky", price: 4500, image: "https://i.pinimg.com/736x/55/bf/ec/55bfecc3c2ceebf20752ff2802ff4e19.jpg" },
  { id: 3, name: "Колье Gothic Thorns", price: 3600, image: "https://via.placeholder.com/300" },
  { id: 4, name: "Браслет Hearts", price: 4000, image: "https://i.pinimg.com/736x/d4/c5/4c/d4c54cd9c489d1e73d9e306545929b70.jpg" },
  { id: 5, name: "Обвес Lighter", price: 3600, image: "https://i.pinimg.com/736x/e8/cb/c2/e8cbc2287025b23930c20e030755a0b5.jpg" },
  { id: 6, name: "Обвес Star", price: 2000, image: "https://i.pinimg.com/736x/16/36/75/163675cf410dfc51ef97238bbbab1056.jpg" },
  { id: 7, name: "Серьги Moonlight", price: 2000, image: "https://i.pinimg.com/736x/93/e4/e5/93e4e5ee7594f6ef436f8b994ef04016.jpg" },
  { id: 8, name: "Кулон с цепочкой Moonlight", price: 2000, image: "https://i.pinimg.com/736x/5a/6d/1b/5a6d1beecdc7b79798705e4da0ef3a5c.jpg" },
];

const container = document.getElementById("products");

/* Рендер каталога */
function renderProducts(list = products) {
  inCartScreen = false;
  container.innerHTML = "";
  list.forEach(p => {
    const card = document.createElement("div");
    card.className = "product";

    card.innerHTML = `
      <img src="${p.image}">
      <h3>${p.name}</h3>
      <p>${p.price} ₽</p>
      <button class="add-btn">В корзину</button>
    `;

    card.querySelector(".add-btn").onclick = (e) => {
      e.stopPropagation();
      addToCart(p);
    };

    container.appendChild(card);
  });
  updateMainButton();
}

/* Поиск */
function filterProducts(value) {
  value = value.toLowerCase();
  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(value)
  );
  renderProducts(filtered);
}

/* Корзина */
function addToCart(product) {
  cart.push(product);
  saveCart();
  updateMainButton();
}

function saveCart() {
  tg.CloudStorage.setItem("cart", JSON.stringify(cart));
}

function removeFromCart(index) {
  cart.splice(index, 1);
  saveCart();
  renderCart();
}

function updateMainButton() {
  if (cart.length > 0) {
    tg.MainButton.setText(inCartScreen ? `Оформить заказ (${cart.length})` : `Корзина (${cart.length})`);
    tg.MainButton.show();
  } else {
    tg.MainButton.hide();
  }
}

/* Кнопка Telegram */
tg.MainButton.onClick(() => {
  if (inCartScreen) {
    tg.sendData(JSON.stringify({
      action: "order",
      items: cart
    }));
  } else {
    renderCart();
  }
});

/* Рендер корзины */
function renderCart() {
  inCartScreen = true;
  container.innerHTML = "";

  if (cart.length === 0) {
    container.innerHTML = `<p style="color:white; text-align:center; margin-top:20px;">Корзина пуста</p>`;
  } else {
    cart.forEach((p, i) => {
      const card = document.createElement("div");
      card.className = "product";

      card.innerHTML = `
        <img src="${p.image}">
        <h3>${p.name}</h3>
        <p>${p.price} ₽</p>
        <button class="remove-btn">Удалить</button>
      `;

      card.querySelector(".remove-btn").onclick = () => removeFromCart(i);
      container.appendChild(card);
    });

    // Сумма
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    const totalDiv = document.createElement("div");
    totalDiv.className = "cart-total";
    totalDiv.textContent = `Итого: ${total} ₽`;
    container.appendChild(totalDiv);
  }

  updateMainButton();
}

/* Загрузка корзины при старте */
tg.CloudStorage.getItem("cart", (err, data) => {
  if (!err && data) {
    cart = JSON.parse(data);
  }
  renderProducts();
});
