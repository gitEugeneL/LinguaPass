import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuthStore } from '../store/auth/auth.store.ts';

export default function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();

  const accessToken = useAuthStore((state) => state.accessToken);
  const accessTokenExpires = useAuthStore((state) => state.accessTokenExpires);
  const refreshTokenExpires = useAuthStore((state) => state.refreshTokenExpires);
  const isRefreshTokenProblem = useAuthStore((state) => state.isRefreshTokenProblem);

  const refresh = useAuthStore((state) => state.refresh);
  const resetState = useAuthStore((state) => state.resetState);

  useEffect(() => {
    if (isRefreshTokenProblem) {
      console.log('Refresh token problems'); // for dev
    }
  }, [isRefreshTokenProblem]);

  const checkAuth = () => {
    const currentDate = new Date(new Date().getTime() - 60000); // Current UTC time minus 1 min

    const isRefreshTokenValid = refreshTokenExpires && new Date(refreshTokenExpires) > currentDate;
    const isAccessTokenExpired = accessTokenExpires && new Date(accessTokenExpires) <= currentDate;
    const isRefreshTokenExpired =
      !refreshTokenExpires || new Date(refreshTokenExpires) <= currentDate;

    if (!accessToken && isRefreshTokenValid) {
      refresh();
    } else if (accessToken && isAccessTokenExpired && isRefreshTokenValid) {
      refresh();
    } else if (isRefreshTokenExpired) {
      resetState();
      navigate('auth/login');
    }
  };

  useEffect(() => {
    checkAuth(); // Initial check
    const interval = setInterval(checkAuth, 30000); // Check every 30 seconds
    return () => clearInterval(interval); // Clean up interval on unmount
  }, [accessToken, accessTokenExpires, refreshTokenExpires, refresh, resetState, navigate]);

  return children;
}
