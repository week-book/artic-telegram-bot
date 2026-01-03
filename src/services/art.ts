import axios from 'axios';
import { getEnv } from '../env.js';
import type { ArtData, Result } from '../types/art.js';

const apikey = getEnv('API_ACCESS_KEY');

export async function getRandomArt(): Promise<Result<ArtData, string>> {
  try {
    const res = await axios.get(
      `https://api.unsplash.com/photos/random?client_id=${apikey}`,
    );

    const data = res.data;
    if (!data || !data.urls?.regular || !data.user?.name) {
      return { ok: false, error: '📷 Не удалось получить фото.' };
    }

    return {
      ok: true,
      value: {
        title: data.alt_description || data.description || 'Без названия',
        artist: data.user.name,
        url: data.urls.regular,
      },
    };
  } catch (err) {
    console.error('getRandomArt error:', err);
    return { ok: false, error: 'Ошибка при запросе API.' };
  }
}
