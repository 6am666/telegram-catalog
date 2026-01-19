document.addEventListener("DOMContentLoaded", async () => {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  const orderData = JSON.parse(localStorage.getItem("orderData") || "{}");

  if(!cart.length || !orderData.total){
    document.body.innerHTML = "<h2>Корзина пуста или данные заказа отсутствуют</h2>";
    return;
  }

  try{
    const res = await fetch("/api/create-payment", {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({
        amount: orderData.total,
        order_id: Date.now(),
        return_url: window.location.origin + "/success.html"
      })
    });

    const json = await res.json();

    if(json.payment_url){
      window.location.href = json.payment_url; // редирект на YooKassa
    } else {
      document.body.innerHTML = "<h2>Ошибка создания оплаты</h2>";
      console.error(json);
    }
  } catch(err){
    document.body.innerHTML = "<h2>Ошибка при оплате</h2>";
    console.error(err);
  }
});
