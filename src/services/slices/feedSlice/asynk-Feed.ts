import { getFeedsApi } from '@api';
import { createAsyncThunk } from '@reduxjs/toolkit';

// Асинхронное действие для получения данных о фидах
export const loadFeeds = createAsyncThunk(
  'feed/loadFeeds',
  async () => await getFeedsApi() // Выполняем запрос к API
);
