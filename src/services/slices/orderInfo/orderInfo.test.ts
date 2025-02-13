import { RequestStatus, TOrder } from '@utils-types';
import { orderInfoReducer } from './orderInfoSlice';
import { fetchOrderByNumber } from './asynk-orderInfo';

//Мокаем данные заказов
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
  list: [],
  status: RequestStatus.Idle,
  error: null
};

describe('Тестирование orderInfoSlice', () => {
  it('Должен корректно инициализироваться', () => {
    expect(orderInfoReducer(undefined, { type: '@@INIT' })).toEqual(
      initialState
    );
  });

  it('Обрабатываем fetchOrderByNumber.pending (устанавливает статус Loading)', () => {
    const newState = orderInfoReducer(initialState, {
      type: fetchOrderByNumber.pending.type
    });

    expect(newState.status).toBe(RequestStatus.Loading);
    expect(newState.error).toBeNull();
  });

  it('Обрабатываем fetchOrderByNumber.fulfilled (сохраняет заказы и ставит статус Success)', () => {
    const newState = orderInfoReducer(initialState, {
      type: fetchOrderByNumber.fulfilled.type,
      payload: { orders: mockOrders }
    });

    expect(newState.status).toBe(RequestStatus.Success);
    expect(newState.list).toEqual(mockOrders);
  });

  it('Обрабатываем fetchOrderByNumber.rejected (устанавливает статус Failed и сохраняет ошибку)', () => {
    const errorMessage = 'Ошибка загрузки';

    const newState = orderInfoReducer(initialState, {
      type: fetchOrderByNumber.rejected.type,
      error: { message: errorMessage }
    });

    expect(newState.status).toBe(RequestStatus.Failed);
    expect(newState.error).toBe(errorMessage);
  });
});
