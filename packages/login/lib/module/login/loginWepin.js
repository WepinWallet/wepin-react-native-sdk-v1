import { isErrorResponse, isFirebaseErrorResponse } from '@wepin/fetch-js';
export const checkExistFirebaseLoginSession = async (wepinFetch, storage) => {
  const token = await storage.getLocalStorage('firebase:wepin');
  if (token != null) {
    try {
      const response = await wepinFetch.wepinFirebaseApi.getRefreshIdToken(token.refreshToken);
      if (isFirebaseErrorResponse(response)) {
        return false;
      }
      const newToken = {
        provider: token.provider,
        idToken: response,
        refreshToken: token.refreshToken
      };
      await storage.setLocalStorage('firebase:wepin', newToken);
      return true;
    } catch (error) {
      wepinFetch.setToken();
      await storage.clearAllLocalStorage(true);
      return false;
    }
  } else {
    wepinFetch.setToken();
    await storage.clearAllLocalStorage(true);
    return false;
  }
};
export const checkExistWepinLoginSession = async (wepinFetch, storage) => {
  const token = await storage.getLocalStorage('wepin:connectUser');
  const userId = await storage.getLocalStorage('user_id');
  if (token != null && userId != null) {
    wepinFetch.setToken(token);
    // wepinNetworkManager.setAuthToken(wepinToken.accessToken, wepinToken.refreshToken);

    try {
      const response = await wepinFetch.wepinApi.user.refreshToken({
        userId
      });
      if (isErrorResponse(response)) {
        return false;
      }
      const newToken = {
        accessToken: response.token,
        refreshToken: token.refreshToken
      };
      await storage.setLocalStorage('wepin:connectUser', newToken);
      wepinFetch.setToken(newToken);
      return true;
    } catch (error) {
      wepinFetch.setToken();
      await storage.clearAllLocalStorage(true);
      return false;
    }
  } else {
    wepinFetch.setToken();
    await storage.clearAllLocalStorage(true);
    return false;
  }
};
export const getLoginUserStorage = async storage => {
  const data = await storage.getAllLocalStorage();
  if (!data) {
    return null;
  }
  const walletId = data.wallet_id;
  const userInfo = data.user_info;
  const connectUser = data['wepin:connectUser'];
  const userStatus = data.user_status;
  if (!userInfo || !connectUser || !userStatus) {
    return null;
  }
  return {
    status: 'success',
    userInfo: {
      userId: userInfo.userInfo.userId,
      email: userInfo.userInfo.email,
      provider: userInfo.userInfo.provider,
      use2FA: userInfo.userInfo.use2FA
    },
    userStatus: userStatus,
    walletId: walletId,
    token: connectUser
  };
};
//# sourceMappingURL=loginWepin.js.map