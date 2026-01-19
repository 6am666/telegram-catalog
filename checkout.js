// Проверка Mini App
if(!window.Telegram || !window.Telegram.WebApp){
  alert("Этот раздел работает только внутри Telegram Mini App");
}

// Берём данные заказа из localStorage
const orderData = JSON.parse(localStorage.getItem("orderData"));

if(!orderData || !orderData.products || !orderData.products.length){
  alert("Корзина пуста или данные заказа отсутствуют");
  window.location.href = "index.html";
}

const checkoutInfo = document.getElementById("checkoutInfo");
checkoutInfo.textContent = "Создаём платёж...";

(async function(){
  try{
    const res = await fetch("/api/create-payment", {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body: JSON.stringify({
        amount: orderData.total,
        order_id: Date.now(),
        return_url: window.location.origin + "/success.html"
      })
    });

    const json = await res.json();
    if(json.payment_url){
      checkoutInfo.textContent = "Переходим к оплате...";
      // Mini App открывает ссылку
      if(window.Telegram.WebApp && typeof window.Telegram.WebApp.openLink === "function"){
        window.Telegram.WebApp.openLink(json.payment_url, { try_instant_view:false });
      } else {
        window.location.href = json.payment_url;
      }
    } else {
      checkoutInfo.textContent = "Ошибка создания оплаты";
      console.error(json);
    }

  } catch(err){
    checkoutInfo.textContent = "Ошибка сервера при оплате";
    console.error(err);
  }
})();
