// /api/create-payment.js
import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { amount, order_id, return_url } = req.body;

    if (!amount || !order_id || !return_url) {
      return res.status(400).json({ error: "Missing fields" });
    }

    // === Настройки магазина ===
    const shopId = 1247918; // твой shopId
    const secretKey = live_Tm1kL9j1HluFO7DIxbZzD816Z9cHGMVX8G8REsTHcVQ; // хранится в Vercel env

    if (!secretKey) {
      console.error("YOOKASSA_SECRET_KEY is not set in environment");
      return res.status(500).json({ error: "Server misconfiguration" });
    }

    const body = {
      amount: { value: amount.toFixed(2), currency: "RUB" },
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

    const data = await response.json();

    if (!response.ok) {
      console.error("YooKassa API error:", data);
      return res.status(500).json({ error: "YooKassa API error", details: data });
    }

    if (!data.confirmation || !data.confirmation.confirmation_url) {
      console.error("No confirmation URL in response:", data);
      return res.status(500).json({ error: "No confirmation URL", details: data });
    }

    console.log("YooKassa payment created:", data.id);

    res.status(200).json({ payment_url: data.confirmation.confirmation_url });

  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
}
