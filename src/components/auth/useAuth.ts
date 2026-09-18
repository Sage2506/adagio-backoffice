import { useState, useEffect, useCallback } from 'react';
import { getCurrentUser, logOut as logOutRequest, refreshSession } from '../../services/user';
import { clearDemoReadOnly, setDemoReadOnlyForEmail } from '../../utils/demoMode';

const JWT_EXPIRY_THRESHOLD_MS = 5 * 60 * 1000;

function parseJwtExpiryMs(): number | null {
  const jwtPayload = document.cookie
    .split('; ')
    .find((cookie) => cookie.startsWith('jwt='));

  if (!jwtPayload) return null;

  const rawToken = decodeURIComponent(jwtPayload.split('=').slice(1).join('='));
  if (!rawToken) return null;

  try {
    const base64Url = rawToken.split('.')[1];
    if (!base64Url) return null;

    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
    const decodedPayload = JSON.parse(atob(padded));
    const expirySeconds = decodedPayload.exp;

    if (!expirySeconds) return null;

    return expirySeconds * 1000;
  } catch {
    return null;
  }
}

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

    const expiryMs = parseJwtExpiryMs();
    if (expiryMs === null) return;

    const msUntilExpiry = expiryMs - Date.now();
    if (msUntilExpiry <= 0) {
      refreshAuthSilently();
      return;
    }

    const delay = Math.max(msUntilExpiry - JWT_EXPIRY_THRESHOLD_MS, 0);
    const timeoutId = window.setTimeout(() => {
      refreshAuthSilently();
    }, delay);

    return () => window.clearTimeout(timeoutId);
  }, [isAuthenticated, refreshAuthSilently]);

  useEffect(() => {
    if (isLoading) return;

    const jwtCookie = document.cookie
      .split('; ')
      .find((cookie) => cookie.startsWith('jwt='));

    if (!jwtCookie) {
      clearDemoReadOnly();
      setUser(null);
      setIsDemoReadOnly(false);
      setIsAuthenticated(false);
    }
  }, [isLoading]);

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