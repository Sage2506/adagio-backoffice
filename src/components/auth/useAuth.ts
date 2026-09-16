import { useState, useEffect, useCallback } from 'react';
import { getCurrentUser, logOut as logOutRequest } from '../../services/user';
import { clearDemoReadOnly, setDemoReadOnlyForEmail } from '../../utils/demoMode';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [isDemoReadOnly, setIsDemoReadOnly] = useState(false);

  const checkAuth = useCallback(async () => {
    // The JWT lives in an HttpOnly cookie, invisible to JS, so the only way
    // to know if the session is valid is asking the backend.
    const user = await getCurrentUser();
    setUser(user);
    setIsAuthenticated(!!user);
    setIsDemoReadOnly(setDemoReadOnlyForEmail(user?.email));
    setIsLoading(false);
  }, []);

  useEffect(() => {
    checkAuth();

    const handleUnauthorized = () => {
      clearDemoReadOnly();
      setUser(null);
      setIsDemoReadOnly(false);
      setIsAuthenticated(false);
    };

    window.addEventListener('unauthorized', handleUnauthorized);

    return () => {
      window.removeEventListener('unauthorized', handleUnauthorized);
    };
  }, [checkAuth]);

  const login = useCallback(async () => {
    setIsAuthenticated(true);
    await checkAuth();
  }, [checkAuth]);

  const logout = useCallback(async () => {
    await logOutRequest();
    clearDemoReadOnly();
    setUser(null);
    setIsDemoReadOnly(false);
    setIsAuthenticated(false);
  }, []);

  return {
    isAuthenticated,
    isDemoReadOnly,
    isLoading,
    login,
    logout,
    user
  };
};