import styles from './constructor-page.module.css';
import { Preloader } from '@ui';
import { BurgerConstructor, BurgerIngredients } from '@components';
import { FC } from 'react';
import { useSelector } from '../../services/store';
import { selectIngredientsStatus } from '../../services/slices/ingredientsSlice/ingredientsSlice';
import { RequestStatus } from '@utils-types';

export const ConstructorPage: FC = () => {
  const ingredientsStatus = useSelector(selectIngredientsStatus);

  // Условие для отображения прелоадера или контента
  if (ingredientsStatus === RequestStatus.Loading) {
    return <Preloader />;
  }

  if (ingredientsStatus === RequestStatus.Failed) {
    return (
      <main className={styles.containerMain}>
        <h1
          className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}
        >
          Ошибка загрузки ингредиентов
        </h1>
      </main>
    );
  }

  return (
    <main className={styles.containerMain}>
      <h1
        className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}
      >
        Соберите бургер
      </h1>
      <div className={`${styles.main} pl-5 pr-5`}>
        <BurgerIngredients />
        <BurgerConstructor />
      </div>
    </main>
  );
};
