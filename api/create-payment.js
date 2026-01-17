// api/create-payment.js
import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { amount, order_id, return_url } = req.body;

  const shopId = "1247918";
  const secretKey = "live_sknoU8MaroZz-p-CGg7oDNyKYFW4kdLKv6sgBeTeYcY";

  try {
    const response = await fetch("https://api.yookassa.ru/v3/payments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Basic " + Buffer.from(`${shopId}:${secretKey}`).toString("base64")
      },
      body: JSON.stringify({
        amount: {
          value: amount.toFixed(2),
          currency: "RUB"
        },
        confirmation: {
          type: "redirect",
          return_url
        },
        capture: true,
        description: `Заказ #${order_id}`
      })
    });

    const data = await response.json();

    if (data.confirmation && data.confirmation.confirmation_url) {
      return res.status(200).json({ payment_url: data.confirmation.confirmation_url });
    } else {
      return res.status(500).json({ error: "Ошибка создания платежа", data });
    }

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Серверная ошибка", details: err.message });
  }
}
