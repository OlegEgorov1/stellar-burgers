import { BurgerConstructorUI } from '@ui';
import { RequestStatus, TConstructorIngredient } from '@utils-types';
import { FC, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  resetConstructor,
  selectConstructorData
} from '../../services/slices/constructorBurger/constructorBurgerSlice';
import {
  clearOrder,
  selectOrderDetails,
  selectOrderStatus
} from '../../services/slices/orderSlice/orderSlice';
import { selectAuthUser } from '../../services/slices/user/userSlice';
import { useDispatch, useSelector } from '../../services/store';
import { createOrder } from '../../services/slices/orderSlice/asynk-orderSlice';

export const BurgerConstructor: FC = () => {
  const constructorData = useSelector(selectConstructorData).constructorItems;
  const isOrderLoading =
    useSelector(selectOrderStatus) === RequestStatus.Loading; // Проверка статуса
  const orderDetails = useSelector(selectOrderDetails);
  const userName = useSelector(selectAuthUser)?.name || '';
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Обработка нажатия кнопки заказа
  const handleOrderClick = () => {
    if (!userName) {
      navigate('/login');
      return;
    }

    const { bun, ingredients } = constructorData;
    if (!bun) {
      alert('Сначала соберите свой вкуснейший бургер!');
      return;
    }

    const orderItems = [
      bun._id,
      ...ingredients.map((ingredient) => ingredient._id),
      bun._id
    ];
    dispatch(createOrder(orderItems));
  };

  // Закрытие модального окна заказа
  const handleCloseModal = () => {
    dispatch(clearOrder());
    dispatch(resetConstructor());
    navigate('/', { replace: true });
  };

  // Подсчет стоимости бургера
  const totalPrice = useMemo(() => {
    const bunPrice = constructorData.bun ? constructorData.bun.price * 2 : 0;
    const ingredientsPrice = constructorData.ingredients.reduce(
      (sum, ingredient) => sum + ingredient.price,
      0
    );
    return bunPrice + ingredientsPrice;
  }, [constructorData]);

  return (
    <BurgerConstructorUI
      price={totalPrice}
      orderRequest={isOrderLoading}
      constructorItems={constructorData}
      orderModalData={orderDetails}
      onOrderClick={handleOrderClick}
      closeOrderModal={handleCloseModal}
    />
  );
};
