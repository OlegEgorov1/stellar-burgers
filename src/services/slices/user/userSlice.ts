// Модуль для управления состоянием пользователя (User Auth Slice)
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TUser, RequestStatus } from '@utils-types';
import {
  getUser,
  loginUser,
  logoutUser,
  registerUser,
  updateUser
} from './asynk-userSlice';

// Тип состояния авторизации
interface AuthState {
  user: TUser | null; // Данные пользователя
  status: RequestStatus; // Статус загрузки
  error: string | null; // Сообщение об ошибке
}

// Начальное состояние
const initialState: AuthState = {
  user: null,
  status: RequestStatus.Idle,
  error: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthError: (state) => {
      state.error = null; // Сбрасываем сообщение об ошибке
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.status = RequestStatus.Loading;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, { payload }) => {
        state.status = RequestStatus.Success;
        state.user = payload;
      })
      .addCase(registerUser.rejected, (state, { error }) => {
        state.status = RequestStatus.Failed;
        state.error = error.message || 'Ошибка регистрации';
      })
      .addCase(loginUser.pending, (state) => {
        state.status = RequestStatus.Loading;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, { payload }) => {
        state.status = RequestStatus.Success;
        state.user = payload;
      })
      .addCase(loginUser.rejected, (state, { error }) => {
        state.status = RequestStatus.Failed;
        state.error = error.message || 'Ошибка входа';
      })
      .addCase(getUser.pending, (state) => {
        state.status = RequestStatus.Loading;
      })
      .addCase(getUser.fulfilled, (state, { payload }) => {
        state.status = RequestStatus.Success;
        state.user = payload;
      })
      .addCase(getUser.rejected, (state, { error }) => {
        state.status = RequestStatus.Failed;
        state.error = error.message || 'Ошибка получения данных пользователя';
      })
      .addCase(updateUser.pending, (state) => {
        state.status = RequestStatus.Loading;
      })
      .addCase(updateUser.fulfilled, (state, { payload }) => {
        state.status = RequestStatus.Success;
        state.user = payload;
      })
      .addCase(updateUser.rejected, (state, { error }) => {
        state.status = RequestStatus.Failed;
        state.error = error.message || 'Ошибка обновления данных пользователя';
      })
      .addCase(logoutUser.pending, (state) => {
        state.status = RequestStatus.Loading;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.status = RequestStatus.Idle;
        state.user = null;
      })
      .addCase(logoutUser.rejected, (state, { error }) => {
        state.status = RequestStatus.Failed;
        state.error = error.message || 'Ошибка выхода из системы';
      });
  }
});

// Селекторы для доступа к данным состояния
export const selectAuthUser = (state: { auth: AuthState }) => state.auth.user; // Получение данных пользователя
export const selectAuthStatus = (state: { auth: AuthState }) =>
  state.auth.status; // Получение статуса авторизации
export const selectAuthError = (state: { auth: AuthState }) => state.auth.error; // Получение ошибки авторизации

// Экспорт действий и редьюсера
export const { clearAuthError } = authSlice.actions;
export default authSlice.reducer;

export const userReducer = authSlice.reducer;
