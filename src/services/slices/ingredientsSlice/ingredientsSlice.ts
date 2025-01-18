// Модуль для управления состоянием ингредиентов (Ingredients Slice)
import { createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit';
import {
  RequestStatus,
  TIngredient,
  TConstructorIngredient
} from '@utils-types';
import { RootState } from '../../store';
import { fetchIngredients } from './asynk-Ingredient';

// Тип состояния для ингредиентов
type IngredientsState = {
  items: TIngredient[]; // Список ингредиентов
  status: RequestStatus; // Статус загрузки ингредиентов
  error: string | null; // Ошибка при загрузке
};

// Начальное состояние
const initialState: IngredientsState = {
  items: [],
  status: RequestStatus.Idle, // Начальный статус
  error: null
};

// Срез состояния для управления ингредиентами
const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {
    // Добавление нового ингредиента
    addIngredient: (
      state,
      { payload }: PayloadAction<TConstructorIngredient>
    ) => {
      state.items.push(payload);
    },
    // Очистка списка ингредиентов
    clearIngredients: (state) => {
      state.items = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.status = RequestStatus.Loading; // Устанавливаем статус загрузки
        state.error = null; // Сбрасываем ошибку
      })
      .addCase(fetchIngredients.fulfilled, (state, { payload }) => {
        state.status = RequestStatus.Success; // Успешная загрузка
        state.items = payload; // Сохраняем полученные ингредиенты
      })
      .addCase(fetchIngredients.rejected, (state, { error }) => {
        state.status = RequestStatus.Failed; // Ошибка загрузки
        state.error = error.message || 'Ошибка загрузки'; // Сохраняем сообщение об ошибке
      });
  }
});

// Селекторы для доступа к данным состояния
export const selectAllIngredients = (state: {
  ingredients: IngredientsState;
}) => state.ingredients.items; // Получение всех ингредиентов
export const selectIngredientsStatus = (state: {
  ingredients: IngredientsState;
}) => state.ingredients.status; // Получение статуса загрузки
export const selectIngredientsByType = (type: string) =>
  createSelector(
    (state: RootState) => state.ingredients.items,
    (items: TIngredient[]) => items.filter((item) => item.type === type) // Фильтрация по типу
  );

// Экспорт действий и редьюсера
export const { addIngredient, clearIngredients } = ingredientsSlice.actions;
export const ingredientsReducer = ingredientsSlice.reducer;
