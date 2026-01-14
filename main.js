const tg = window.Telegram.WebApp;
tg.expand();

const products = [
  { id: 1, name: "Футболка Космос", price: 1200, image: "https://example.com/tshirt.png" },
  { id: 2, name: "Кружка Магия", price: 800, image: "https://example.com/mug.png" },
  { id: 3, name: "Блокнот Звезда", price: 500, image: "https://example.com/notebook.png" }
];

const catalog = document.getElementById('catalog');

products.forEach(product => {
  const card = document.createElement('div');
  card.className = 'card';

  const img = document.createElement('img');
  img.src = product.image;

  const name = document.createElement('div');
  name.textContent = product.name;

  const price = document.createElement('div');
  price.textContent = product.price + ' ₽';

  const button = document.createElement('button');
  button.textContent = 'Купить';
  button.onclick = () => {
    tg.sendData(JSON.stringify(product));
    alert(`Вы выбрали: ${product.name}`);
  };

  card.appendChild(img);
  card.appendChild(name);
  card.appendChild(price);
  card.appendChild(button);

  catalog.appendChild(card);
});
