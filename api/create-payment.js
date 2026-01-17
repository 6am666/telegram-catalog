import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { amount, order_id, return_url } = req.body;

  if (!amount || !order_id || !return_url) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const shopId = 1247918; // твой shopId
  const secretKey = "live_sknoU8MaroZz-p-CGg7oDNyKYFW4kdLKv6sgBeTeYcY";

  const body = {
    amount: { value: amount.toString(), currency: "RUB" },
    confirmation: { type: "redirect", return_url },
    capture: true,
    description: `Заказ №${order_id}`,
    metadata: { order_id: order_id.toString() }
  };

  try {
    const response = await fetch(`https://api.yookassa.ru/v3/payments`, {
      method: "POST",
      headers: {
        "Authorization": "Basic " + Buffer.from(`${shopId}:${secretKey}`).toString("base64"),
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("YooKassa error:", errText);
      return res.status(500).json({ error: "YooKassa error", details: errText });
    }

    const data = await response.json();
    res.status(200).json({ payment_url: data.confirmation.confirmation_url });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
}
