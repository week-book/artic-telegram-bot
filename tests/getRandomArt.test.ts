import { test, expect, vi } from 'vitest';
import axios from 'axios';
import { getRandomArt } from '../src/services/art.js';

vi.mock('axios');
const mockedAxios = vi.mocked(axios, true);

test('возвращает корректные данные при валидном ответе', async () => {
  const mockResponse = {
    data: {
      data: [
        {
          image_id: 'abc123',
          title: 'Test Title',
          artist_title: 'Test Artist',
        },
      ],
    },
  };

  mockedAxios.get.mockResolvedValue(mockResponse);

  const res = await getRandomArt();

  if (!res.ok) {
    expect(res.ok).toBe(true);
    return;
  }

  expect(res.value.title).toBe('Test Title');
  expect(res.value.url).toContain('abc123');
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

  expect(res.error).toBe('Ошибка при запросе API.');
});

test('возвращает ошибку при отсутвие data[0]', async () => {
  const mockResponse = {
    data: { data: [] },
  };

  mockedAxios.get.mockResolvedValue(mockResponse);

  const res = await getRandomArt();

  if (res.ok) {
    expect(res.ok).toBe(false);
    return;
  }

  expect(res.error).toBe('🎨 Не удалось найти работу.');
});

test('возвращает ошибку при отсутствии image_id в data[0]', async () => {
  const mockResponse = {
    data: {
      data: [
        {}
      ]
    },
  };

  mockedAxios.get.mockResolvedValue(mockResponse);

  const res = await getRandomArt();

  if (res.ok) {
    expect(res.ok).toBe(false);
    return;
  }

  expect(res.error).toBe('🎨 У этой работы нет изображения.');
});
