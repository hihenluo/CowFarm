import express from "express";
import cors from "cors";
import { getSignature } from "./claim-sign";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/claim-sign", async (req, res) => {
  const { address, referralCode, fid } = req.body;

  if (!address || !referralCode || typeof fid !== "number") {
    return res.status(400).json({ error: "Missing address, referralCode or fid" });
  }

  try {
    const signature = await getSignature(address, referralCode, fid);
    return res.json({ signature });
  } catch (err: any) {
    console.error("Error signing claim:", err.message);
    return res.status(500).json({ error: "Signature generation failed" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Backend listening on http://localhost:${PORT}`);
});
