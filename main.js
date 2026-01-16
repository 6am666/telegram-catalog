const tg = window.Telegram.WebApp;
tg.expand();

let cart = [];
let inCart = false;
let category = "Главная";

const products = [
  {id:1,name:"Браслет Hearts",price:4000,image:"https://i.pinimg.com/736x/d4/c5/4c/d4c54cd9c489d1e73d9e306545929b70.jpg",cat:"Браслеты"},
  {id:2,name:"Колье Gothic Thorns",price:3600,image:"https://i.pinimg.com/736x/c2/0d/26/c20d26fb9839c64d328f8989450f547b.jpg",cat:"Колье"},
  {id:3,name:"Колье Pierced Chain",price:2500,image:"https://i.pinimg.com/736x/37/0b/db/370bdb870346b42b1000610195261f62.jpg",cat:"Колье"}
];

const productsEl = document.getElementById("products");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");
const footer = document.getElementById("footerButtons");

function render() {
  productsEl.innerHTML = "";
  const list = inCart ? cart : products.filter(p=>category==="Главная"||p.cat===category);

  list.forEach(p=>{
    const d = document.createElement("div");
    d.className = "product";
    d.innerHTML = `
      <img src="${p.image}">
      <h3>${p.name}</h3>
      <p>${p.price} ₽</p>
      <button>В корзину</button>
    `;
    d.querySelector("button").onclick = ()=>{
      const i = cart.find(x=>x.id===p.id);
      i ? i.count++ : cart.push({...p,count:1});
      update();
    };
    productsEl.appendChild(d);
  });
}

function update(){
  const count = cart.reduce((s,i)=>s+i.count,0);
  const sum = cart.reduce((s,i)=>s+i.count*i.price,0);
  cartCount.textContent = count;
  cartTotal.textContent = sum ? `Итого: ${sum} ₽` : "";
  footer.style.display = inCart ? "none" : "flex";
}

document.getElementById("cartButton").onclick = ()=>{
  inCart = true;
  render();
};

document.getElementById("mainTitle").onclick = ()=>{
  inCart = false;
  category = "Главная";
  render();
};

document.getElementById("checkoutButton").onclick = ()=>{
  document.getElementById("orderModal").style.display = "flex";
};

document.getElementById("orderClose").onclick = ()=>{
  document.getElementById("orderModal").style.display = "none";
};

document.getElementById("orderForm").onsubmit = e=>{
  e.preventDefault();

  const fd = new FormData(e.target);
  const order = {
    user: tg.initDataUnsafe.user,
    fullname: fd.get("fullname"),
    address: fd.get("address"),
    delivery: fd.get("delivery"),
    phone: fd.get("phone"),
    cart
  };

  tg.sendData(JSON.stringify(order));
  alert("Заказ отправлен!");

  cart = [];
  update();
  render();
};

$(function(){
  $("#addressInput").suggestions({
    token:"4563b9c9765a1a2d7bf39e1c8944f7fadae05970",
    type:"ADDRESS",
    hint:false,
    style:{backgroundColor:"#2e2e2e",color:"#fff"}
  });
});

render();
