import fetch from "node-fetch";
import crypto from "crypto";

export default async function handler(req, res) {
  // ===== CORS (на всякий случай) =====
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  console.log("BODY:", req.body);
  console.log("ENV SECRET EXISTS:", !!process.env.YOOKASSA_SECRET_KEY);

  try {
    const { amount, order_id, return_url } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    const shopId = process.env.YOOKASSA_SHOP_ID;
    const secretKey = process.env.YOOKASSA_SECRET_KEY;

    if (!shopId || !secretKey) {
      return res.status(500).json({ error: "YooKassa keys not set" });
    }

    const idempotenceKey = crypto.randomUUID();

    const payload = {
      amount: {
        value: amount.toFixed(2),
        currency: "RUB"
      },
      confirmation: {
        type: "redirect",
        return_url: return_url || "https://google.com"
      },
      capture: true,
      description: `Заказ #${order_id || Date.now()}`
    };

    const auth = Buffer.from(`${shopId}:${secretKey}`).toString("base64");

    const ykRes = await fetch("https://api.yookassa.ru/v3/payments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${auth}`,
        "Idempotence-Key": idempotenceKey
      },
      body: JSON.stringify(payload)
    });

    const ykData = await ykRes.json();

    console.log("YooKassa response:", ykData);

    if (!ykRes.ok) {
      return res.status(500).json({
        error: "YooKassa error",
        details: ykData
      });
    }

    const paymentUrl = ykData?.confirmation?.confirmation_url;

    if (!paymentUrl) {
      return res.status(500).json({
        error: "No confirmation_url",
        details: ykData
      });
    }

    // ===== ВОТ ЕДИНСТВЕННО ЧТО НУЖНО MINI APP =====
    return res.status(200).json({
      payment_url: paymentUrl
    });

  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({
      error: "Server error",
      message: err.message
    });
  }
}
