import { getOrderByNumberApi } from '@api';
import { createAsyncThunk } from '@reduxjs/toolkit';

// Асинхронное действие для получения заказа по номеру
export const fetchOrderByNumber = createAsyncThunk(
  'orders/fetchOrderByNumber',
  async (orderNumber: number) => await getOrderByNumberApi(orderNumber) // Выполняем запрос к API
);
