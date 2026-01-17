// api/create-payment.js
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { amount, order_id, return_url } = req.body;

  if (!amount || !order_id || !return_url) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const shopId = 1247918;
  const secretKey = "live_Tm1kL9j1HluFO7DIxbZzD816Z9cHGMVX8G8REsTHcVQ";

  // Преобразуем сумму в строку с двумя знаками после запятой
  const amountValue = Number(amount).toFixed(2);

  const body = {
    amount: { value: amountValue, currency: "RUB" },
    confirmation: { type: "redirect", return_url },
    capture: true,
    description: `Заказ №${order_id}`,
    metadata: { order_id: order_id.toString() }
  };

  try {
    const response = await fetch("https://api.yookassa.ru/v3/payments", {
      method: "POST",
      headers: {
        "Authorization": "Basic " + Buffer.from(`${shopId}:${secretKey}`).toString("base64"),
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    const text = await response.text(); // читаем текст
    let data;
    try {
      data = JSON.parse(text);
    } catch (err) {
      console.error("YooKassa returned non-JSON response:", text);
      return res.status(500).json({ error: "Invalid JSON from YooKassa", details: text });
    }

    if (!response.ok) {
      console.error("YooKassa error:", data);
      return res.status(500).json({ error: "YooKassa error", details: data });
    }

    console.log("YooKassa payment created:", data);

    res.status(200).json({ payment_url: data.confirmation.confirmation_url });

  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
};
