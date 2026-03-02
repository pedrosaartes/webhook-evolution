const express = require("express")
const axios = require("axios")
const { GoogleGenerativeAI } = require("@google/generative-ai")

const app = express()
app.use(express.json())

// 🔑 SUA CHAVE DO AI STUDIO
const genAI = new GoogleGenerativeAI("AIzaSyDGLkbLFxE_7r3qPq9jB5Nmvc6el8itoQg")
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

// 📱 DADOS DA EVOLUTION
const EVOLUTION_URL = "https://evolution-api-tvfe.onrender.com/"
const API_KEY = "205EF40FAC42-4C6A-BC6C-357874663A34"
const INSTANCE = "bot1"

// 🌐 ROTA PRINCIPAL
app.get("/", (req, res) => {
  res.send("Bot IA online 🤖")
})

// 📩 WEBHOOK DA EVOLUTION
app.post("/webhook", async (req, res) => {
  try {
    const message = req.body.data?.message?.conversation
    const from = req.body.data?.key?.remoteJid

    if (!message) return res.sendStatus(200)

    console.log("Mensagem:", message)

    // 🤖 Pergunta para a IA
    const result = await model.generateContent(message)
    const resposta = result.response.text()

    console.log("Resposta IA:", resposta)

    // 📤 Enviar resposta via Evolution
    await axios.post(
      `${EVOLUTION_URL}/message/sendText/${INSTANCE}`,
      {
        number: from,
        text: resposta
      },
      {
        headers: {
          apikey: API_KEY
        }
      }
    )

    res.sendStatus(200)

  } catch (error) {
    console.error(error)
    res.sendStatus(500)
  }
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log("Bot rodando 🚀"))
