import 'dotenv/config';
import TelegramBot from 'node-telegram-bot-api';
import axios from 'axios';

interface ArtData {
	title: string;
	artist: string;
	url: string;
}
type Result<T, E> =
	| { ok: true; value: T }
	| { ok: false; error: E };


const token = getEnv("TELEGRAM_BOT_TOKEN");
function getEnv(name: string): string {
	const value = process.env[name];
	if (!value) {
		throw new Error(`Env variable ${name} is missing`);
	}
	return value;
}

const bot = new TelegramBot(token, { polling: true });

async function getRandomArt(): Promise<Result<ArtData, string>> {
	try {
		const randomPage = Math.floor(Math.random() * 20000) + 1;
		const res = await axios.get(`https://api.artic.edu/api/v1/artworks?page=${randomPage}&limit=1`);

		const data = res.data.data[0];
		if (!data) {
			return { ok: false, error: "🎨 Не удалось найти работу." };
		}

		const imageId = data.image_id;
		if (!imageId) {
			return { ok: false, error: "🎨 У этой работы нет изображения." };
		}

		const imageUrl = `https://www.artic.edu/iiif/2/${imageId}/full/843,/0/default.jpg`;

		return {
			ok: true,
			value: {
				title: data.title,
				artist: data.artist_title || "Неизвестный художник",
				url: imageUrl
			},
		};
	} catch (e) {
		return { ok: false, error: "Ошибка при запросе API." };
	}
}

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
