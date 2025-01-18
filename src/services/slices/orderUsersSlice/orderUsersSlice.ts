// Модуль для управления состоянием заказов пользователя (User Orders Slice)
import { createSlice } from '@reduxjs/toolkit';
import { RequestStatus, TOrder } from '@utils-types';
import { fetchUserOrders } from './asynk-orderUsers';

// Тип состояния заказов пользователя
type UserOrdersState = {
  orders: TOrder[]; // Список заказов
  status: RequestStatus; // Статус загрузки заказов
  error: string | null; // Ошибка
};

// Начальное состояние
const initialState: UserOrdersState = {
  orders: [],
  status: RequestStatus.Idle, // Начальный статус
  error: null
};

// Срез состояния для управления заказами пользователя
const orderUsersSlice = createSlice({
  name: 'userOrders',
  initialState,
  reducers: {
    // Очистка списка заказов
    clearUserOrders: (state) => {
      state.orders = [];
      state.status = RequestStatus.Idle;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserOrders.pending, (state) => {
        state.status = RequestStatus.Loading; // Устанавливаем статус загрузки
        state.error = null; // Сбрасываем ошибку
      })
      .addCase(fetchUserOrders.fulfilled, (state, { payload }) => {
        state.status = RequestStatus.Success; // Успешная загрузка
        state.orders = payload; // Сохраняем список заказов
      })
      .addCase(fetchUserOrders.rejected, (state, { error }) => {
        state.status = RequestStatus.Failed; // Ошибка загрузки
        state.error = error.message || 'Не удалось загрузить заказы'; // Сохраняем сообщение об ошибке
      });
  }
});

// Селекторы для доступа к данным состояния
export const selectUserOrders = (state: { userOrders: UserOrdersState }) =>
  state.userOrders.orders; // Получение списка заказов
export const selectUserOrdersStatus = (state: {
  userOrders: UserOrdersState;
}) => state.userOrders.status; // Получение статуса загрузки
export const selectUserOrdersError = (state: { userOrders: UserOrdersState }) =>
  state.userOrders.error; // Получение сообщения об ошибке

// Экспорт действий и редьюсера
export const { clearUserOrders } = orderUsersSlice.actions;
export const orderUsersReduce = orderUsersSlice.reducer;
