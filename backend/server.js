import express from "express";
import cors from "cors";
import "dotenv/config";
import db from "./db.js";

const app = express();
const PORT = 3001;

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

// 1. Generate new address and create order
app.post("/new_address", async (req, res) => {
  try {
    const response = await fetch(
      "https://www.blockonomics.co/api/new_address?match_callback=localhost:3001/callback&crypto=BTC",
      {
        method: "POST",
        headers: {
          accept: "application/json",
          authorization: `Bearer ${process.env.BLOCKONOMICS_API_KEY}`,
        },
      }
    );

    const responseText = await response.text();
    console.log("Blockonomics Response:", response.status, responseText);

    if (!response.ok) {
      let errorMsg = responseText;
      try {
        const errorData = JSON.parse(responseText);
        errorMsg = errorData.message || errorMsg;
      } catch (e) {}

      return res.status(response.status).json({
        error: errorMsg,
        details: response.statusText,
      });
    }

    const data = JSON.parse(responseText);

    // ADDED AWAIT: Database call is now a Promise
    await db.createOrder(data.address);

    console.log("New address generated:", data.address);
    res.json(data);
  } catch (err) {
    console.error("Error generating address:", err);
    res.status(500).json({ error: err.message });
  }
});

// 2. Blockonomics Callback (Updated to async)
app.post("/callback", async (req, res) => {
  console.log("Received callback from Blockonomics:", req.body);

  const { addr, status, value, txid } = req.body;

  // ADDED AWAIT
  const order = await db.getOrder(addr);

  if (!order) {
    console.log("Order not found for address:", addr);
    return res.status(404).json({ error: "Order not found" });
  }

  let orderStatus = "pending";
  if (status === 0) {
    orderStatus = "paid";
    console.log("Payment detected (unconfirmed)");
  } else if (status >= 2) {
    orderStatus = "confirmed";
    console.log("Payment confirmed");
  } else {
    console.log("Payment confirming...");
  }

  // ADDED AWAIT
  await db.updateOrder(addr, {
    status: orderStatus,
    txid,
    value,
    confirmations: status,
  });

  console.log("Order updated");
  res.json({ success: true });
});

// 3. Get Order Status (Updated to async)
app.get("/order_status/:address", async (req, res) => {
  try {
    const { address } = req.params;
    // ADDED AWAIT
    const order = await db.getOrder(address);

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Health Check (Updated to async)
app.get("/health", async (req, res) => {
  try {
    // ADDED AWAIT
    const count = await db.getOrderCount();
    res.json({
      status: "ok",
      orders: count,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
  console.log(`Callback URL: http://localhost:${PORT}/callback`);
  console.log(`API Key loaded: ${process.env.BLOCKONOMICS_API_KEY ? "Yes" : "No"}`);
});