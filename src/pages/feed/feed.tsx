import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import { selectFeeds } from '../../services/slices/feedSlice/feedSlice';
import { loadFeeds } from '../../services/slices/feedSlice/asynk-Feed';

export const Feed: FC = () => {
  const orders: TOrder[] = useSelector(selectFeeds);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadFeeds());
  }, [dispatch]);

  if (!orders.length) {
    return <Preloader />;
  }

  const handleGetFeeds = () => {
    dispatch(loadFeeds());
  };

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
