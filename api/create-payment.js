// Для Vercel используем динамический fetch, без require/import
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { amount, order_id, return_url } = req.body;
    if (!amount || !order_id || !return_url) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const shopId = 1247918; // твой shopId
    const secretKey = "live_Tm1kL9j1HluFO7DIxbZzD816Z9cHGMVX8G8REsTHcVQ";

    const body = {
      amount: { value: amount.toString(), currency: "RUB" },
      confirmation: { type: "redirect", return_url },
      capture: true,
      description: `Заказ №${order_id}`,
      metadata: { order_id: order_id.toString() }
    };

    const response = await fetch("https://api.yookassa.ru/v3/payments", {
      method: "POST",
      headers: {
        "Authorization": "Basic " + Buffer.from(`${shopId}:${secretKey}`).toString("base64"),
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    const text = await response.text();
    let data;
    try { data = JSON.parse(text); } 
    catch(err) { 
      console.error("YooKassa invalid JSON:", text); 
      return res.status(500).json({ error: "Invalid JSON from YooKassa", details: text }); 
    }

    if (!response.ok) {
      console.error("YooKassa error:", data);
      return res.status(500).json({ error: "YooKassa error", details: data });
    }

    // Возвращаем ссылку на оплату
    return res.status(200).json({ payment_url: data.confirmation.confirmation_url });

  } catch(err) {
    console.error("Server error:", err);
    return res.status(500).json({ error: "Server error", details: err.message });
  }
}
