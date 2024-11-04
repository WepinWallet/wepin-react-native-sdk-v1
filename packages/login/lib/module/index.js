import { WepinLogin } from './wepinLogin';
import base64 from 'react-native-base64';

// 전역 범위에 atob 및 btoa 함수 정의
global.atob = base64.decode;
global.btoa = base64.encode;
export { getSignForLogin } from './utils/getSignForLogin';
export { WEPIN_OAUTH2, WEPIN_OAUTH_TOKEN_TYPE } from './const/config';
export default WepinLogin;
//# sourceMappingURL=index.js.map