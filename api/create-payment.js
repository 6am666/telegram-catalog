import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { amount, order_id, return_url } = req.body;

  const shopId = "1247918";
  const secretKey = "live_sknoU8MaroZz-p-CGg7oDNyKYFW4kdLKv6sgBeTeY";

  try {
    const response = await fetch("https://api.yookassa.ru/v3/payments", {
      method: "POST",
      headers: {
        "Authorization": "Basic " + Buffer.from(shopId + ":" + secretKey).toString("base64"),
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        amount: { value: amount.toString(), currency: "RUB" },
        confirmation: { type: "redirect", return_url },
        capture: true,
        description: "Заказ " + order_id
      })
    });

    const data = await response.json();
    res.status(200).json({ payment_url: data.confirmation?.confirmation_url || null });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Ошибка сервера" });
  }
}

