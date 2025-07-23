export const createAuthHeader = (accessToken: string | null) => {
  return accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined;
};
