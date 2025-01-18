import { combineReducers, configureStore } from '@reduxjs/toolkit';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';
import { ingredientsReducer } from './slices/ingredientsSlice/ingredientsSlice';
import { constructorBurgerReducer } from './slices/constructorBurger/constructorBurgerSlice';
import { orderReducer } from './slices/orderSlice/orderSlice';

import { orderUsersReduce } from './slices/orderUsersSlice/orderUsersSlice';
import { userReducer } from './slices/user/userSlice';
import { feedReducer } from './slices/feedSlice/feedSlice';
import { orderInfoReducer } from './slices/orderInfo/orderInfoSlice';

const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  burgerConstructor: constructorBurgerReducer,
  order: orderReducer,
  feed: feedReducer,
  orderByNumber: orderInfoReducer,
  userOrders: orderUsersReduce,
  auth: userReducer
});

export const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
