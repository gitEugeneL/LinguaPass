import { IDENTITY } from '../../helpers/api.tsx';

export const authUrls = {
  registration: `${IDENTITY}/registration`,

  login: `${IDENTITY}/login`,

  refresh: `${IDENTITY}/refresh`,

  generateCode: `${IDENTITY}/generate-code`,

  resetPassword: `${IDENTITY}/reset-password`
};
