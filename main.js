// ================== ИНИЦИАЛИЗАЦИЯ ==================
let cart = [];
let inCartScreen = false;
let currentCategory = "Главная";
let isSubmitting = false;

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

// ================== ТОВАРЫ ==================
const products = [
  {id:1,name:"Браслет Hearts",price:4000,image:"https://i.pinimg.com/736x/d4/c5/4c/d4c54cd9c489d1e73d9e306545929b70.jpg",category:"Браслеты",description:["Материал изделия:","Хирургическая сталь;"]},
  {id:2,name:"Колье Gothic Thorns",price:3600,image:"https://i.pinimg.com/736x/c2/0d/26/c20d26fb9839c64d328f8989450f547b.jpg",category:"Колье",description:["Материал изделия:","Атласная лента;"]},
  {id:3,name:"Колье Pierced Chain",price:2500,image:"https://i.pinimg.com/736x/37/0b/db/370bdb870346b42b1000610195261f62.jpg",category:"Колье",description:["Нержавеющая сталь"]},
  {id:4,name:"Колье Starry Sky",price:4500,image:"https://i.pinimg.com/736x/55/bf/ec/55bfecc3c2ceebf20752ff2802ff4e19.jpg",category:"Колье",description:["Хирургическая сталь"]},
  {id:5,name:"Кулон Moonlight",price:2000,image:"https://i.pinimg.com/736x/5a/6d/1b/5a6d1beecdc7b79798705e4da0ef3a5c.jpg",category:"Кулоны",description:["Лунная бусина"]},
];

// ================== ФОРМА ==================
orderForm.innerHTML = `
<label>ФИО</label><input name="fullname" required>
<label>Адрес</label><input name="address" required>
<label>Доставка</label>
<select name="delivery" id="deliverySelect" required>
  <option value="" disabled selected>Выберите</option>
  <option value="СДЭК">СДЭК — 450₽</option>
  <option value="Почта России">Почта России — 550₽</option>
  <option value="Самовывоз">Самовывоз</option>
</select>
<label>Телефон</label><input name="phone" required>
<label>Telegram</label><input name="telegram" required>
<div id="orderSum">Итого: 0 ₽</div>
<button type="submit">Оплатить</button>
`;

// ================== ГАМБУРГЕР ==================
menuIcon.onclick = () => categories.classList.toggle("show");
categories.querySelectorAll("div").forEach(cat => {
  cat.onclick = () => {
    currentCategory = cat.dataset.category;
    inCartScreen = false;
    document.body.classList.remove("cart-mode");
    renderProducts(getCurrentList());
    categories.classList.remove("show");
  };
});

// ================== СУММА ==================
const deliverySelectEl = document.getElementById("deliverySelect");
const orderSumEl = document.getElementById("orderSum");

function updateOrderSum(){
  let total = cart.reduce((s,i)=>s+i.count*i.product.price,0);
  if(deliverySelectEl.value === "СДЭК") total += 450;
  if(deliverySelectEl.value === "Почта России") total += 550;
  orderSumEl.textContent = "Итого: " + total + " ₽";
}
deliverySelectEl.onchange = updateOrderSum;

// ================== КОРЗИНА ==================
cartButton.onclick = () => {
  inCartScreen = true;
  document.body.classList.add("cart-mode");
  renderProducts(cart.map(i=>i.product));
};

mainTitle.onclick = () => {
  inCartScreen = false;
  document.body.classList.remove("cart-mode");
  currentCategory = "Главная";
  renderProducts(products);
};

// ================== ОФОРМЛЕНИЕ ЗАКАЗА ==================
checkoutButton.onclick = () => {
  if(!cart.length) return alert("Корзина пуста");
  orderModal.style.display = "flex";
  updateOrderSum();
};

orderClose.onclick = () => orderModal.style.display = "none";
orderModal.onclick = e => { if(e.target === orderModal) orderModal.style.display = "none"; };

// ================== ОПЛАТА ==================
orderForm.addEventListener("submit", async e => {
  e.preventDefault();
  if(isSubmitting || !cart.length) return;
  isSubmitting = true;

  let total = cart.reduce((s,i)=>s+i.count*i.product.price,0);
  if(deliverySelectEl.value === "СДЭК") total += 450;
  if(deliverySelectEl.value === "Почта России") total += 550;

  try {
    const res = await fetch(
      "https://telegram-catalog-alpha.vercel.app/api/create-payment",
      {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          amount: total,
          order_id: Date.now(),
          return_url: "https://telegram-catalog-alpha.vercel.app/?success=true"
        })
      }
    );

    const json = await res.json();
    if(!json.payment_url) throw new Error();

    Telegram.WebApp.openLink(json.payment_url);

  } catch {
    alert("Ошибка оплаты");
  } finally {
    isSubmitting = false;
  }
});

// ================== РЕНДЕР ==================
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
    price.textContent=p.price+" ₽";

    const controls=document.createElement("div");
    controls.className="count-block";

    const item=cart.find(i=>i.product.id===p.id);
    if(item){
      const minus=document.createElement("button");
      minus.textContent="–";
      minus.onclick=e=>{e.stopPropagation();removeFromCart(p)};
      const count=document.createElement("div");
      count.textContent=item.count;
      const plus=document.createElement("button");
      plus.textContent="+";
      plus.onclick=e=>{e.stopPropagation();addToCart(p)};
      controls.append(minus,count,plus);
    } else {
      const btn=document.createElement("button");
      btn.textContent="В корзину";
      btn.onclick=e=>{e.stopPropagation();addToCart(p)};
      controls.append(btn);
    }

    card.append(img,title,price,controls);
    productsEl.appendChild(card);
  });
  updateCartUI();
}

// ================== UI КОРЗИНЫ ==================
function updateCartUI(){
  const c = cart.reduce((s,i)=>s+i.count,0);
  const t = cart.reduce((s,i)=>s+i.count*i.product.price,0);

  cartCount.textContent = c;
  cartTotal.textContent = t ? "Итого: "+t+" ₽" : "";

  checkoutButton.style.display = c && inCartScreen ? "block" : "none";
  footerButtons.style.display = inCartScreen ? "none" : "flex";
  searchInput.style.display = inCartScreen ? "none" : "block";

  updateOrderSum();
}

// ================== HELPERS ==================
function addToCart(p){
  const i=cart.find(x=>x.product.id===p.id);
  i?i.count++:cart.push({product:p,count:1});
  renderProducts(getCurrentList());
}
function removeFromCart(p){
  const i=cart.find(x=>x.product.id===p.id);
  if(!i) return;
  i.count--;
  if(!i.count) cart=cart.filter(x=>x!==i);
  renderProducts(getCurrentList());
}
function getCurrentList(){
  if(inCartScreen) return cart.map(i=>i.product);
  if(currentCategory==="Главная") return products;
  return products.filter(p=>p.category===currentCategory);
}

// ================== МОДАЛКА ==================
function openModal(p){
  modalImage.src=p.image;
  modalTitle.textContent=p.name;
  modalPrice.textContent=p.price+" ₽";
  modalDescription.innerHTML=p.description.join("<br>");
  modal.style.display="flex";
}
modalClose.onclick=()=>modal.style.display="none";
modal.onclick=e=>{if(e.target===modal) modal.style.display="none";}

// ================== СТАРТ ==================
renderProducts(products);
updateCartUI();
