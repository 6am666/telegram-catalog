const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch"); // если node <18
const app = express();
app.use(cors());
app.use(express.json());

const SHOP_ID = "1247918";
const SECRET_KEY = "live_sknoU8MaroZz-p-CGg7oDNyKYFW4kdLKv6sgBeTeYcY";

app.post("/create-payment", async (req, res) => {
  const { amount, order_id } = req.body;

  const body = {
    amount: { value: amount.toString(), currency: "RUB" },
    confirmation: { type: "redirect", return_url: req.body.return_url },
    capture: true,
    description: `Заказ #${order_id}`,
  };

  const response = await fetch("https://api.yookassa.ru/v3/payments", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Basic " + Buffer.from(SHOP_ID + ":" + SECRET_KEY).toString("base64")
    },
    body: JSON.stringify(body)
  });

  const data = await response.json();
  res.json({ payment_url: data.confirmation?.confirmation_url });
});

app.listen(3000, () => console.log("Server started on port 3000"));

