import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { amount, order_id, return_url } = req.body;

  const response = await fetch("https://api.yookassa.ru/v3/payments", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Basic " + Buffer.from("1247918:live_sknoU8MaroZz-p-CGg7oDNyKYFW4kdLKv6sgBeTeYcY").toString("base64")
    },
    body: JSON.stringify({
      amount: { value: amount.toString(), currency: "RUB" },
      payment_method_data: { type: "bank_card" },
      capture: true,
      confirmation: { type: "redirect", return_url },
      description: "Заказ #" + order_id
    })
  });

  const data = await response.json();
  res.status(200).json({ payment_url: data.confirmation?.confirmation_url || null });
}
