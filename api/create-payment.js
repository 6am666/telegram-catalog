import crypto from "crypto";

export default async function handler(req, res) {
  // Разрешаем CORS для Mini App
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { amount, order_id, return_url } = req.body;

    if (!amount || !order_id || !return_url) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const shopId = "1247918"; // твой shopId YooKassa
    const secretKey = "live_Tm1kL9j1HluFO7DIxbZzD816Z9cHGMVX8G8REsTHcVQ"; // твой SecretKey

    const paymentAmount = Number(amount).toFixed(2);
    if (paymentAmount <= 0) {
      return res.status(400).json({ error: "Amount must be greater than zero" });
    }

    // Данные для платежа
    const paymentData = {
      amount: { value: paymentAmount, currency: "RUB" },
      confirmation: { type: "redirect", return_url },
      capture: true,
      description: `Заказ №${order_id}`,
      metadata: { order_id: order_id.toString() }
    };

    // Авторизация Basic
    const authHeader = Buffer.from(`${shopId}:${secretKey}`).toString("base64");

    // Создаём платеж через YooKassa API
    const response = await fetch("https://api.yookassa.ru/v3/payments", {
      method: "POST",
      headers: {
        "Authorization": `Basic ${authHeader}`,
        "Content-Type": "application/json",
        "Idempotence-Key": crypto.randomUUID() // уникальный ключ для повторных запросов
      },
      body: JSON.stringify(paymentData)
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("YooKassa error:", result);
      return res.status(response.status).json({ error: "YooKassa error", details: result });
    }

    if (!result.confirmation?.confirmation_url) {
      console.error("No confirmation URL:", result);
      return res.status(500).json({ error: "No confirmation URL returned", details: result });
    }

    // Возвращаем фронту рабочий URL для оплаты
    return res.status(200).json({ payment_url: result.confirmation.confirmation_url });

  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({ error: "Server error", message: err.message });
  }
}
