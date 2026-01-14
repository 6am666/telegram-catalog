const tg = window.Telegram.WebApp;
tg.expand();

let cart = [];
let inCartScreen = false;

const products = [
  { id: 1, name: "Колье Pierced Chain", price: 1200, image: "https://via.placeholder.com/300" },
  { id: 2, name: "Колье Starry Sky", price: 1350, image: "https://via.placeholder.com/300" },
  { id: 3, name: "Колье Gothic Thorns", price: 1100, image: "https://via.placeholder.com/300" },
  { id: 4, name: "Браслет Hearts", price: 1400, image: "https://via.placeholder.com/300" },
  { id: 5, name: "Обвес Lighter", price: 1600, image: "https://via.placeholder.com/300" },
  { id: 6, name: "Обвес Star", price: 1250, image: "https://via.placeholder.com/300" },
  { id: 7, name: "Серьги Moonlight", price: 1300, image: "https://via.placeholder.com/300" },
  { id: 8, name: "Кулон с цепочкой Moonlight", price: 1500, image: "https://via.placeholder.com/300" },
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
