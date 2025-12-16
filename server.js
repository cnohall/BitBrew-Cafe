import express from "express";
import cors from "cors";
import "dotenv/config";

const app = express();
const PORT = 3001;

// Allow requests from your React dev server
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

app.post("/new_address", async (req, res) => {
  try {
    const response = await fetch(
      `https://www.blockonomics.co/api/new_address?match_callback=http://localhost:3001/callback`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.BLOCKONOMICS_API_KEY}`,
          "Accept": "application/json"
        }
      }
    );

    if (!response.ok) {
      return res.status(response.status).json({ error: response.statusText });
    }

    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
