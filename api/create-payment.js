// api/create-payment.js

export default async function handler(req, res) {
  // Разрешаем только POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { amount, order_id, return_url } = req.body;

  // Проверка обязательных полей
  if (!amount || !order_id || !return_url) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const shopId = 1247918; // твой Shop ID
  const secretKey = "live_sknoU8MaroZz-p-CGg7oDNyKYFW4kdLKv6sgBeTeYcY"; // твой Secret Key

  // Форматируем сумму строго как строку с 2 знаками после запятой
  const paymentBody = {
    amount: { value: Number(amount).toFixed(2), currency: "RUB" },
    confirmation: { type: "redirect", return_url },
    capture: true,
    description: `Заказ №${order_id}`,
    metadata: { order_id: order_id.toString() }
  };

  try {
    // Создание платежа через YooKassa API
    const response = await fetch("https://api.yookassa.ru/v3/payments", {
      method: "POST",
      headers: {
        "Authorization": "Basic " + Buffer.from(`${shopId}:${secretKey}`).toString("base64"),
        "Content-Type": "application/json"
      },
      body: JSON.stringify(paymentBody)
    });

    // Пытаемся разобрать ответ
    const data = await response.json().catch(() => null);

    // Если статус не OK — логируем все детали
    if (!response.ok) {
      console.error("❌ YooKassa API Error:");
      console.error("Status:", response.status);
      console.error("Response body:", data);
      return res.status(500).json({
        error: "YooKassa error",
        status: response.status,
        details: data
      });
    }

    // Всё успешно — возвращаем ссылку на оплату
    res.status(200).json({ payment_url: data.confirmation.confirmation_url });

  } catch (err) {
    // Ловим ошибки сети или другие исключения
    console.error("❌ Server error while creating payment:", err);
    res.status(500).json({
      error: "Server error",
      details: err.message
    });
  }
}
