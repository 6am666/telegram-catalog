export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { amount, order_id, return_url } = req.body;

  const SHOP_ID = "1247918";
  const SECRET_KEY = "live_sknoU8MaroZz-p-CGg7oDNyKYFW4kdLKv6sgBeTeYcY";

  const response = await fetch("https://api.yookassa.ru/v3/payments", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization":
        "Basic " + Buffer.from(`${SHOP_ID}:${SECRET_KEY}`).toString("base64"),
      "Idempotence-Key": order_id.toString()
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

  if (!data.confirmation) {
    return res.status(500).json({ error: data });
  }

  res.json({ payment_url: data.confirmation.confirmation_url });
}
