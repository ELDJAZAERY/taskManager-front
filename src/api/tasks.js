import ATGISServer from './axios';

export const getTasks = async () => {

  const customAxios = ATGISServer();

  // the axios errors will be catched in the middleware added with axios config
  const response = await customAxios.get(`/task/all`);

  return response.data;
};


export const createTask = async (task) => {

  const customAxios = ATGISServer();

  // the axios errors will be catched in the middleware added with axios config
  const response = await customAxios.post(`/task/create`, {
    ...task
  });

  return response.data;
};


export const updateTask = async (id,task) => {

  const customAxios = ATGISServer();

  // the axios errors will be catched in the middleware added with axios config
  const response = await customAxios.put(`/task/update/${id}`, {
    ...task
  });

  return response.data;
};

export const deleteTask = async (id) => {

  const customAxios = ATGISServer();

  // the axios errors will be catched in the middleware added with axios config
  const response = await customAxios.delete(`/task/delete/${id}`);

  return response.data;
};

export const updateStatus = async (id,status) => {

  const customAxios = ATGISServer();

  // the axios errors will be catched in the middleware added with axios config
  const response = await customAxios.put(`/task/status/update/${id}`,{
    status
  });

  return response.data;
};

export const getTask = async (id)=> {

  const customAxios = ATGISServer();

  // the axios errors will be catched in the middleware added with axios config
  const response = await customAxios.get(`/task/get/${id}`);

  return response.data;
};