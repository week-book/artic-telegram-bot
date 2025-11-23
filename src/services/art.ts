import axios from 'axios';
import type { ArtData, Result } from '../types/art.js';

export async function getRandomArt(): Promise<Result<ArtData, string>> {
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
