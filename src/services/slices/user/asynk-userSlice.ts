import {
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  TLoginData,
  TRegisterData,
  updateUserApi
} from '@api';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import { deleteCookie, setCookie } from '../../../utils/cookie';

// Асинхронные действия для работы с авторизацией

// Регистрация нового пользователя
// Выполняет запрос к API для регистрации нового пользователя,
// устанавливает accessToken в cookies и refreshToken в localStorage.
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (data: TRegisterData) => {
    const response = await registerUserApi(data);
    setCookie('accessToken', response.accessToken); // Сохраняем accessToken в cookies
    localStorage.setItem('refreshToken', response.refreshToken); // Сохраняем refreshToken в localStorage
    return response.user as TUser; // Возвращаем данные пользователя
  }
);

// Авторизация пользователя
// Выполняет запрос к API для входа пользователя,
// устанавливает accessToken в cookies и refreshToken в localStorage.
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (data: TLoginData) => {
    const response = await loginUserApi(data);
    setCookie('accessToken', response.accessToken); // Сохраняем accessToken в cookies
    localStorage.setItem('refreshToken', response.refreshToken); // Сохраняем refreshToken в localStorage
    return response.user as TUser; // Возвращаем данные пользователя
  }
);

// Получение данных текущего пользователя
// Выполняет запрос к API для получения информации о текущем авторизованном пользователе.
export const getUser = createAsyncThunk('auth/getUser', async () => {
  const response = await getUserApi();
  return response.user as TUser; // Возвращаем данные пользователя
});

// Обновление данных пользователя
// Выполняет запрос к API для обновления данных текущего пользователя.
export const updateUser = createAsyncThunk(
  'auth/updateUser',
  async (data: Partial<TRegisterData>) => {
    const response = await updateUserApi(data);
    return response.user as TUser; // Возвращаем обновленные данные пользователя
  }
);

// Выход из системы
// Выполняет запрос к API для выхода пользователя,
// удаляет accessToken из cookies и refreshToken из localStorage.
export const logoutUser = createAsyncThunk('auth/logoutUser', async () => {
  await logoutApi();
  deleteCookie('accessToken'); // Удаляем accessToken из cookies
  localStorage.removeItem('refreshToken'); // Удаляем refreshToken из localStorage
});
