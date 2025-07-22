import { type ReactNode, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuthStore } from '../store/auth/auth.store.ts';
import { useShallow } from 'zustand/react/shallow';
import DangerCard from '../components/base/DangerCard/DangerCard.tsx';

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthProblem, setIsAuthProblem] = useState<boolean>(false);
  const [manualRefreshCount, setManualRefreshCount] = useState<number>(0);
  const MAX_MANUAL_REFRESH_COUNT = 5;

  const navigate = useNavigate();

  const {
    accessToken,
    accessTokenExpires,
    refreshTokenExpires,
    isRefreshTokenProblem,
    isLoading,
    refresh,
    logout,
    resetState
  } = useAuthStore(
    useShallow((state) => ({
      accessToken: state.accessToken,
      accessTokenExpires: state.accessTokenExpires,
      refreshTokenExpires: state.refreshTokenExpires,
      isRefreshTokenProblem: state.isRefreshTokenProblem,
      isLoading: state.isLoading,
      refresh: state.refresh,
      logout: state.logout,
      resetState: state.resetState
    }))
  );

  useEffect(() => {
    if (isRefreshTokenProblem) {
      setIsAuthProblem(true);
    }
  }, [isRefreshTokenProblem]);

  const manualRefresh = () => {
    if (manualRefreshCount >= MAX_MANUAL_REFRESH_COUNT) {
      logout();
    } else {
      setManualRefreshCount(manualRefreshCount + 1);
      refresh();
    }
  };

  const checkAuth = async () => {
    const currentDate = new Date(new Date().getTime() - 60000); // Current UTC time minus 1 min

    const isRefreshTokenValid = refreshTokenExpires && new Date(refreshTokenExpires) > currentDate;
    const isAccessTokenExpired = accessTokenExpires && new Date(accessTokenExpires) <= currentDate;
    const isRefreshTokenExpired =
      !refreshTokenExpires || new Date(refreshTokenExpires) <= currentDate;

    if (accessToken && !isAccessTokenExpired) {
      setIsAuthProblem(false);
    } else if (!accessToken && isRefreshTokenValid) {
      refresh();
    } else if (accessToken && isAccessTokenExpired && isRefreshTokenValid) {
      refresh();
    } else if (isRefreshTokenExpired) {
      resetState();
      navigate('auth/login');
    }
  };

  useEffect(() => {
    checkAuth();
    const interval = setInterval(checkAuth, 30000);
    return () => clearInterval(interval);
  }, [accessToken, accessTokenExpires, refreshTokenExpires, refresh, resetState, navigate]);

  if (isAuthProblem) {
    return (
      <DangerCard
        title='Authorization Issue!'
        description='Please wait, try refreshing, or log out.'
        btn1Text='Refresh'
        btn2Text='Logout'
        btn1Action={manualRefresh}
        btn2Action={logout}
        btn1IsLoading={isLoading}
      />
    );
  }

  if (accessToken) {
    return children;
  }
}
