// Модуль для управления состоянием фидов (Feed Slice)
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getFeedsApi } from '@api';
import { RequestStatus, TOrder } from '@utils-types';
import { loadFeeds } from './asynk-Feed';

// Тип состояния для управления фидом
type FeedState = {
  orders: TOrder[]; // Список заказов
  selectedOrder: TOrder | null; // Детали выбранного заказа
  totalOrders: number; // Общее количество заказов
  todayTotal: number; // Количество заказов за сегодня
  status: RequestStatus; // Статус загрузки
};

// Начальное состояние
const initialState: FeedState = {
  orders: [],
  selectedOrder: null,
  totalOrders: 0,
  todayTotal: 0,
  status: RequestStatus.Idle // Статус по умолчанию
};

// Срез состояния для управления фидом
const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    // Очистка деталей выбранного заказа
    clearSelectedOrder: (state) => {
      state.selectedOrder = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadFeeds.pending, (state) => {
        state.status = RequestStatus.Loading; // Устанавливаем статус "Загрузка"
      })
      .addCase(loadFeeds.fulfilled, (state, { payload }) => {
        state.status = RequestStatus.Success; // Устанавливаем статус "Успешно"
        state.orders = payload.orders; // Обновляем список заказов
        state.totalOrders = payload.total; // Общее количество заказов
        state.todayTotal = payload.totalToday; // Количество заказов за сегодня
      })
      .addCase(loadFeeds.rejected, (state) => {
        state.status = RequestStatus.Failed; // Устанавливаем статус "Ошибка"
      });
  }
});

// Селекторы для доступа к данным состояния заказов
export const selectFeeds = (state: {
  feed: FeedState; // Обновляем до правильной структуры
}) => state.feed.orders; // Получение списка заказов

export const selectLoadingStatus = (state: { feed: FeedState }) =>
  state.feed.status; // Получение статуса загрузки

export const selectSelectedFeeds = (state: { feed: FeedState }) =>
  state.feed.selectedOrder; // Получение выбранного заказа

export const selectTotalFeeds = (state: { feed: FeedState }) =>
  state.feed.totalOrders; // Общее количество заказов

export const selectTodayFeeds = (state: { feed: FeedState }) =>
  state.feed.todayTotal; // Количество заказов за сегодня

// Экспорт действий и редьюсера
export const { clearSelectedOrder } = feedSlice.actions;
export const feedReducer = feedSlice.reducer;
