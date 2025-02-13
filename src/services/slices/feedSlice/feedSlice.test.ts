import { RequestStatus, TOrder } from '@utils-types';
import { clearSelectedOrder, feedReducer } from './feedSlice';
import { loadFeeds } from './asynk-Feed';

// Мокаем данные для тестов
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

const mockResponse = {
  orders: mockOrders,
  total: 100,
  totalToday: 10
};

const initialState = {
  orders: [],
  selectedOrder: null,
  totalOrders: 0,
  todayTotal: 0,
  status: RequestStatus.Idle
};

describe('Тестирование feedSlice', () => {
  it('Должен корректно инициализироваться', () => {
    expect(feedReducer(undefined, { type: '@@INIT' })).toEqual(initialState);
  });

  it('Очистка выбранного заказа', () => {
    const stateWithSelectedOrder = {
      ...initialState,
      selectedOrder: mockOrders[0]
    };

    const newState = feedReducer(stateWithSelectedOrder, clearSelectedOrder());
    expect(newState.selectedOrder).toBeNull();
  });

  it('Обрабатываем loadFeeds.pending (устанавливает статус Loading)', () => {
    const newState = feedReducer(initialState, {
      type: loadFeeds.pending.type
    });
    expect(newState.status).toBe(RequestStatus.Loading);
  });

  it('Обрабатываем loadFeeds.loadFeeds.fulfilled (обновляет заказы и статус Success)', () => {
    const newState = feedReducer(initialState, {
      type: loadFeeds.fulfilled.type,
      payload: mockResponse
    });

    expect(newState.status).toBe(RequestStatus.Success);
    expect(newState.orders).toEqual(mockOrders);
    expect(newState.totalOrders).toBe(100);
    expect(newState.todayTotal).toBe(10);
  });

  it('Обрабатывает loadFeeds.rejected (устанавливает статус Failed)', () => {
    const newState = feedReducer(initialState, {
      type: loadFeeds.rejected.type
    });
    expect(newState.status).toBe(RequestStatus.Failed);
  });
});
