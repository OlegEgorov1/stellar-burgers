// Модуль для управления состоянием заказов (Order Slice)
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RequestStatus, TOrder } from '@utils-types';
import { createOrder } from './asynk-orderSlice';

// Тип состояния заказа
type OrderState = {
  details: TOrder | null; // Детали заказа
  status: RequestStatus; // Статус загрузки
  error: string | null; // Ошибка
};

// Начальное состояние
const initialState: OrderState = {
  details: null,
  status: RequestStatus.Idle, // Начальный статус
  error: null
};

// Срез состояния для управления заказом
const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    // Очистка данных о заказе
    clearOrder: (state) => {
      state.details = null;
      state.status = RequestStatus.Idle;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.status = RequestStatus.Loading; // Устанавливаем статус загрузки
        state.error = null; // Сбрасываем ошибку
      })
      .addCase(createOrder.fulfilled, (state, { payload }) => {
        state.status = RequestStatus.Success; // Успешная загрузка
        state.details = payload.order; // Сохраняем детали заказа
      })
      .addCase(createOrder.rejected, (state, { error }) => {
        state.status = RequestStatus.Failed; // Ошибка загрузки
        state.error = error.message || 'Ошибка при создании заказа'; // Сохраняем сообщение об ошибке
      });
  }
});

// Селекторы для доступа к данным состояния
export const selectOrderDetails = (state: { order: OrderState }) =>
  state.order.details; // Получение деталей заказа
export const selectOrderStatus = (state: { order: OrderState }) =>
  state.order.status; // Получение статуса загрузки
export const selectOrderError = (state: { order: OrderState }) =>
  state.order.error; // Получение сообщения об ошибке

// Экспорт действий и редьюсера
export const { clearOrder } = orderSlice.actions;
export const orderReducer = orderSlice.reducer;
