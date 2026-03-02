const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

// CONFIGURAÇÕES (adicione depois no Render como variáveis)
const EVOLUTION_URL = process.env.EVOLUTION_URL;
const API_KEY = process.env.EVOLUTION_API_KEY;
const INSTANCE = process.env.INSTANCE_NAME;

app.post("/webhook", async (req, res) => {
  try {
    const msg = req.body.data?.message?.conversation;
    const number = req.body.data?.key?.remoteJid?.replace("@s.whatsapp.net", "");

    if (!msg) return res.sendStatus(200);

    console.log("Mensagem recebida:", msg);

    const reply = "Olá! Recebi sua mensagem pelo webhook 🚀";

    await axios.post(
      `${EVOLUTION_URL}/message/sendText/${INSTANCE}`,
      {
        number,
        text: reply
      },
      {
        headers: { apikey: API_KEY }
      }
    );

    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

app.listen(3000, () => {
  console.log("Webhook rodando");
});