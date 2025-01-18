import { getOrdersApi } from '@api';
import { createAsyncThunk } from '@reduxjs/toolkit';

// Асинхронное действие для получения заказов пользователя
export const fetchUserOrders = createAsyncThunk(
  'userOrders/fetchUserOrders',
  async () => await getOrdersApi() // Выполняем запрос к API
);
