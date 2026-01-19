// api/create-payment.js
import crypto from "crypto";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { amount, order_id, return_url } = req.body;

    if (!amount || !order_id || !return_url) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // ====== НАСТРОЙКИ YOOKASSA ======
    const shopId = "1247918";
    const secretKey = "live_Tm1kL9j1HluFO7DIxbZzD816Z9cHGMVX8G8REsTHcVQ";

    if (!secretKey) {
      return res.status(500).json({ error: "YooKassa secret key not set" });
    }

    // YooKassa требует строку "0.00"
    const paymentAmount = Number(amount).toFixed(2);

    const paymentData = {
      amount: {
        value: paymentAmount,
        currency: "RUB"
      },
      confirmation: {
        type: "redirect",
        return_url: return_url
      },
      capture: true,
      description: `Заказ №${order_id}`,
      metadata: {
        order_id: order_id.toString()
      }
    };

    const authHeader = Buffer.from(`${shopId}:${secretKey}`).toString("base64");

    const response = await fetch("https://api.yookassa.ru/v3/payments", {
      method: "POST",
      headers: {
        "Authorization": `Basic ${authHeader}`,
        "Content-Type": "application/json",
        "Idempotence-Key": crypto.randomUUID()
      },
      body: JSON.stringify(paymentData)
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("YooKassa API error:", result);
      return res.status(500).json({
        error: "YooKassa error",
        details: result
      });
    }

    if (!result.confirmation?.confirmation_url) {
      console.error("No confirmation_url:", result);
      return res.status(500).json({
        error: "No confirmation URL returned",
        result
      });
    }

    return res.status(200).json({
      payment_url: result.confirmation.confirmation_url
    });

  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({
      error: "Server error",
      message: error.message
    });
  }
}


