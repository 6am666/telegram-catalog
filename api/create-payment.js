// api/create-payment.js
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { amount, order_id, return_url } = req.body;

  if (!amount || !order_id || !return_url) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const shopId = 1247918; // твой Shop ID
  const secretKey = "live_sknoU8MaroZz-p-CGg7oDNyKYFW4kdLKv6sgBeTeYcY"; // секретный ключ

  const body = {
    amount: { value: Number(amount).toFixed(2), currency: "RUB" }, // важно: 2 знака после запятой
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

    const data = await response.json();

    if (!response.ok) {
      console.error("YooKassa error:", data);
      return res.status(500).json({
        error: "YooKassa error",
        details: data
      });
    }

    res.status(200).json({ payment_url: data.confirmation.confirmation_url });

  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({
      error: "Server error",
      details: err.message
    });
  }
}
