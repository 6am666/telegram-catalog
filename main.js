const tg = window.Telegram.WebApp;
tg.expand();

/* ================= TELEGRAM ================= */
const BOT_TOKEN = "8146718095:AAHeQj9OdqeUuMg1zh3g1_nO9-EJskpEN74";
const CHAT_ID = "531170149";

/* ================= STATE ================= */
let cart = [];
let inCartScreen = false;
let currentCategory = "Главная";
let isSending = false;

/* ================= DOM ================= */
const productsEl = document.getElementById("products");
const searchInput = document.getElementById("searchInput");
const cartButton = document.getElementById("cartButton");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");
const checkoutButton = document.getElementById("checkoutButton");
const categories = document.getElementById("categories");
const mainTitle = document.getElementById("mainTitle");
const menuIcon = document.getElementById("menuIcon");
const footerButtons = document.getElementById("footerButtons");

const modal = document.getElementById("modal");
const modalImage = document.getElementById("modalImage");
const modalTitle = document.getElementById("modalTitle");
const modalPrice = document.getElementById("modalPrice");
const modalDescription = document.getElementById("modalDescription");
const modalClose = document.getElementById("modalClose");

const orderModal = document.getElementById("orderModal");
const orderClose = document.getElementById("orderClose");
const orderForm = document.getElementById("orderForm");
const addressInput = document.getElementById("addressInput");

/* ================= UI ================= */
menuIcon.onclick = () => categories.classList.toggle("show");

/* ================= PRODUCTS (ВСЕ) ================= */
const products = [
  {id:1,name:"Браслет Hearts",price:4000,image:"https://i.pinimg.com/736x/d4/c5/4c/d4c54cd9c489d1e73d9e306545929b70.jpg",category:"Браслеты",description:["Материал изделия:","Хирургическая сталь;","Фурнитура из нержавеющей стали.","Срок изготовления — до 5 рабочих дней."]},
  {id:2,name:"Колье Gothic Thorns",price:3600,image:"https://i.pinimg.com/736x/c2/0d/26/c20d26fb9839c64d328f8989450f547b.jpg",category:"Колье",description:["Материал изделия:","Атласная лента;","Хирургическая сталь;","Фурнитура из хирургической и нержавеющей стали.","Срок изготовления — до 5 рабочих дней."]},
  {id:3,name:"Колье Pierced Chain",price:2500,image:"https://i.pinimg.com/736x/37/0b/db/370bdb870346b42b1000610195261f62.jpg",category:"Колье",description:["Материал изделия:","Нержавеющая сталь;","Фурнитура из хирургической и нержавеющей стали.","Срок изготовления — до 5 рабочих дней."]},
  {id:4,name:"Колье Starry Sky",price:4500,image:"https://i.pinimg.com/736x/55/bf/ec/55bfecc3c2ceebf20752ff2802ff4e19.jpg",category:"Колье",description:["Материал изделия:","Хирургическая сталь;","Фурнитура из хирургической и нержавеющей стали.","Срок изготовления — до 5 рабочих дней."]},
  {id:5,name:"Кулон с цепочкой Moonlight",price:2000,image:"https://i.pinimg.com/736x/5a/6d/1b/5a6d1beecdc7b79798705e4da0ef3a5c.jpg",category:"Кулоны",description:["Материал изделия:","Лунная бусина;","Хирургическая сталь;","Фурнитура из нержавеющей стали.","Срок изготовления — до 5 рабочих дней."]},
  {id:6,name:"Обвес Lighter",price:3600,image:"https://i.pinimg.com/736x/e8/cb/c2/e8cbc2287025b23930c20e030755a0b5.jpg",category:"Обвесы",description:["Материал изделия:","Фурнитура из нержавеющей стали;","Хирургическая и нержавеющая сталь.","Срок изготовления — до 5 рабочих дней."]},
  {id:7,name:"Обвес Star",price:2000,image:"https://i.pinimg.com/736x/16/36/75/163675cf410dfc51ef97238bbbab1056.jpg",category:"Обвесы",description:["Материал изделия:","Хирургическая сталь;","Фурнитура из нержавеющей стали.","Срок изготовления — до 5 рабочих дней."]},
  {id:8,name:"Серьги Moonlight",price:2000,image:"https://i.pinimg.com/736x/93/e4/e5/93e4e5ee7594f6ef436f8b994ef04016.jpg",category:"Серьги",description:["Материал изделия:","Лунные бусины;","Хирургическая сталь;","Фурнитура из нержавеющей и хирургической стали.","Срок изготовления — до 5 рабочих дней."]},
  {id:9,name:"Тестовый товар",price:10,image:"https://via.placeholder.com/150",category:"Тест",description:["Тестовый товар.","Срок изготовления — 1 день."]}
];

/* ================= RENDER ================= */
function renderProducts(list){
  productsEl.innerHTML="";
  list.forEach(p=>{
    const card=document.createElement("div");
    card.className="product";

    const img=document.createElement("img");
    img.src=p.image;
    img.onclick=()=>openModal(p);

    const title=document.createElement("h3");
    title.textContent=p.name;

    const price=document.createElement("p");
    price.textContent=`${p.price} ₽`;

    const controls=document.createElement("div");
    controls.className="count-block";

    const item=cart.find(i=>i.product.id===p.id);
    if(item){
      const minus=document.createElement("button");
      minus.textContent="–";
      minus.onclick=e=>{e.stopPropagation(); removeFromCart(p);};

      const count=document.createElement("div");
      count.className="count-number";
      count.textContent=item.count;

      const plus=document.createElement("button");
      plus.textContent="+";
      plus.onclick=e=>{e.stopPropagation(); addToCart(p);};

      controls.append(minus,count,plus);
    } else {
      const add=document.createElement("button");
      add.className="add-btn";
      add.textContent="В корзину";
      add.onclick=e=>{e.stopPropagation(); addToCart(p);};
      controls.appendChild(add);
    }

    card.append(img,title,price,controls);
    productsEl.appendChild(card);
  });
  updateCartUI();
}

/* ================= CART ================= */
function addToCart(p){
  const i=cart.find(x=>x.product.id===p.id);
  i?i.count++:cart.push({product:p,count:1});
  renderProducts(getCurrentList());
}

function removeFromCart(p){
  const i=cart.find(x=>x.product.id===p.id);
  if(!i)return;
  i.count--;
  if(i.count<=0) cart=cart.filter(x=>x.product.id!==p.id);
  renderProducts(getCurrentList());
}

function updateCartUI(){
  cartCount.textContent=cart.reduce((s,i)=>s+i.count,0);
  cartTotal.textContent=cart.length
    ? `Итого: ${cart.reduce((s,i)=>s+i.count*i.product.price,0)} ₽`
    : "";
  cartTotal.style.display=inCartScreen?"block":"none";
  checkoutButton.style.display=inCartScreen && cart.length?"block":"none";
}

/* ================= MODAL ================= */
function openModal(p){
  modalImage.src=p.image;
  modalTitle.textContent=p.name;
  modalPrice.textContent=`${p.price} ₽`;
  modalDescription.innerHTML=p.description.join("<br>");
  modal.style.display="flex";
}
modalClose.onclick=()=>modal.style.display="none";
modal.onclick=e=>e.target===modal&&(modal.style.display="none");

/* ================= NAV ================= */
function getCurrentList(){
  if(inCartScreen) return cart.map(i=>i.product);
  if(currentCategory==="Главная") return products;
  return products.filter(p=>p.category===currentCategory);
}

categories.querySelectorAll("div").forEach(c=>{
  c.onclick=()=>{
    inCartScreen=false;
    currentCategory=c.dataset.category;
    renderProducts(getCurrentList());
    categories.classList.remove("show");
  };
});

cartButton.onclick=()=>{inCartScreen=true; renderProducts(getCurrentList());};
mainTitle.onclick=()=>{inCartScreen=false; currentCategory="Главная"; renderProducts(products);};

/* ================= ORDER ================= */
checkoutButton.onclick=()=>{
  if(!cart.length) return alert("Корзина пуста");
  orderModal.style.display="flex";
};

orderClose.onclick=()=>orderModal.style.display="none";
orderModal.onclick=e=>e.target===orderModal&&(orderModal.style.display="none");

orderForm.onsubmit = async e => {
  e.preventDefault();
  if(isSending) return;
  isSending = true;

  const name = orderForm.fullname.value.trim();
  const phone = orderForm.phone.value.trim();
  const delivery = orderForm.delivery.value;
  const address = addressInput.value.trim();

  if(!name || !phone || !delivery || !address){
    isSending=false;
    return alert("Заполните все поля");
  }

  const text =
`🛒 НОВЫЙ ЗАКАЗ

👤 ${name}
📞 ${phone}
🚚 ${delivery}
📍 ${address}

📦 Товары:
${cart.map(i=>`• ${i.product.name} x${i.count}`).join("\n")}

💰 ${cart.reduce((s,i)=>s+i.count*i.product.price,0)} ₽`;

  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({chat_id:CHAT_ID,text})
  });

  alert("Заказ оформлен!");
  orderModal.style.display="none";
  isSending=false;
};

/* ================= SEARCH ================= */
searchInput.oninput=()=>{
  const v=searchInput.value.toLowerCase();
  renderProducts(getCurrentList().filter(p=>p.name.toLowerCase().includes(v)));
};

/* ================= DADATA ================= */
$(function(){
  $("#addressInput").suggestions({
    token:"4563b9c9765a1a2d7bf39e1c8944f7fadae05970",
    type:"ADDRESS",
    minChars:1,
    onSelect:s=>$("#addressInput").val(s.value)
  });
});

/* ================= START ================= */
renderProducts(products);
