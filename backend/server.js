import express from "express";
import cors from "cors";
import "dotenv/config";

const app = express();
const PORT = 3001;

// In-memory storage for orders (use a database in production)
const orders = new Map();

// Allow requests from your React dev server
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

// Generate new Bitcoin address for payment
app.post("/new_address", async (req, res) => {
  try {
    // Important: All parameters must be in the URL query string
    // match_callback: matches the callback URL you configured in Blockonomics
    // crypto: specifies BTC (required if you have multiple currencies)
    // reset: 1 for testing (reuses same address), remove for production
    const response = await fetch(
      "https://www.blockonomics.co/api/new_address?match_callback=localhost:3001/callback&crypto=BTC",
      {
        method: "POST",
        headers: {
          "accept": "application/json",
          "authorization": `Bearer ${process.env.BLOCKONOMICS_API_KEY}`
        }
        // No body needed - all params are in URL
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
        details: response.statusText
      });
    }

    const data = JSON.parse(responseText);
    
    // Initialize order status for this address
    orders.set(data.address, {
      address: data.address,
      status: 'pending', // pending, paid, confirmed
      txid: null,
      value: null,
      confirmations: 0,
      createdAt: new Date()
    });

    console.log("✅ New address generated:", data.address);
    res.json(data);
  } catch (err) {
    console.error("❌ Error generating address:", err);
    res.status(500).json({ error: err.message });
  }
});

// Blockonomics callback endpoint
app.post("/callback", (req, res) => {
  console.log("📨 Received callback from Blockonomics:", req.body);
  
  const { addr, status, value, txid } = req.body;
  
  // Get the order for this address
  const order = orders.get(addr);
  
  if (!order) {
    console.log("⚠️ Order not found for address:", addr);
    return res.status(404).json({ error: "Order not found" });
  }

  // Update order based on payment status
  // Status 0: Unconfirmed (payment detected)
  // Status 1: Partially confirmed
  // Status 2: Confirmed (2+ confirmations)
  
  order.txid = txid;
  order.value = value;
  order.confirmations = status;
  
  if (status === 0) {
    order.status = 'paid'; // Payment detected but unconfirmed
    console.log("💰 Payment detected (unconfirmed)");
  } else if (status >= 2) {
    order.status = 'confirmed'; // Payment confirmed
    console.log("✅ Payment confirmed!");
  } else {
    console.log("🔄 Payment confirming...");
  }
  
  orders.set(addr, order);
  
  console.log("📝 Order updated:", order);
  res.json({ success: true });
});

// Check order status (frontend polls this)
app.get("/order_status/:address", (req, res) => {
  const { address } = req.params;
  const order = orders.get(address);
  
  if (!order) {
    return res.status(404).json({ error: "Order not found" });
  }
  
  res.json(order);
});

// Health check
app.get("/health", (req, res) => {
  res.json({ 
    status: "ok", 
    orders: orders.size,
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
  console.log(`📞 Callback URL: http://localhost:${PORT}/callback`);
  console.log(`💡 Make sure to set this as your callback URL in Blockonomics settings`);
  console.log(`🔑 API Key loaded: ${process.env.BLOCKONOMICS_API_KEY ? '✅' : '❌'}`);
});