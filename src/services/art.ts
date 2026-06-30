import axios from 'axios';
import { getEnv } from '../env.js';
import type { ArtData, Result } from '../types/art.js';

const apiBaseUrl = getEnv('ART_API_BASE_URL');
const apiKey = getEnv('ART_API_KEY');

export async function getRandomArt(): Promise<Result<ArtData, string>> {
  try {
    const res = await axios.get(`${apiBaseUrl}/artworks/random`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });

    const data = res.data;
    if (!data || !data.s3_url || !data.title) {
      return { ok: false, error: '📷 Не удалось получить фото.' };
    }

    return {
      ok: true,
      value: {
        title: data.title || 'Без названия',
        artist: data.artist_name || 'Unknown',
        url: data.s3_url,
      },
    };
  } catch (err) {
    console.error('getRandomArt error:', err);
    return { ok: false, error: 'Ошибка при запросе API.' };
  }
}
