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

const modal = document.getElementById("modal");
const modalImage = document.getElementById("modalImage");
const modalTitle = document.getElementById("modalTitle");
const modalPrice = document.getElementById("modalPrice");
const modalDescription = document.getElementById("modalDescription");
const modalClose = document.getElementById("modalClose");

const orderModal = document.getElementById("orderModal");
const orderClose = document.getElementById("orderClose");
const orderForm = document.getElementById("orderForm");

/* Гамбургер */
menuIcon.onclick = () => { categories.classList.toggle("show"); };

/* ================== ТОВАРЫ ================== */
const products = [
  {id:0,name:"Тестовое объявление",price:10,image:"https://i.imgur.com/2yAFzGq.png",category:"Главная",description:["Это тестовый товар для проверки работы системы оплаты."]},
  {id:1,name:"Браслет Hearts",price:4000,image:"https://i.pinimg.com/736x/d4/c5/4c/d4c54cd9c489d1e73d9e306545929b70.jpg",category:"Браслеты",description:["Материал изделия:","Хирургическая сталь;","Фурнитура из нержавеющей стали.","Срок изготовления — до 5 рабочих дней."]},
  {id:2,name:"Колье Gothic Thorns",price:3600,image:"https://i.pinimg.com/736x/c2/0d/26/c20d26fb9839c64d328f8989450f547b.jpg",category:"Колье",description:["Материал изделия:","Атласная лента;","Хирургическая сталь;","Фурнитура из хирургической и нержавеющей стали.","Срок изготовления — до 5 рабочих дней."]}
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
    } else{
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
  inCartScreen=false; currentCategory=c.dataset.category; renderProducts(getCurrentList()); categories.classList.remove("show"); updateUIVisibility();
}});
mainTitle.onclick=()=>{inCartScreen=false; currentCategory="Главная"; renderProducts(products); updateUIVisibility();};
cartButton.onclick=()=>{
  inCartScreen=true; renderProducts(cart.map(i=>i.product)); updateUIVisibility();
};

function updateUIVisibility(){
  if(inCartScreen){ searchInput.style.display="none"; footerButtons.style.display="none"; } 
  else{ searchInput.style.display="block"; footerButtons.style.display="flex"; }
}

/* ================== МОДАЛКА ЗАКАЗА ================== */
checkoutButton.onclick=()=>{if(cart.length===0) return alert("Корзина пуста!"); orderModal.style.display="flex";}
orderClose.onclick=()=>orderModal.style.display="none";
orderModal.onclick=e=>{if(e.target===orderModal) orderModal.style.display="none";}

/* ================== DaData ================== */
$(document).ready(function() {
  $("input[name='address']").suggestions({
    token: "4563b9c9765a1a2d7bf39e1c8944f7fadae05970",
    type: "ADDRESS",
    hint: false,
    geoLocation: true
  });
});

/* ================== Отправка на Google Sheets ================== */
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
    const response = await fetch("https://script.google.com/macros/s/AKfycbyonnMeRc1fvSIxV_Dg-4cNndxQoJDHxAQfV-CT9-gX8xLQL_seJYoo7op9Nib1MyCLsQ/exec", {
      method: "POST",
      body: JSON.stringify(orderData),
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      }
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
inCartScreen = false;
currentCategory = "Главная";
renderProducts(products);
updateUIVisibility();
