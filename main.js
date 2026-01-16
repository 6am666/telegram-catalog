let cart = [];

const products = [
  {id:1,name:"Браслет Hearts",price:4000,img:"https://i.pinimg.com/736x/d4/c5/4c/d4c54cd9c489d1e73d9e306545929b70.jpg"},
  {id:2,name:"Колье Gothic Thorns",price:3600,img:"https://i.pinimg.com/736x/c2/0d/26/c20d26fb9839c64d328f8989450f547b.jpg"},
  {id:3,name:"Колье Pierced Chain",price:2500,img:"https://i.pinimg.com/736x/37/0b/db/370bdb870346b42b1000610195261f62.jpg"},
  {id:4,name:"Тестовый товар",price:10,img:"https://via.placeholder.com/300"}
];

const productsEl = document.getElementById("products");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");
const checkoutButton = document.getElementById("checkoutButton");

function renderProducts(list){
  productsEl.innerHTML="";
  list.forEach(p=>{
    const el=document.createElement("div");
    el.className="product";
    el.innerHTML=`
      <img src="${p.img}">
      <h3>${p.name}</h3>
      <p>${p.price} ₽</p>
      <button>В корзину</button>
    `;
    el.querySelector("button").onclick=()=>addToCart(p);
    productsEl.appendChild(el);
  });
}

function addToCart(p){
  const item=cart.find(i=>i.id===p.id);
  item ? item.qty++ : cart.push({...p,qty:1});
  updateCart();
}

function updateCart(){
  cartCount.textContent=cart.reduce((s,i)=>s+i.qty,0);
  const sum=cart.reduce((s,i)=>s+i.qty*i.price,0);
  cartTotal.textContent=sum?`Итого: ${sum} ₽`:"";
}

checkoutButton.onclick=()=>{
  if(!cart.length) return alert("Корзина пуста");
  document.getElementById("orderModal").style.display="flex";
};

document.getElementById("orderClose").onclick=()=>{
  document.getElementById("orderModal").style.display="none";
};

/* ===== Отправка в Telegram через Apps Script ===== */
document.getElementById("orderForm").onsubmit=e=>{
  e.preventDefault();
  const fd=new FormData(e.target);

  const text = 
`🛒 НОВЫЙ ЗАКАЗ
ФИО: ${fd.get("fullname")}
Адрес: ${fd.get("address")}
Доставка: ${fd.get("delivery")}
Контакт: ${fd.get("phone")}

Товары:
${cart.map(i=>`${i.name} x${i.qty}`).join("\n")}
`;

  fetch(APPS_SCRIPT_URL,{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({text})
  })
  .then(()=>alert("Заказ отправлен в Telegram"))
  .catch(()=>alert("Ошибка отправки"));
};

/* ===== DaData ===== */
$(function(){
  $("#addressInput").suggestions({
    token:"4563b9c9765a1a2d7bf39e1c8944f7fadae05970",
    type:"ADDRESS",
    hint:false
  });
});

/* тёмная тема подсказок */
const style=document.createElement("style");
style.innerHTML=`
.suggestions-suggestions{background:#222!important;color:#fff!important}
.suggestions-suggestion:hover{background:#444!important}
`;
document.head.appendChild(style);

renderProducts(products);
