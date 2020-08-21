import axios from 'axios';
import createAuthRefreshInterceptor from 'axios-auth-refresh';
import StorageManeger from '../redux/storage.manager';

const getBasURL = () => {
  return process.env.REACT_APP_MAP_API_URL || 'http://localhost:8081/api';
};

// Function that will be called to refresh authorization
const refreshAuthLogic = async failedRequest => {
  const user = StorageManeger.getObj('user', true);
  const { identificator } = user || {};

  const token = StorageManeger.getObj('token');
  const refreshToken = StorageManeger.getObj('refreshToken');

  try {
    const response = await axios.post(`${getBasURL()}/auth/refresh`, {
      identificator,
      token,
      refreshToken
    });

    const {
      token: newToken,
      refreshToken: newRefreshToken,
      user
    } = response.data;

    StorageManeger.saveAllObj([
      { key: 'user', value: user },
      { key: 'token', value: newToken },
      { key: 'refreshToken', value: newRefreshToken }
    ]);

    failedRequest.response.config.headers[
      'authorization'
    ] = `Bearer ${newToken}`;

    return Promise.resolve();
  } catch (err) {
    // Sessions expire
    localStorage.setItem('token', '');
    localStorage.setItem('refreshToken', '');
    return Promise.reject(failedRequest);
  }
};

const errorHandler = err => {
  let status = 421; // connection lost
  let errMessage = 'Connection lost, Please check your internet connection';

  if (err.response) {
    status = err.response.status;
    errMessage = err.response.data || 'Some thing went wrong';
  }

  // eslint-disable-next-line no-throw-literal
  throw {
    status,
    errMessage
  };
};

export const customAxiosInst = (autoRefreshToken = true) => {
  const user = StorageManeger.getObj('user', true);
  const { identificator } = user || {};

  const token = StorageManeger.getObj('token');
  const authorization = `Bearer ${token}`;

  const headers = {
    'Access-Control-Allow-Origin': '*',
    authorization,
    identificator
  };

  const ATGISServer = axios.create({
    baseURL: getBasURL(),
    validateStatus: status => {
      return status >= 200 && status < 400; // default
    },
    headers
  });

  if (autoRefreshToken)
    createAuthRefreshInterceptor(ATGISServer, refreshAuthLogic);

  ATGISServer.interceptors.response.use(res => res, errorHandler);

  return ATGISServer;
};

export default customAxiosInst;
