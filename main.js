const tg = window.Telegram.WebApp;
tg.expand();

const productsEl = document.getElementById("products");
const searchInput = document.getElementById("searchInput");
const bottomButton = document.getElementById("bottomButton");
const cartTotal = document.getElementById("cartTotal");
const mainTitle = document.getElementById("mainTitle");

let inCart = false;
let cart = {};

const products = [
  {id:1,name:"Pierced Chain",price:2500,image:"https://i.pinimg.com/736x/37/0b/db/370bdb870346b42b1000610195261f62.jpg"},
  {id:2,name:"Starry Sky",price:4500,image:"https://i.pinimg.com/736x/55/bf/ec/55bfecc3c2ceebf20752ff2802ff4e19.jpg"},
  {id:3,name:"Gothic Thorns",price:3600,image:"https://i.pinimg.com/736x/c2/0d/26/c20d26fb9839c64d328f8989450f547b.jpg"}
];

function render(){
  productsEl.innerHTML="";
  cartTotal.style.display=inCart?"block":"none";
  bottomButton.textContent=inCart?"Оформить заказ":"🛒 Корзина";

  const list=inCart
    ? Object.values(cart)
    : products;

  list.forEach(p=>{
    const count=cart[p.id]?.count||0;

    const card=document.createElement("div");
    card.className="product";
    card.innerHTML=`
      <img src="${p.image}">
      <h3>${p.name}</h3>
      <p>${p.price} ₽</p>
      ${
        count===0
        ? `<button onclick="add(${p.id})">В корзину</button>`
        : `<div class="counter">
             <button onclick="change(${p.id},-1)">−</button>
             <span>${count}</span>
             <button onclick="change(${p.id},1)">+</button>
           </div>`
      }
    `;
    productsEl.appendChild(card);
  });

  const total=Object.values(cart).reduce((s,i)=>s+i.price*i.count,0);
  cartTotal.textContent=`Итог: ${total} ₽`;
}

window.add=id=>{
  const p=products.find(x=>x.id===id);
  cart[id]={...p,count:1};
  render();
}
window.change=(id,d)=>{
  cart[id].count+=d;
  if(cart[id].count<=0) delete cart[id];
  render();
}

bottomButton.onclick=()=>{
  if(!inCart){inCart=true;render();}
  else alert("Заказ оформлен");
};

mainTitle.onclick=()=>{
  inCart=false;
  render();
};

render();
