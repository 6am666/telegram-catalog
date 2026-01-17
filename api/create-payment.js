import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { amount, order_id, return_url } = req.body;

  if (!amount || !order_id || !return_url) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const shopId = 1247918;
  const secretKey = "live_Tm1kL9j1HluFO7DIxbZzD816Z9cHGMVX8G8REsTHcVQ";

  const paymentBody = {
    amount: { value: Number(amount).toFixed(2), currency: "RUB" },
    confirmation: { type: "redirect", return_url },
    capture: true,
    description: `Заказ №${order_id}`,
    metadata: { order_id: order_id.toString() }
  };

  console.log("Создаём платеж в YooKassa:", paymentBody);

  try {
    const response = await fetch("https://api.yookassa.ru/v3/payments", {
      method: "POST",
      headers: {
        "Authorization": "Basic " + Buffer.from(`${shopId}:${secretKey}`).toString("base64"),
        "Content-Type": "application/json"
      },
      body: JSON.stringify(paymentBody)
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      console.error("❌ YooKassa API Error:", data);
      return res.status(500).json({
        error: "YooKassa error",
        status: response.status,
        details: data
      });
    }

    res.status(200).json({ payment_url: data.confirmation.confirmation_url });

  } catch (err) {
    console.error("❌ Server error while creating payment:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
}
