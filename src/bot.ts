import TelegramBot from 'node-telegram-bot-api';
import { getEnv } from './env.js';
import { getRandomArt } from './services/art.js';

const token = getEnv("TELEGRAM_BOT_TOKEN");
const bot = new TelegramBot(token, { polling: true });

bot.on("message", async (msg) => {
	const chatId = msg.chat.id;
	const messageId = msg.message_id;

	if (msg.from && msg.from.id !== 777000) return
	const art = await getRandomArt();

	if (!art.ok) {
		return bot.sendMessage(chatId, art.error, {
			reply_to_message_id: messageId,
		});
	}

	const artInfo = art.value;
	bot.sendPhoto(chatId, artInfo.url, {
		caption: `${artInfo.title} — ${artInfo.artist}`,
		reply_to_message_id: messageId,
	});

});
