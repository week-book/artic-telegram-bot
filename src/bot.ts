import axios from 'axios';
import TelegramBot from 'node-telegram-bot-api';
import { getEnv } from './env.js';
import { getRandomArt } from './services/art.js';

const token = getEnv('TELEGRAM_BOT_TOKEN');
const bot = new TelegramBot(token, { polling: true });

async function sendRandomArt(chatId: number, messageId: number): Promise<void> {
  const art = await getRandomArt();

  if (!art.ok) {
    try {
      await bot.sendMessage(chatId, art.error, {
        reply_to_message_id: messageId,
      });
    } catch (err) {
      console.error('Failed to send error message:', err);
    }
    return;
  }

  const artInfo = art.value;

  let photo: Buffer;
  try {
    const res = await axios.get<ArrayBuffer>(artInfo.url, {
      responseType: 'arraybuffer',
    });
    photo = Buffer.from(res.data);
  } catch (err) {
    console.error('Failed to download artwork image:', err);
    try {
      await bot.sendMessage(chatId, '📷 Не удалось загрузить изображение.', {
        reply_to_message_id: messageId,
      });
    } catch (sendErr) {
      console.error('Failed to send error message:', sendErr);
    }
    return;
  }

  try {
    await bot.sendPhoto(chatId, photo, {
      caption: `${artInfo.title} — ${artInfo.artist}`,
      reply_to_message_id: messageId,
    });
  } catch (err) {
    console.error('Failed to send photo:', err);
  }
}

bot.onText(/\/start/, (msg): void => {
  void sendRandomArt(msg.chat.id, msg.message_id);
});
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const messageId = msg.message_id;

  if (msg.from && msg.from.id !== 777000) return;
  await sendRandomArt(chatId, messageId);
});
