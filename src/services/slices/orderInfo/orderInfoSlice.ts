// Модуль для управления состоянием заказов (Orders Slice)
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RequestStatus, TOrder } from '@utils-types';
import { fetchOrderByNumber } from './asynk-orderInfo';

// Тип состояния для заказов
type OrdersState = {
  list: TOrder[]; // Список заказов
  status: RequestStatus; // Статус загрузки заказов
  error: string | null; // Сообщение об ошибке
};

// Начальное состояние
const initialState: OrdersState = {
  list: [],
  status: RequestStatus.Idle, // Начальный статус
  error: null
};

// Срез состояния для управления заказами
const orderInfoSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    // Очистка списка заказов
    clearOrders: (state) => {
      state.list = [];
      state.status = RequestStatus.Idle;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.status = RequestStatus.Loading; // Устанавливаем статус загрузки
        state.error = null; // Сбрасываем ошибку
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, { payload }) => {
        state.status = RequestStatus.Success; // Успешная загрузка
        state.list = payload.orders; // Сохраняем список заказов
      })
      .addCase(fetchOrderByNumber.rejected, (state, { error }) => {
        state.status = RequestStatus.Failed; // Ошибка загрузки
        state.error = error.message || 'Ошибка загрузки'; // Сохраняем сообщение об ошибке
      });
  }
});

// Селекторы для доступа к данным состояния
export const selectOrdersList = (state: { orderByNumber: OrdersState }) =>
  state.orderByNumber.list;
export const selectOrdersStatus = (state: { orderByNumber: OrdersState }) =>
  state.orderByNumber.status; // Получение статуса загрузки
export const selectOrdersError = (state: { orderByNumber: OrdersState }) =>
  state.orderByNumber.error; // Получение сообщения об ошибке

// Экспорт действий и редьюсера
export const { clearOrders } = orderInfoSlice.actions;
export const orderInfoReducer = orderInfoSlice.reducer;
