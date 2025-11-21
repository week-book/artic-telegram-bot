import 'dotenv/config';
import TelegramBot from 'node-telegram-bot-api';
import axios from 'axios';

const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

async function getRandomArt() {
	try {
		const randomPage = Math.floor(Math.random() * 20000) + 1;
		const res = await axios.get(`https://api.artic.edu/api/v1/artworks?page=${randomPage}&limit=1`);

		const data = res.data.data[0];
		if (!data) return "🎨 Не удалось найти работу.";

		const imageId = data.image_id;
		if (!imageId) return "🎨 У этой работы нет изображения.";

		const imageUrl = `https://www.artic.edu/iiif/2/${imageId}/full/843,/0/default.jpg`;

		return {
			title: data.title,
			artist: data.artist_title || "Неизвестный художник",
			url: imageUrl,
		};
	} catch (e) {
		return { title: "Ошибка", artist: "", url: "" };
	}
}

bot.on("message", async (msg) => {
	const chatId = msg.chat.id;
	const messageId = msg.message_id;
	const userId = msg.from.id;
	if (userId === 777000) {
		const art = await getRandomArt();

		if (art.url) {
			bot.sendPhoto(chatId, art.url, {
				caption: `${art.title} — ${art.artist}`,
				reply_to_message_id: messageId,
			});
		} else {
			bot.sendMessage(chatId, "🎨 Не удалось найти работу.");
		}
	}
});
