import { test, expect, vi } from 'vitest';
import axios from 'axios';
import { getRandomArt } from '../src/services/art.js';

vi.mock('axios');
const mockedAxios = vi.mocked(axios, true);

vi.mock('../src/env', () => {
  return {
    getEnv: (name: string) => {
      if (name === 'ART_API_BASE_URL') return 'https://api.week-art.ru';
      if (name === 'ART_API_KEY') return 'wa_live_test_key';
      throw new Error(`Env variable ${name} is missing`);
    },
  };
});

test('возвращает корректные данные при валидном ответе', async () => {
  const mockResponse = {
    data: {
      title: 'text',
      artist_name: 'name',
      s3_url: 'url',
    },
  };

  mockedAxios.get.mockResolvedValue(mockResponse);

  const res = await getRandomArt();

  if (!res.ok) {
    expect(res.ok).toBe(true);
    return;
  }

  expect(res.value.title).toBe('text');
  expect(res.value.url).toContain('url');
});

test('возвращает ошибку при отсутвие data', async () => {
  const mockResponse = {
    data: {},
  };

  mockedAxios.get.mockResolvedValue(mockResponse);

  const res = await getRandomArt();

  if (res.ok) {
    expect(res.ok).toBe(false);
    return;
  }

  expect(res.error).toBe('📷 Не удалось получить фото.');
});

test('возвращает ошибку при ошибке запроса', async () => {
  mockedAxios.get.mockRejectedValue(new Error('Network error'));

  const res = await getRandomArt();

  expect(res.ok).toBe(false);
  if (!res.ok) {
    expect(res.error).toBe('Ошибка при запросе API.');
  }
});
