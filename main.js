// ================== ИНИЦИАЛИЗАЦИЯ ==================
let cart = [];
let inCartScreen = false;

const productsEl = document.getElementById("products");
const cartButton = document.getElementById("cartButton");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");
const checkoutButton = document.getElementById("checkoutButton");

const orderModal = document.getElementById("orderModal");
const orderClose = document.getElementById("orderClose");
const orderForm = document.getElementById("orderForm");
const orderSummary = document.getElementById("orderSummary");

// ================== ТОВАРЫ ==================
const products = [
  {id:1,name:"Браслет Hearts",price:4000},
  {id:2,name:"Колье Gothic Thorns",price:3600},
  {id:3,name:"Колье Pierced Chain",price:2500},
  {id:4,name:"Колье Starry Sky",price:4500},
  {id:5,name:"Кулон Moonlight",price:2000},
  {id:6,name:"Обвес Lighter",price:3600},
  {id:7,name:"Обвес Star",price:2000},
  {id:8,name:"Серьги Moonlight",price:2000},
];

// ================== ФУНКЦИИ ==================
function renderProducts(list){
  productsEl.innerHTML = "";
  list.forEach(p => {
    const card = document.createElement("div"); card.className = "product";
    const img = document.createElement("img"); img.src = p.image || ""; img.onclick = ()=>openModal(p);
    const title = document.createElement("h3"); title.textContent = p.name;
    const price = document.createElement("p"); price.textContent = `${p.price} ₽`;
    const cartItem = cart.find(i => i.product.id === p.id);
    const controls = document.createElement("div"); controls.className = "count-block";
    if(cartItem){
      const minus = document.createElement("button"); minus.textContent = "–"; minus.onclick = e=>{e.stopPropagation(); removeFromCart(p)};
      const count = document.createElement("div"); count.className="count-number"; count.textContent=cartItem.count;
      const plus = document.createElement("button"); plus.textContent = "+"; plus.onclick = e=>{e.stopPropagation(); addToCart(p)};
      controls.append(minus,count,plus);
    } else {
      const addBtn = document.createElement("button"); addBtn.className="add-btn"; addBtn.textContent="В корзину"; addBtn.onclick=e=>{e.stopPropagation(); addToCart(p)};
      controls.appendChild(addBtn);
    }
    card.append(img,title,price,controls);
    productsEl.appendChild(card);
  });
  updateCartUI();
}

function addToCart(product){const item=cart.find(i=>i.product.id===product.id); item?item.count++:cart.push({product,count:1}); renderProducts(products);}
function removeFromCart(product){const item=cart.find(i=>i.product.id===product.id); if(!item)return; item.count--; if(item.count===0) cart=cart.filter(i=>i.product.id!==product.id); renderProducts(products);}

function updateCartUI(){
  const totalCount = cart.reduce((s,i)=>s+i.count,0);
  const totalPrice = cart.reduce((s,i)=>s+i.count*i.product.price,0);
  cartCount.textContent = totalCount;
  cartTotal.textContent = totalPrice?`Итого: ${totalPrice} ₽`:"";
  checkoutButton.style.display = totalCount ? "block" : "none";
}

// ================== МОДАЛКА ==================
const modal = document.getElementById("modal");
const modalImage = document.getElementById("modalImage");
const modalTitle = document.getElementById("modalTitle");
const modalPrice = document.getElementById("modalPrice");
const modalDescription = document.getElementById("modalDescription");
const modalClose = document.getElementById("modalClose");

function openModal(p){
  modalImage.src=p.image||"";
  modalTitle.textContent=p.name;
  modalPrice.textContent = `${p.price} ₽`;
  modalDescription.innerHTML="";
  modal.style.display="flex";
}
modalClose.onclick = ()=>modal.style.display="none";
modal.onclick = e => {if(e.target===modal) modal.style.display="none";};

// ================== КОРЗИНА ==================
checkoutButton.onclick = () => {
  if(cart.length===0){alert("Корзина пуста!"); return;}
  orderModal.style.display="flex";
  orderSummary.textContent = cart.map(i=>`${i.product.name} x${i.count}`).join(", ");
};
orderClose.onclick = ()=>orderModal.style.display="none";

// ================== ФОРМА ==================
orderForm.onsubmit = e => {
  e.preventDefault();
  let invalid=false;
  orderForm.querySelectorAll("input, select").forEach(f=>{
    if(!f.value){ f.style.border="2px solid red"; invalid=true } else { f.style.border="none"; }
  });
  if(invalid){ alert("Заполните все поля!"); return; }

  const fd = new FormData(orderForm);
  const allItems = cart.map(i=> `${i.product.name} x${i.count}`).join(", ");
  const orderData = {
    fullname: fd.get("fullname"),
    address: fd.get("address"),
    delivery: fd.get("delivery"),
    phone: fd.get("phone"),
    your_order: allItems,
    total: cart.reduce((s,i)=>s+i.count*i.product.price,0)
  };

  emailjs.send("service_6drenuw","template_90b82bq",orderData)
    .then(()=>{alert("Заказ отправлен на почту!"); cart=[]; updateCartUI(); orderModal.style.display="none";})
    .catch(err=>alert("Ошибка отправки: "+err.text));
};

// ================== ПОИСК ==================
const searchInput = document.getElementById("searchInput");
searchInput.oninput = ()=>{const val=searchInput.value.toLowerCase(); renderProducts(products.filter(p=>p.name.toLowerCase().includes(val)));};

// ================== DaData ==================
$("#addressInput").suggestions({ token:"4563b9c9765a1a2d7bf39e1c8944f7fadae05970", type:"ADDRESS", hint:false });

// ================== СТАРТ ==================
renderProducts(products);
updateCartUI();
