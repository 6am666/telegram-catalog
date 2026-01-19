module.exports = async function handler(req, res) {
  console.log("BODY:", req.body);
  console.log("ENV SECRET:", !!process.env.YOOKASSA_SECRET_KEY);

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { amount, order_id, return_url } = req.body;

    if (!amount || !order_id) {
      return res.status(400).json({ error: "Missing amount or order_id" });
    }

    const shopId = process.env.YOOKASSA_SHOP_ID;
    const secretKey = process.env.YOOKASSA_SECRET_KEY;

    if (!shopId || !secretKey) {
      return res.status(500).json({
        error: "YooKassa credentials missing",
        shopId: !!shopId,
        secretKey: !!secretKey
      });
    }

    const auth = Buffer.from(`${shopId}:${secretKey}`).toString("base64");

    const response = await fetch("https://api.yookassa.ru/v3/payments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Idempotence-Key": String(order_id),
        "Authorization": `Basic ${auth}`
      },
      body: JSON.stringify({
        amount: {
          value: amount.toFixed(2),
          currency: "RUB"
        },
        confirmation: {
          type: "redirect",
          return_url: return_url || "https://example.com"
        },
        capture: true,
        description: `Заказ #${order_id}`
      })
    });

    const text = await response.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      console.error("YooKassa non-JSON:", text);
      return res.status(500).json({
        error: "YooKassa returned non-JSON",
        raw: text
      });
    }

    if (!response.ok) {
      console.error("YooKassa error:", data);
      return res.status(500).json({
        error: "YooKassa API error",
        details: data
      });
    }

    return res.status(200).json({
      payment_id: data.id,
      payment_url: data.confirmation?.confirmation_url
    });

  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({
      error: "Server error",
      details: err.message
    });
  }
};
