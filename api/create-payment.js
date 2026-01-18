// api/create-payment.js
const fetch = require("node-fetch");

module.exports = async function handler(req, res) {
  // Логируем тело запроса и наличие секретного ключа
  console.log("BODY:", req.body);
  console.log("ENV SECRET:", !!process.env.YOOKASSA_SECRET_KEY);

  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { amount, order_id, return_url } = req.body;

    if (!amount || !order_id || !return_url) {
      return res.status(400).json({ error: "Missing fields" });
    }

    // ====== Настройки магазина ======
    const shopId = 1247918;
    // Для теста можно оставить прямо здесь, в продакшене лучше через Environment Variable
    const secretKey = process.env.YOOKASSA_SECRET_KEY || "live_Tm1kL9j1HluFO7DIxbZzD816Z9cHGMVX8G8REsTHcVQ";

    // Тело запроса на YooKassa
    const body = {
      amount: { value: amount.toString(), currency: "RUB" },
      confirmation: { type: "redirect", return_url },
      capture: true,
      description: `Заказ №${order_id}`,
      metadata: { order_id: order_id.toString() }
    };

    console.log("YooKassa body:", JSON.stringify(body));

    const response = await fetch("https://api.yookassa.ru/v3/payments", {
      method: "POST",
      headers: {
        "Authorization": "Basic " + Buffer.from(`${shopId}:${secretKey}`).toString("base64"),
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    const text = await response.text();

    if (!response.ok) {
      console.error("YooKassa error:", text);
      return res.status(500).json({ error: "YooKassa error", details: text });
    }

    const data = JSON.parse(text);

    if (!data.confirmation || !data.confirmation.confirmation_url) {
      console.error("No confirmation URL in YooKassa response:", data);
      return res.status(500).json({ error: "Invalid YooKassa response", data });
    }

    console.log("YooKassa payment URL:", data.confirmation.confirmation_url);

    return res.status(200).json({ payment_url: data.confirmation.confirmation_url });

  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({ error: "Server error", details: err.message });
  }
};
