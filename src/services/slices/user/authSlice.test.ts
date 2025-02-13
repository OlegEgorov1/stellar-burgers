import { RequestStatus, TUser } from '@utils-types';
import { clearAuthError, userReducer } from './authSlice';
import {
  getUser,
  loginUser,
  logoutUser,
  registerUser,
  updateUser
} from './asynk-userSlice';

// Мокаем пользователя
const mockUser: TUser = {
  name: 'Test User',
  email: 'test@example.com'
};

// Начальное состояние
const initialState = {
  user: null,
  status: RequestStatus.Idle,
  error: null
};

describe('Тестирование authSlice', () => {
  it('Должен корректно инициализироваться', () => {
    expect(userReducer(undefined, { type: '@@INIT' })).toEqual(initialState);
  });

  it('Обрабатываем registerUser.pending (устанавливает статус Loading)', () => {
    const newState = userReducer(initialState, {
      type: registerUser.pending.type
    });

    expect(newState.status).toBe(RequestStatus.Loading);
    expect(newState.error).toBeNull();
  });

  it('Обрабатываем registerUser.fulfilled (сохраняет пользователя и статус Success)', () => {
    const newState = userReducer(initialState, {
      type: registerUser.fulfilled.type,
      payload: mockUser
    });

    expect(newState.status).toBe(RequestStatus.Success);
    expect(newState.user).toEqual(mockUser);
  });

  it('Обрабатываем registerUser.rejected (устанавливает статус Failed и сохраняет ошибку)', () => {
    const errorMessage = 'Ошибка регистрации';

    const newState = userReducer(initialState, {
      type: registerUser.rejected.type,
      error: { message: errorMessage }
    });

    expect(newState.status).toBe(RequestStatus.Failed);
    expect(newState.error).toBe(errorMessage);
  });

  it('Обрабатываем loginUser.fulfilled (сохраняет пользователя и статус Success)', () => {
    const newState = userReducer(initialState, {
      type: loginUser.fulfilled.type,
      payload: mockUser
    });

    expect(newState.status).toBe(RequestStatus.Success);
    expect(newState.user).toEqual(mockUser);
  });

  it('Обрабатываем getUser.fulfilled (обновляет данные пользователя)', () => {
    const newState = userReducer(initialState, {
      type: getUser.fulfilled.type,
      payload: mockUser
    });

    expect(newState.status).toBe(RequestStatus.Success);
    expect(newState.user).toEqual(mockUser);
  });

  it('Обрабатываем updateUser.fulfilled (обновляет данные пользователя)', () => {
    const updatedUser = { ...mockUser, name: 'Updated User' };

    const newState = userReducer(initialState, {
      type: updateUser.fulfilled.type,
      payload: updatedUser
    });

    expect(newState.status).toBe(RequestStatus.Success);
    expect(newState.user).toEqual(updatedUser);
  });

  it('Обрабатываем logoutUser.fulfilled (очищает пользователя и сбрасывает статус)', () => {
    const stateWithUser = {
      user: mockUser,
      status: RequestStatus.Success,
      error: null
    };

    const newState = userReducer(stateWithUser, {
      type: logoutUser.fulfilled.type
    });

    expect(newState.status).toBe(RequestStatus.Idle);
    expect(newState.user).toBeNull();
  });

  it('Обрабатываем clearAuthError (очищает ошибку)', () => {
    const stateWithError = {
      ...initialState,
      error: 'Ошибка авторизации'
    };

    const newState = userReducer(stateWithError, clearAuthError());

    expect(newState.error).toBeNull();
  });
});
