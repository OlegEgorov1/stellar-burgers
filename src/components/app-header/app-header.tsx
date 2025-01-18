import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { useSelector } from '../../services/store';
import { selectAuthUser } from '../../services/slices/user/userSlice';

export const AppHeader: FC = () => {
  const userName = useSelector(selectAuthUser)?.name || ''; // Проверка на null и установка пустой строки по умолчанию

  return <AppHeaderUI userName={userName} />;
};
