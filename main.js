const tg = window.Telegram.WebApp;
tg.expand();

let cart = [];
let inCartScreen = false;
let currentCategory = "Главная";

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

/* модалка товара */
const modal = document.getElementById("modal");
const modalImage = document.getElementById("modalImage");
const modalTitle = document.getElementById("modalTitle");
const modalPrice = document.getElementById("modalPrice");
const modalDescription = document.getElementById("modalDescription");
const modalClose = document.getElementById("modalClose");

/* модалка заказа */
const orderModal = document.getElementById("orderModal");
const orderClose = document.getElementById("orderClose");
const orderForm = document.getElementById("orderForm");

/* гамбургер */
menuIcon.onclick = () => { categories.classList.toggle("show"); };

/* ================== ТОВАРЫ ================== */
const products = [
  {id:1,name:"Браслет Hearts",price:4000,image:"https://i.pinimg.com/736x/d4/c5/4c/d4c54cd9c489d1e73d9e306545929b70.jpg",category:"Браслеты",description:["Материал изделия:","Хирургическая сталь;","Фурнитура из нержавеющей стали.","Срок изготовления — до 5 рабочих дней."]},
  {id:2,name:"Колье Gothic Thorns",price:3600,image:"https://i.pinimg.com/736x/c2/0d/26/c20d26fb9839c64d328f8989450f547b.jpg",category:"Колье",description:["Материал изделия:","Атласная лента;","Хирургическая сталь;","Фурнитура из хирургической и нержавеющей стали.","Срок изготовления — до 5 рабочих дней."]},
  {id:3,name:"Колье Pierced Chain",price:2500,image:"https://i.pinimg.com/736x/37/0b/db/370bdb870346b42b1000610195261f62.jpg",category:"Колье",description:["Материал изделия:","Нержавеющая сталь;","Фурнитура из хирургической и нержавеющей стали.","Срок изготовления — до 5 рабочих дней."]},
  {id:4,name:"Колье Starry Sky",price:4500,image:"https://i.pinimg.com/736x/55/bf/ec/55bfecc3c2ceebf20752ff2802ff4e19.jpg",category:"Колье",description:["Материал изделия:","Хирургическая сталь;","Фурнитура из хирургической и нержавеющей стали.","Срок изготовления — до 5 рабочих дней."]},
  {id:5,name:"Кулон с цепочкой Moonlight",price:2000,image:"https://i.pinimg.com/736x/5a/6d/1b/5a6d1beecdc7b79798705e4da0ef3a5c.jpg",category:"Кулоны",description:["Материал изделия:","Лунная бусина;","Хирургическая сталь;","Фурнитура из нержавеющей стали.","Срок изготовления — до 5 рабочих дней."]},
  {id:6,name:"Обвес Lighter",price:3600,image:"https://i.pinimg.com/736x/e8/cb/c2/e8cbc2287025b23930c20e030755a0b5.jpg",category:"Обвесы",description:["Материал изделия:","Фурнитура из нержавеющей стали;","Хирургическая и нержавеющая сталь.","Срок изготовления — до 5 рабочих дней."]},
  {id:7,name:"Обвес Star",price:2000,image:"https://i.pinimg.com/736x/16/36/75/163675cf410dfc51ef97238bbbab1056.jpg",category:"Обвесы",description:["Материал изделия:","Хирургическая сталь;","Фурнитура из нержавеющей стали.","Срок изготовления — до 5 рабочих дней."]},
  {id:8,name:"Серьги Moonlight",price:2000,image:"https://i.pinimg.com/736x/93/e4/e5/93e4e5ee7594f6ef436f8b994ef04016.jpg",category:"Серьги",description:["Материал изделия:","Лунные бусины;","Хирургическая сталь;","Фурнитура из нержавеющей и хирургической стали.","Срок изготовления — до 5 рабочих дней."]}
];

/* ================== ФУНКЦИИ ================== */
function renderProducts(list){
  productsEl.innerHTML="";
  list.forEach(p=>{
    const card=document.createElement("div"); card.className="product";
    const img=document.createElement("img"); img.src=p.image; img.onclick=()=>openModal(p);
    const title=document.createElement("h3"); title.textContent=p.name;
    const price=document.createElement("p"); price.textContent=`${p.price} ₽`;
    const cartItem=cart.find(i=>i.product.id===p.id);
    const controls=document.createElement("div"); controls.className="count-block";
    if(cartItem){
      const minus=document.createElement("button"); minus.textContent="–"; minus.onclick=e=>{e.stopPropagation(); removeFromCart(p)};
      const count=document.createElement("div"); count.className="count-number"; count.textContent=cartItem.count;
      const plus=document.createElement("button"); plus.textContent="+"; plus.onclick=e=>{e.stopPropagation(); addToCart(p)};
      controls.append(minus,count,plus);
    }else{
      const addBtn=document.createElement("button"); addBtn.className="add-btn"; addBtn.textContent="В корзину"; addBtn.onclick=e=>{e.stopPropagation(); addToCart(p)};
      controls.appendChild(addBtn);
    }
    card.append(img,title,price,controls); productsEl.appendChild(card);
  });
  updateCartUI();
}

function addToCart(product){const item=cart.find(i=>i.product.id===product.id); item?item.count++:cart.push({product,count:1}); renderProducts(getCurrentList());}
function removeFromCart(product){const item=cart.find(i=>i.product.id===product.id); if(!item)return; item.count--; if(item.count===0) cart=cart.filter(i=>i.product.id!==product.id); renderProducts(getCurrentList());}

function updateCartUI(){
  const totalCount=cart.reduce((s,i)=>s+i.count,0);
  const totalPrice=cart.reduce((s,i)=>s+i.count*i.product.price,0);
  cartCount.textContent=totalCount;
  cartTotal.textContent=totalPrice?`Итого: ${totalPrice} ₽`:"";
  cartTotal.style.display=inCartScreen? "block":"none";
  checkoutButton.style.display=totalCount && inCartScreen? "block":"none";
}

function openModal(p){
  modalImage.src=p.image;
  modalTitle.textContent=p.name;
  modalPrice.textContent=`${p.price} ₽`;
  modalDescription.innerHTML=p.description.map((line,i)=> i===p.description.length-1? `<span>${line}</span>`:line ).join("<br>");
  modal.style.display="flex";
}
modalClose.onclick=()=>modal.style.display="none";
modal.onclick=e=>{if(e.target===modal) modal.style.display="none";};

function getCurrentList(){ if(inCartScreen) return cart.map(i=>i.product); if(currentCategory==="Главная") return products; return products.filter(p=>p.category===currentCategory); }

categories.querySelectorAll("div").forEach(c=>{c.onclick=()=>{
  inCartScreen=false; currentCategory=c.dataset.category; renderProducts(getCurrentList()); categories.classList.remove("show");
}});
mainTitle.onclick=()=>{inCartScreen=false; currentCategory="Главная"; renderProducts(products);};
cartButton.onclick=()=>{
  inCartScreen=true; renderProducts(cart.map(i=>i.product));
  updateUIVisibility();
};

/* скрываем поиск и футер в корзине */
function updateUIVisibility(){
  if(inCartScreen){
    searchInput.style.display="none";
    footerButtons.style.display="none"; // футер скрыт
  } else{
    searchInput.style.display="block";
    footerButtons.style.display="flex";
  }
}

/* ================== МОДАЛКА ЗАКАЗА ================== */
checkoutButton.onclick=()=>{if(cart.length===0) return alert("Корзина пуста!"); orderModal.style.display="flex";}
orderClose.onclick=()=>orderModal.style.display="none";
orderModal.onclick=e=>{if(e.target===orderModal) orderModal.style.display="none";}

/* отправка формы на Google Sheets */
orderForm.onsubmit = async e => {
  e.preventDefault();
  if(cart.length === 0) return alert("Корзина пуста!");

  const fd = new FormData(orderForm);
  const orderData = {
    fullname: fd.get("fullname"),
    address: fd.get("address"),
    delivery: fd.get("delivery"),
    phone: fd.get("phone"),
    items: cart.map(i => ({name:i.product.name, price:i.product.price, count:i.count}))
  };

  try {
    const response = await fetch("https://script.google.com/macros/s/AKfycbyly6E28Y6Oen8RiYInebvJBh9fT5bCh15JYFE48QKOpxMai9FDu94vixY_zcbaOtd2/exec", {
      method: "POST",
      body: JSON.stringify(orderData),
      headers: { "Content-Type": "application/json" }
    });
    const result = await response.json();
    if(result.status === "success") alert("Заказ успешно отправлен!");
    else alert("Ошибка при отправке: " + result.message);
  } catch(err) {
    alert("Ошибка соединения: " + err);
  }

  orderModal.style.display = "none";
  cart = [];
  renderProducts(getCurrentList());
};

/* ================== ПОИСК ================== */
searchInput.oninput=()=>{const val=searchInput.value.toLowerCase(); renderProducts(getCurrentList().filter(p=>p.name.toLowerCase().includes(val)));};

/* ================== СТАРТ ================== */
renderProducts(products);
updateUIVisibility();
