// Модуль для управления входом пользователя
import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import { useNavigate } from 'react-router-dom';
import {
  clearAuthError,
  selectAuthError
} from '../../services/slices/user/userSlice';
import { loginUser } from '../../services/slices/user/asynk-userSlice';

export const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const error = useSelector(selectAuthError) || undefined;
  const navigate = useNavigate();

  // Обработчик отправки формы
  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    const credentials = { email, password };
    dispatch(loginUser(credentials));
    navigate('/');
  };

  // Очистка ошибок при загрузке компонента
  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  return (
    <LoginUI
      errorText={error}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
