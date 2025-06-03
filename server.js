require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors({
  origin: '*', // Разрешаем все источники для Figma плагинов
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.static('public'));

// API endpoint для чата
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Сообщение не может быть пустым' });
    }

    const response = await fetch('https://api.langdock.com/anthropic/eu/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2025-02-19'
      },
      body: JSON.stringify({
        model: 'claude-3-7-sonnet-20250219',
        max_tokens: 1000,
        messages: [
          {
            role: 'user',
            content: message
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const reply = data.content[0].text;

    res.json({ reply });
  } catch (error) {
    console.error('Ошибка при обращении к API:', error);
    res.status(500).json({ 
      error: 'Произошла ошибка при обработке запроса',
      reply: 'Извините, произошла ошибка. Попробуйте еще раз.'
    });
  }
});

// API endpoint для Figma плагина (без необходимости передавать API ключ)
app.post('/api/figma-chat', async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Сообщение не может быть пустым' });
    }

    // Используем API ключ из переменных окружения
    const response = await fetch('https://api.langdock.com/anthropic/eu/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2025-02-19'
      },
      body: JSON.stringify({
        model: 'claude-3-7-sonnet-20250219',
        max_tokens: 1000,
        messages: [
          {
            role: 'user',
            content: message
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const reply = data.content[0].text;

    res.json({ reply });
  } catch (error) {
    console.error('Ошибка при обращении к API:', error);
    res.status(500).json({
      error: 'Произошла ошибка при обработке запроса',
      reply: 'Извините, произошла ошибка. Попробуйте еще раз.'
    });
  }
});

// Главная страница
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});