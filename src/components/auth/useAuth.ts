import { useState, useEffect, useCallback } from 'react';
import { tokenManager } from '../../services/api';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isPersistent, setIsPersistent] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const hasToken = tokenManager.hasToken();
      setIsAuthenticated(hasToken);
      setIsPersistent(tokenManager.isTokenPersistent());
      setIsLoading(false);
    };

    checkAuth();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'id_token') {
        checkAuth();
      }
    };

    const handleUnauthorized = () => {
      setIsAuthenticated(false);
      setIsPersistent(false);
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('unauthorized', handleUnauthorized);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('unauthorized', handleUnauthorized);
    };
  }, []);

  const login = useCallback((token: string, rememberMe: boolean = false) => {
    tokenManager.setToken(token, rememberMe);
    setIsAuthenticated(true);
    setIsPersistent(rememberMe);
  }, []);

  const logout = useCallback(() => {
    tokenManager.removeToken();
    setIsAuthenticated(false);
    setIsPersistent(false);
  }, []);

  return {
    isAuthenticated,
    isLoading,
    isPersistent,
    login,
    logout,
    getToken: tokenManager.getToken
  };
};