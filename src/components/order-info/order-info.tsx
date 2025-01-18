import { FC, useEffect, useMemo } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useSelector, useDispatch } from '../../services/store';

import { useParams } from 'react-router-dom';
import { selectOrdersList } from '../../services/slices/orderInfo/orderInfoSlice';
import { selectAllIngredients } from '../../services/slices/ingredientsSlice/ingredientsSlice';
import { fetchOrderByNumber } from '../../services/slices/orderInfo/asynk-orderInfo';

export const OrderInfo: FC = () => {
  const { number } = useParams();
  const ordersNumber = Number(number);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchOrderByNumber(ordersNumber));
  }, []);

  const orderData = useSelector(selectOrdersList).find((order) => order);

  const ingredients: TIngredient[] = useSelector(selectAllIngredients);

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
