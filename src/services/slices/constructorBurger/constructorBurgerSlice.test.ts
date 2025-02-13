import { TConstructorIngredient } from '@utils-types';
import {
  addIngredient,
  constructorBurgerReducer,
  removeIngredient,
  reorderIngredients
} from './constructorBurgerSlice';

jest.mock('uuid', () => {
  let counter = 0;
  return {
    v4: jest.fn(() => `mocked-uuid-${counter++}`) // Уникальные ID для каждого ингредиента
  };
});

// Данные ингредиентов
const bun: TConstructorIngredient = {
  id: 'mocked-uuid-0', // ID теперь мокается
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
};

const ingredient1: TConstructorIngredient = {
  id: 'mocked-uuid-1',
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
};

const ingredient2: TConstructorIngredient = {
  id: 'mocked-uuid-2',
  _id: '3',
  name: 'Помидор',
  type: 'main',
  proteins: 3,
  fat: 1,
  carbohydrates: 7,
  calories: 15,
  price: 30,
  image: 'tomato.png',
  image_large: 'tomato-large.png',
  image_mobile: 'tomato-mobile.png'
};

// Начальное состояние
const initialState = {
  constructorItems: { bun: null, ingredients: [] },
  isLoading: false,
  error: null
};

// Перед каждым тестом сбрасываем модули, чтобы моки работали
beforeEach(() => {
  jest.resetModules();
});

describe('Тестирование reducer constructorBurgerSlice', () => {
  it('Добавление ингредиента (булка заменяется)', () => {
    const newState = constructorBurgerReducer(initialState, addIngredient(bun));

    expect(newState.constructorItems.bun).toEqual(bun);
  });

  it('Добавление ингредиента (начинка добавляется)', () => {
    const newState = constructorBurgerReducer(
      initialState,
      addIngredient(ingredient1)
    );

    // Проверяем, что ингредиент добавился и его ID соответствует мокированному значению
    expect(newState.constructorItems.ingredients).toContainEqual({
      ...ingredient1,
      id: 'mocked-uuid-1' // Проверяем, что сработал мок
    });
  });

  it('Удаление ингредиента', () => {
    const stateWithIngredient = {
      ...initialState,
      constructorItems: {
        ...initialState.constructorItems,
        ingredients: [ingredient1]
      }
    };

    const newState = constructorBurgerReducer(
      stateWithIngredient,
      removeIngredient(ingredient1)
    );

    expect(newState.constructorItems.ingredients).not.toContainEqual(
      ingredient1
    );
    expect(newState.constructorItems.ingredients.length).toBe(0);
  });

  it('Перемещение ингредиента в начинке', () => {
    const stateWithTwoIngredients = {
      ...initialState,
      constructorItems: {
        ...initialState.constructorItems,
        ingredients: [ingredient1, ingredient2]
      }
    };

    const newState = constructorBurgerReducer(
      stateWithTwoIngredients,
      reorderIngredients({ from: 0, to: 1 }) // Меняем местами 0-й и 1-й ингредиент
    );

    // Проверяем, что порядок ингредиентов изменился
    expect(newState.constructorItems.ingredients[0]).toEqual(ingredient2);
    expect(newState.constructorItems.ingredients[1]).toEqual(ingredient1);
  });
});
