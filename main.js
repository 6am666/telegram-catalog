const tg = window.Telegram.WebApp;
tg.expand();

let cart = [];

// Товары
const products = [
  { id: 1, name: "Chain 1", price: 1200, image: "https://via.placeholder.com/300" },
  { id: 2, name: "Chain 2", price: 1350, image: "https://via.placeholder.com/300" },
  { id: 3, name: "Chain 3", price: 1100, image: "https://via.placeholder.com/300" },
  { id: 4, name: "Chain 4", price: 1400, image: "https://via.placeholder.com/300" },
  { id: 5, name: "Chain 5", price: 1600, image: "https://via.placeholder.com/300" },
];

const container = document.getElementById("products");
let inCartScreen = false;

// Рендер товаров каталога
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

// Поиск товаров
function filterProducts(value) {
  value = value.toLowerCase();
  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(value)
  );
  renderProducts(filtered);
}

// Добавление в корзину
function addToCart(product) {
  cart.push(product);
  saveCart();
  updateMainButton();
}

// Сохраняем корзину
function saveCart() {
  tg.CloudStorage.setItem("cart", JSON.stringify(cart));
}

// Удаляем товар
function removeFromCart(index) {
  cart.splice(index, 1);
  saveCart();
  renderCart();
}

// Обновляем кнопку Telegram
function updateMainButton() {
  if (cart.length > 0) {
    tg.MainButton.setText(inCartScreen ? `Оформить заказ (${cart.length})` : `Корзина (${cart.length})`);
    tg.MainButton.show();
  } else {
    tg.MainButton.hide();
  }
}

// Обработчик кнопки Telegram
tg.MainButton.onClick(() => {
  if (inCartScreen) {
    // Отправка заказа в бота
    tg.sendData(JSON.stringify({
      action: "order",
      items: cart
    }));
  } else {
    // Показ корзины
    renderCart();
  }
});

// Рендер экрана корзины
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
        <button class="add-btn">Удалить</button>
      `;
      card.querySelector(".add-btn").onclick = () => removeFromCart(i);
      container.appendChild(card);
    });

    // Сумма всех товаров
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    const totalDiv = document.createElement("div");
    totalDiv.style.color = "white";
    totalDiv.style.textAlign = "center";
    totalDiv.style.marginTop = "10px";
    totalDiv.innerHTML = `<h3>Итого: ${total} ₽</h3>`;
    container.appendChild(totalDiv);
  }

  updateMainButton();
}

// Загрузка корзины при старте
tg.CloudStorage.getItem("cart", (err, data) => {
  if (!err && data) {
    cart = JSON.parse(data);
  }
  renderProducts();
});
