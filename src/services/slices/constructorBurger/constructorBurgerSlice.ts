import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TIngredient, TConstructorIngredient } from '@utils-types';

// Функция для генерации уникального идентификатора
const generateUniqueId = () => crypto.randomUUID();

// Тип состояния для конструктора бургера
type BurgerConstructorState = {
  constructorItems: {
    bun: TConstructorIngredient | null; // Выбранная булка
    ingredients: TConstructorIngredient[]; // Список выбранных ингредиентов
  };
  isLoading: boolean; // Статус загрузки данных
  error: string | null; // Возможные ошибки
};

// Начальное состояние конструктора
const initialState: BurgerConstructorState = {
  constructorItems: {
    bun: null,
    ingredients: []
  },
  isLoading: false,
  error: null
};

export const constructorBurgerSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    // Добавление ингредиента
    addIngredient: {
      reducer: (state, { payload }: PayloadAction<TConstructorIngredient>) => {
        if (payload.type === 'bun') {
          state.constructorItems.bun = payload; // Если булка, заменяем текущую
        } else {
          state.constructorItems.ingredients.push(payload); // Добавляем ингредиент
        }
      },
      prepare: (ingredient: TIngredient) => ({
        payload: { ...ingredient, id: generateUniqueId() } // Генерация ID для ингредиента
      })
    },
    // Удаление ингредиента
    removeIngredient: (
      state,
      { payload }: PayloadAction<TConstructorIngredient>
    ) => {
      state.constructorItems.ingredients =
        state.constructorItems.ingredients.filter(
          (ingredient) => ingredient.id !== payload.id
        );
    },
    // Перемещение ингредиента в списке
    reorderIngredients: (
      state,
      { payload }: PayloadAction<{ from: number; to: number }>
    ) => {
      const { from, to } = payload;
      const [movedItem] = state.constructorItems.ingredients.splice(from, 1);
      state.constructorItems.ingredients.splice(to, 0, movedItem);
    },
    // Сброс конструктора
    resetConstructor: (state) => {
      state.constructorItems.bun = null;
      state.constructorItems.ingredients = [];
      state.isLoading = false;
      state.error = null;
    }
  }
});

export const {
  addIngredient,
  removeIngredient,
  reorderIngredients,
  resetConstructor
} = constructorBurgerSlice.actions;

export const selectConstructorData = (state: {
  burgerConstructor: BurgerConstructorState;
}) => state.burgerConstructor;
// СЕЛЕКТОР
export const constructorBurgerReducer = constructorBurgerSlice.reducer;
