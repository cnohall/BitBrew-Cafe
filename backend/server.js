import express from "express";
import cors from "cors";
import "dotenv/config";
import db from "./db.js";

const app = express();
const PORT = 3001;

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());



// 2.5. Monitor USDT Transaction (new endpoint)
app.post("/monitor_usdt_transaction", async (req, res) => {
  try {
    const { txhash, usdtAddress } = req.body;

    if (!txhash || !usdtAddress) {
      return res.status(400).json({ error: "Missing txhash or usdtAddress" });
    }

    // Create order if it doesn't exist yet
    try {
      await db.createOrder(usdtAddress);
    } catch (createErr) {
      if (!createErr.message.includes("UNIQUE constraint failed")) {
        throw createErr;
      }
    }

    // Store the txhash in our DB as txid (matches Blockonomics callback field name)
    await db.updateOrder(usdtAddress, { txid: txhash });

    // Submit to Blockonomics for monitoring
    const response = await fetch("https://www.blockonomics.co/api/monitor_tx", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.BLOCKONOMICS_API_KEY}`,
      },
      body: JSON.stringify({
        txhash,
        crypto: "USDT",
        match_callback: "ngrok-free", // Must match part of your Store callback URL in Blockonomics dashboard
        testnet: 1, // 0 for mainnet, 1 for Sepolia testnet
      }),
    });

    const responseText = await response.text();
    console.log("Blockonomics Monitor TX Response:", response.status, responseText);

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

    console.log("Monitor TX registered successfully");
    res.json({ success: true, message: "Transaction monitoring initiated" });
  } catch (err) {
    console.error("Error monitoring USDT transaction:", err);
    res.status(500).json({ error: err.message });
  }
});

// 2. Blockonomics Callback (Updated to async)
app.get("/callback", async (req, res) => {
  // Changed req.body to req.query for GET requests
  console.log("Received callback from Blockonomics:", req.query);

  const { addr, status, value, txid } = req.query;

  // ADDED AWAIT
  const order = await db.getOrder(addr);

  if (!order) {
    console.log("Order not found for address:", addr);
    return res.status(404).json({ error: "Order not found" });
  }

  let orderStatus = "pending";
  // Note: Ensure 'status' is treated as a number, as query params are strings by default
  const statusInt = parseInt(status, 10); 

  if (statusInt === 0) {
    orderStatus = "paid";
    console.log("Payment detected (unconfirmed)");
  } else if (statusInt >= 2) {
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
    confirmations: statusInt,
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