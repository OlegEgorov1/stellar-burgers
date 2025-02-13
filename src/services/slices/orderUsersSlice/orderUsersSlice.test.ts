import { RequestStatus, TOrder } from '@utils-types';
import { clearUserOrders, orderUsersReduce } from './orderUsersSlice';
import { fetchUserOrders } from './asynk-orderUsers';

// Мокаем данные заказов пользователя
const mockOrders: TOrder[] = [
  {
    _id: '1',
    status: 'done',
    name: 'Бургер 1',
    createdAt: '2024-02-09T12:00:00Z',
    updatedAt: '2024-02-09T12:30:00Z',
    number: 5,
    ingredients: ['ingredient1', 'ingredient2']
  },
  {
    _id: '2',
    status: 'pending',
    name: 'Бургер 2',
    createdAt: '2024-02-09T13:00:00Z',
    updatedAt: '2024-02-09T13:30:00Z',
    number: 2,
    ingredients: ['ingredient3', 'ingredient4']
  }
];

// Начальное состояние
const initialState = {
  orders: [],
  status: RequestStatus.Idle,
  error: null
};

describe('Тестирование orderUsersSlice', () => {
  it('Должен корректно инициализироваться', () => {
    expect(orderUsersReduce(undefined, { type: '@@INIT' })).toEqual(
      initialState
    );
  });

  it('Обрабатываем fetchUserOrders.pending (устанавливает статус Loading)', () => {
    const newState = orderUsersReduce(initialState, {
      type: fetchUserOrders.pending.type
    });

    expect(newState.status).toBe(RequestStatus.Loading);
    expect(newState.error).toBeNull();
  });

  it('Обрабатываем fetchUserOrders.fulfilled (сохраняет заказы и ставит статус Success)', () => {
    const newState = orderUsersReduce(initialState, {
      type: fetchUserOrders.fulfilled.type,
      payload: mockOrders
    });

    expect(newState.status).toBe(RequestStatus.Success);
    expect(newState.orders).toEqual(mockOrders);
  });

  it('Обрабатываем fetchUserOrders.rejected (устанавливает статус Failed и сохраняет ошибку)', () => {
    const errorMessage = 'Не удалось загрузить заказы';

    const newState = orderUsersReduce(initialState, {
      type: fetchUserOrders.rejected.type,
      error: { message: errorMessage }
    });

    expect(newState.status).toBe(RequestStatus.Failed);
    expect(newState.error).toBe(errorMessage);
  });

  it('Обрабатывает clearUserOrders (очищает заказы и сбрасывает статус)', () => {
    const stateWithOrders = {
      orders: mockOrders,
      status: RequestStatus.Success,
      error: null
    };

    const newState = orderUsersReduce(stateWithOrders, clearUserOrders());

    expect(newState).toEqual(initialState);
  });
});
