// Компонент для регистрации пользователя
import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { RegisterUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import {
  selectAuthError,
  clearAuthError
} from '../../services/slices/user/userSlice';
import { registerUser } from '../../services/slices/user/asynk-userSlice';

export const Register: FC = () => {
  const [name, setUserName] = useState(''); // Состояние для имени пользователя
  const [email, setEmail] = useState(''); // Состояние для email
  const [password, setPassword] = useState(''); // Состояние для пароля
  const dispatch = useDispatch();
  const error = useSelector(selectAuthError) || undefined; // Получение ошибки из состояния

  // Обработчик отправки формы
  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    const data = { name, email, password };
    dispatch(registerUser(data));
  };

  // Очистка ошибок при загрузке компонента
  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  return (
    <RegisterUI
      errorText={error}
      email={email}
      userName={name}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
