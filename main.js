const tg = window.Telegram.WebApp;
tg.expand();

let cart = [];

const products = [
  { id: 1, name: "Chain 1", price: 1200, image: "https://via.placeholder.com/300" },
  { id: 2, name: "Chain 2", price: 1350, image: "https://via.placeholder.com/300" },
  { id: 3, name: "Chain 3", price: 1100, image: "https://via.placeholder.com/300" },
  { id: 4, name: "Chain 4", price: 1400, image: "https://via.placeholder.com/300" },
  { id: 5, name: "Chain 5", price: 1600, image: "https://via.placeholder.com/300" },
];

const container = document.getElementById("products");

function renderProducts(list = products) {
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
}

renderProducts();

/* ПОИСК */
function filterProducts(value) {
  value = value.toLowerCase();
  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(value)
  );
  renderProducts(filtered);
}

/* КОРЗИНА */
function addToCart(product) {
  cart.push(product);
  saveCart();
  updateMainButton();
}

function saveCart() {
  tg.CloudStorage.setItem("cart", JSON.stringify(cart));
}

function updateMainButton() {
  if (cart.length > 0) {
    tg.MainButton.setText(`Оформить заказ (${cart.length})`);
    tg.MainButton.show();
  } else {
    tg.MainButton.hide();
  }
}

/* ОФОРМЛЕНИЕ ЗАКАЗА */
tg.MainButton.onClick(() => {
  tg.sendData(JSON.stringify({
    action: "order",
    items: cart
  }));
});

/* ЗАГРУЗКА КОРЗИНЫ */
tg.CloudStorage.getItem("cart", (err, data) => {
  if (!err && data) {
    cart = JSON.parse(data);
    updateMainButton();
  }
});

