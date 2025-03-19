import { renderHook, act } from '@testing-library/react-hooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../../hooks/useAuth';

describe('useAuth', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    AsyncStorage.getItem.mockClear();
    AsyncStorage.setItem.mockClear();
    AsyncStorage.removeItem.mockClear();
  });

  it('должен инициализироваться с начальным состоянием', () => {
    const { result } = renderHook(() => useAuth());

    expect(result.current.user).toBeNull();
    expect(result.current.isLoading).toBe(true);
    expect(result.current.error).toBeNull();
  });

  it('должен загружать данные при монтировании', async () => {
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      name: 'Test User',
    };
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(mockUser));

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isLoading).toBe(false);
  });

  it('должен успешно выполнять вход', async () => {
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      name: 'Test User',
    };
    const mockToken = 'test-token';

    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ user: mockUser, token: mockToken }),
    });

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.login('test@example.com', 'password');
    });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(AsyncStorage.setItem).toHaveBeenCalledWith('auth_token', mockToken);
  });

  it('должен обрабатывать ошибку при входе', async () => {
    const errorMessage = 'Invalid credentials';
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ message: errorMessage }),
    });

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.login('test@example.com', 'wrong-password');
    });

    expect(result.current.user).toBeNull();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(errorMessage);
  });

  it('должен успешно выполнять регистрацию', async () => {
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      name: 'Test User',
    };
    const mockToken = 'test-token';

    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ user: mockUser, token: mockToken }),
    });

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.register({
        email: 'test@example.com',
        password: 'password',
        name: 'Test User',
      });
    });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(AsyncStorage.setItem).toHaveBeenCalledWith('auth_token', mockToken);
  });

  it('должен успешно выполнять выход', async () => {
    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.logout();
    });

    expect(result.current.user).toBeNull();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(AsyncStorage.removeItem).toHaveBeenCalledWith('auth_token');
  });

  it('должен обновлять профиль', async () => {
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      name: 'Updated Name',
    };

    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ user: mockUser }),
    });

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.updateProfile({ name: 'Updated Name' });
    });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('должен менять пароль', async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ message: 'Password updated successfully' }),
    });

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.changePassword('old-password', 'new-password');
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });
}); 