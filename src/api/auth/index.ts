import { authLogin } from './login';
import { authLogout } from './logout';
import { authRegister } from './register';
import { authRegisterWorker } from './register-worker';

export const authApi = {
   login: authLogin,
   register: authRegister,
   logout: authLogout,
   registerWorker: authRegisterWorker,
} as const;

export { authLogin, authLogout, authRegister, authRegisterWorker };
export { AUTH_ENDPOINTS } from './endpoints';

export default authApi;
