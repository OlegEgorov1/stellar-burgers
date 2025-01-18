import { Navigate, useLocation } from 'react-router';
import { ReactElement } from 'react';
import { useSelector } from '../services/store';
import { Preloader } from '@ui';
import {
  selectAuthUser,
  selectAuthStatus
} from '../services/slices/user/userSlice';
import { RequestStatus } from '@utils-types';

type ProtectedRouteProps = {
  children: ReactElement; // Дочерний элемент маршрута
  onlyUnAuth?: boolean; // Флаг для маршрутов, доступных только неавторизованным пользователям
};

export const ProtectedRoute = ({
  onlyUnAuth = false,
  children
}: ProtectedRouteProps): ReactElement => {
  const user = useSelector(selectAuthUser); // Получение данных пользователя
  const authStatus = useSelector(selectAuthStatus); // Получение статуса авторизации
  const location = useLocation();
  const from = location.state?.from || { pathname: '/' }; // URL для перенаправления

  // Показ прелоадера, если идёт проверка авторизации
  if (authStatus === RequestStatus.Loading) {
    return <Preloader />;
  }

  // Логика для маршрутов, доступных только неавторизованным пользователям
  if (onlyUnAuth && user) {
    return <Navigate replace to={from} state={location} />;
  }

  // Логика для маршрутов, доступных только авторизованным пользователям
  if (!onlyUnAuth && !user) {
    return <Navigate to='/login' state={{ from: location }} />;
  }

  return children;
};
