import { rootReducer } from '../store';
import { constructorBurgerReducer } from './constructorBurger/constructorBurgerSlice';
import { feedReducer } from './feedSlice/feedSlice';
import { ingredientsReducer } from './ingredientsSlice/ingredientsSlice';
import { orderInfoReducer } from './orderInfo/orderInfoSlice';
import { orderReducer } from './orderSlice/orderSlice';
import { orderUsersReduce } from './orderUsersSlice/orderUsersSlice';
import { userReducer } from './user/authSlice';

describe('Тестирование rootReducer', () => {
  test('Должен корректно комбинировать редьюсеры', () => {
    const state = rootReducer(undefined, { type: '@@INIT' });

    // Проверяем, что rootReducer содержит все ключи, которые мы ожидаем
    expect(state).toHaveProperty('ingredients');
    expect(state).toHaveProperty('burgerConstructor');
    expect(state).toHaveProperty('order');
    expect(state).toHaveProperty('feed');
    expect(state).toHaveProperty('orderByNumber');
    expect(state).toHaveProperty('userOrders');
    expect(state).toHaveProperty('auth');

    // Проверяем, что каждый редьюсер инициализирует корректное состояние
    expect(state.ingredients).toEqual(
      ingredientsReducer(undefined, { type: '@@INIT' })
    );
    expect(state.burgerConstructor).toEqual(
      constructorBurgerReducer(undefined, { type: '@@INIT' })
    );
    expect(state.order).toEqual(orderReducer(undefined, { type: '@@INIT' }));
    expect(state.feed).toEqual(feedReducer(undefined, { type: '@@INIT' }));
    expect(state.orderByNumber).toEqual(
      orderInfoReducer(undefined, { type: '@@INIT' })
    );
    expect(state.userOrders).toEqual(
      orderUsersReduce(undefined, { type: '@@INIT' })
    );
    expect(state.auth).toEqual(userReducer(undefined, { type: '@@INIT' }));
  });
});
