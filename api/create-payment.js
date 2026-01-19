const res = await fetch("https://telegram-catalog-alpha.vercel.app/api/create-payment", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    amount: total,
    order_id: Date.now(),
    return_url: "https://telegram-catalog-alpha.vercel.app/?success=true"
  })
});
const json = await res.json();

if(json.payment_url){
    Telegram.WebApp.openLink(json.payment_url, { try_instant_view:false });
} else {
    alert("Ошибка оплаты");
}
