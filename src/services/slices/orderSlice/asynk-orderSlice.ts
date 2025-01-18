import { orderBurgerApi } from '@api';
import { createAsyncThunk } from '@reduxjs/toolkit';

// Асинхронное действие для создания заказа
export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (data: string[]) => await orderBurgerApi(data) // Выполняем запрос к API
);
