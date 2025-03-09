import { ReactNode, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router';
import { useAuthStore } from '../store/auth/auth.store.ts';

export default function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();

  const accessToken = useAuthStore((state) => state.accessToken);
  const accessTokenExpires = useAuthStore((state) => state.accessTokenExpires);
  const refreshTokenExpires = useAuthStore((state) => state.refreshTokenExpires);
  const refresh = useAuthStore((state) => state.refresh);
  const resetState = useAuthStore((state) => state.resetState);

  const date = new Date(new Date().getTime() - 60000); // Current UTC time minus 1 min
  const checkTime = 30000; // 30sec

  // Function to check authentication status
  const checkAuth = () => {
    // const date = new Date(new Date().getTime() - 60000); // Current UTC time minus 1 minute
    if (accessToken && accessTokenExpires && new Date(accessTokenExpires) <= date) {
      // Access token exists but has expired (or will in less than 1 minute)
      console.log('Access token exists but is expired (or almost expired)');
      console.log('Refreshing token...');
      refresh(); // Attempt to refresh the access token
    } else if (!accessToken && refreshTokenExpires && new Date(refreshTokenExpires) >= date) {
      // Access token is missing but the refresh token is still valid
      console.log('Access token is missing, but refresh token is valid');
      console.log('Refreshing token...');
      refresh(); // Attempt to refresh the access token
    } else if (!refreshTokenExpires || new Date(refreshTokenExpires) <= date) {
      // Refresh token is missing or expired — perform full logout
      console.log('Full logout. Refresh token is expired or missing');
      resetState(); // Reset authentication state
      navigate('/auth/login'); // Redirect to login page
    } else {
      // Both tokens are valid — no action needed
      console.log('Authentication is valid');
    }
  };

  // Check authentication status on component load and every 30 seconds
  useEffect(() => {
    checkAuth(); // Initial check
    const interval = setInterval(checkAuth, checkTime); // Check every 30 seconds

    return () => clearInterval(interval); // Clean up interval on unmount
  }, [accessToken, accessTokenExpires, refreshTokenExpires, refresh, resetState, navigate]);

  // If the refresh token is missing or expired, redirect to the login page
  if (!refreshTokenExpires || new Date(refreshTokenExpires) <= date) {
    return <Navigate to='/auth/login' />;
  }

  return children;
}
