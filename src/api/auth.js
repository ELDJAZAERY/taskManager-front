import ATGISServer from './axios';

export const login = async (identificator, password) => {
  const customAxios = ATGISServer(false);

  const response = await customAxios.post('/auth/login', {
    identificator,
    password
  });

  return response.data;
};

export const fetchRegister = async user => {
  const customAxios = ATGISServer(false);

  const response = await customAxios.post('/auth/register', {
    ...user
  });

  return response.data;
};

export const confirmMail = async (identificator, token) => {
  const customAxios = ATGISServer(false);

  const response = await customAxios.post('/auth/confirm', {
    identificator,
    token
  });

  return response.data;
};

export const resendCMail = async email => {
  const customAxios = ATGISServer(false);

  const response = await customAxios.post('/auth/resendc-mail', {
    email
  });

  return response.data;
};

export const sendResetPass = async email => {
  const customAxios = ATGISServer(false);

  const response = await customAxios.post('/auth/forgot-password', {
    email
  });

  return response.data;
};

export const resetPasswordWithOobCode = async resetOrder => {
  const customAxios = ATGISServer(false);

  const response = await customAxios.post('/auth/reset-password', {
    ...resetOrder
  });

  return response.data;
};
