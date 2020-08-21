import ATGISServer from './axios';

export const fetchUsers = async (
  pageSize,
  pageNumber,
  keyword,
  orderBy,
  order
) => {
  const filter = {
    pageSize,
    pageNumber,
    keyword,
    orderBy,
    order
  };

  const customAxios = ATGISServer();

  // the axios errors will be catched in the middleware added with axios config
  const response = await customAxios.post(`/user`, {
    ...filter
  });

  return response.data;
};

export const getUser = async identificator => {
  const customAxios = ATGISServer();

  // the axios errors will be catched in the middleware added with axios config
  const response = await customAxios.get(`/user/profile/${identificator}`);

  return response.data;
};

export const addUser = async user => {
  const customAxios = ATGISServer();

  // the axios errors will be catched in the middleware added with axios config
  const response = await customAxios.post('/user/create', { ...user });

  return response.data;
};

export const updateUser = async (identificator, user) => {
  const customAxios = ATGISServer();

  // the axios errors will be catched in the middleware added with axios config
  const response = await customAxios.put(`/user/profile/${identificator}`, {
    ...user
  });

  return response.data;
};

export const updatePassword = async (identificator, updateDTO) => {
  const customAxios = ATGISServer();

  // the axios errors will be catched in the middleware added with axios config
  const response = await customAxios.put(
    `/user/profile/${identificator}/pwd/change`,
    {
      ...updateDTO
    }
  );

  return response.data;
};

export const resetPassword = async (
  identificator,
  password,
  confirmPassword
) => {
  const customAxios = ATGISServer();

  // the axios errors will be catched in the middleware added with axios config
  const response = await customAxios.put(
    `/user/profile/${identificator}/pwd/reset`,
    {
      password,
      confirmPassword
    }
  );

  return response.data;
};
