import { RequestStatus, TIngredient } from '@utils-types';
import { ingredientsReducer } from './ingredientsSlice';
import { fetchIngredients } from './asynk-Ingredient';

// Мокаем список ингредиентов
const mockIngredients: TIngredient[] = [
  {
    _id: '1',
    name: 'Булка',
    type: 'bun',
    proteins: 10,
    fat: 5,
    carbohydrates: 20,
    calories: 150,
    price: 50,
    image: 'bun.png',
    image_large: 'bun-large.png',
    image_mobile: 'bun-mobile.png'
  },
  {
    _id: '2',
    name: 'Салат',
    type: 'main',
    proteins: 2,
    fat: 1,
    carbohydrates: 5,
    calories: 10,
    price: 20,
    image: 'salad.png',
    image_large: 'salad-large.png',
    image_mobile: 'salad-mobile.png'
  }
];

// Начальное состояние редьюсера
const initialState = {
  items: [],
  status: RequestStatus.Idle,
  error: null
};

describe('Тестирование ingredientsSlice', () => {
  it('Должен корректно инициализироваться', () => {
    expect(ingredientsReducer(undefined, { type: '@@INIT' })).toEqual(
      initialState
    );
  });

  it('Обрабатывает fetchIngredients.pending (устанавливает статус Loading)', () => {
    const newState = ingredientsReducer(initialState, {
      type: fetchIngredients.pending.type
    });
    expect(newState.status).toBe(RequestStatus.Loading);
    expect(newState.error).toBeNull();
  });

  it('Обрабатывает fetchIngredients.fulfilled (сохраняет ингредиенты и ставит статус Success)', () => {
    const newState = ingredientsReducer(initialState, {
      type: fetchIngredients.fulfilled.type,
      payload: mockIngredients
    });

    expect(newState.status).toBe(RequestStatus.Success);
    expect(newState.items).toEqual(mockIngredients);
  });

  it('Обрабатывает fetchIngredients.rejected (устанавливает статус Failed и сохраняет ошибку)', () => {
    const errorMessage = 'Ошибка загрузки';

    const newState = ingredientsReducer(initialState, {
      type: fetchIngredients.rejected.type,
      error: { message: errorMessage }
    });

    expect(newState.status).toBe(RequestStatus.Failed);
    expect(newState.error).toBe(errorMessage);
  });
});
