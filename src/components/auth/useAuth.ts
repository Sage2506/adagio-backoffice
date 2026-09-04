import { useState, useEffect, useCallback } from 'react';
import { getCurrentUser, logOut as logOutRequest } from '../../services/user';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    // The JWT lives in an HttpOnly cookie, invisible to JS, so the only way
    // to know if the session is valid is asking the backend.
    const user = await getCurrentUser();
    setIsAuthenticated(!!user);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    checkAuth();

    const handleUnauthorized = () => {
      setIsAuthenticated(false);
    };

    window.addEventListener('unauthorized', handleUnauthorized);

    return () => {
      window.removeEventListener('unauthorized', handleUnauthorized);
    };
  }, [checkAuth]);

  const login = useCallback(() => {
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(async () => {
    await logOutRequest();
    setIsAuthenticated(false);
  }, []);

  return {
    isAuthenticated,
    isLoading,
    login,
    logout
  };
};