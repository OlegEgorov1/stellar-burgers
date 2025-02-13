import { RequestStatus, TOrder } from '@utils-types';
import { clearOrder, orderReducer } from './orderSlice';
import { createOrder } from './asynk-orderSlice';

// Мокаем данные заказа
const mockOrder: TOrder = {
  _id: '1',
  status: 'done',
  name: 'Бургер 1',
  createdAt: '2024-02-09T12:00:00Z',
  updatedAt: '2024-02-09T12:30:00Z',
  number: 5,
  ingredients: ['ingredient1', 'ingredient2']
};

// Начальное состояние
const initialState = {
  details: null,
  status: RequestStatus.Idle,
  error: null
};

describe('Тестирование orderSlice', () => {
  it('Должен корректно инициализироваться', () => {
    expect(orderReducer(undefined, { type: '@@INIT' })).toEqual(initialState);
  });

  it('Обрабатываем createOrder.pending (устанавливает статус Loading)', () => {
    const newState = orderReducer(initialState, {
      type: createOrder.pending.type
    });

    expect(newState.status).toBe(RequestStatus.Loading);
    expect(newState.error).toBeNull();
  });

  it('Обрабатываем createOrder.fulfilled (сохраняет детали заказа и ставит статус Success)', () => {
    const newState = orderReducer(initialState, {
      type: createOrder.fulfilled.type,
      payload: { order: mockOrder }
    });

    expect(newState.status).toBe(RequestStatus.Success);
    expect(newState.details).toEqual(mockOrder);
  });

  it('Обрабатываем createOrder.rejected (устанавливает статус Failed и сохраняет ошибку)', () => {
    const errorMessage = 'Ошибка при создании заказа';

    const newState = orderReducer(initialState, {
      type: createOrder.rejected.type,
      error: { message: errorMessage }
    });

    expect(newState.status).toBe(RequestStatus.Failed);
    expect(newState.error).toBe(errorMessage);
  });

  it('Обрабатываем clearOrder (очищает заказ и сбрасывает статус)', () => {
    const stateWithOrder = {
      details: mockOrder,
      status: RequestStatus.Success,
      error: null
    };

    const newState = orderReducer(stateWithOrder, clearOrder());

    expect(newState).toEqual(initialState);
  });
});
