import { getIngredientsApi } from '@api';
import { createAsyncThunk } from '@reduxjs/toolkit';

// Асинхронное действие для получения ингредиентов
export const fetchIngredients = createAsyncThunk(
  'ingredients/fetchIngredients',
  async () => await getIngredientsApi() // Выполняем запрос к API
);
