import { useState, useEffect, useCallback } from 'react';
import { getCurrentUser, logOut as logOutRequest, refreshSession } from '../../services/user';
import { clearDemoReadOnly, setDemoReadOnlyForEmail } from '../../utils/demoMode';

const JWT_REFRESH_BEFORE_EXPIRY_MS = 10 * 60 * 1000;

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [isDemoReadOnly, setIsDemoReadOnly] = useState(false);

  const checkAuth = useCallback(async () => {
    // The JWT lives in an HttpOnly cookie, invisible to JS, so the only way
    // to know if the session is valid is asking the backend.
    let currentUser = await getCurrentUser();

    if (!currentUser) {
      const refreshed = await refreshSession();
      if (refreshed) {
        currentUser = await getCurrentUser();
      }
    }

    setUser(currentUser);
    setIsAuthenticated(!!currentUser);
    setIsDemoReadOnly(setDemoReadOnlyForEmail(currentUser?.email));
    setIsLoading(false);
  }, []);

  const refreshAuthSilently = useCallback(async () => {
    if (!isAuthenticated) return;

    const refreshed = await refreshSession();

    if (refreshed) {
      await checkAuth();
      return;
    }

    clearDemoReadOnly();
    setUser(null);
    setIsDemoReadOnly(false);
    setIsAuthenticated(false);
  }, [checkAuth, isAuthenticated]);

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

  useEffect(() => {
    if (!isAuthenticated) return;

    // JWT is stored in an HttpOnly cookie, so JS cannot read its expiry.
    // We refresh shortly before the backend's 1-hour session expires.
    const timeoutId = window.setTimeout(() => {
      refreshAuthSilently();
    }, 50 * 60 * 1000 - JWT_REFRESH_BEFORE_EXPIRY_MS);

    return () => window.clearTimeout(timeoutId);
  }, [isAuthenticated, refreshAuthSilently]);

  const login = useCallback(async () => {
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