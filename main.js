const tg = window.Telegram.WebApp;
tg.expand();

const products = [
  { id: 1, name: "Chain 1", price: 1200, image: "https://via.placeholder.com/300" },
  { id: 2, name: "Chain 2", price: 1350, image: "https://via.placeholder.com/300" },
];

const container = document.getElementById("products");

products.forEach(p => {
  const card = document.createElement("div");
  card.className = "product";

  card.innerHTML = `
    <img src="${p.image}">
    <h3>${p.name}</h3>
    <p>${p.price} ₽</p>
  `;

  card.onclick = () => {
    tg.sendData(JSON.stringify(p));
  };

  container.appendChild(card);
});
