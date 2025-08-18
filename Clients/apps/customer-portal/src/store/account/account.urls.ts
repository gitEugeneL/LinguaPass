import { ACCOUNT } from '@clients/shared';

export const accountUrls = {
  getCurrentAccount: `${ACCOUNT}/my-account`,

  getShortUserInfo: `${ACCOUNT}/short-info`,

  sendApplication: `${ACCOUNT}/send-application`,

  resetApplication: `${ACCOUNT}/reset-application`
};
