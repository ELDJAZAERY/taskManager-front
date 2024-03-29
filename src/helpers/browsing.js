import { browserHistory } from 'react-router';

/**
 * @param {Object} query
 */
export const addQuery = query => {
  const location = Object.assign({}, browserHistory.getCurrentLocation());
  Object.assign(location.query, query);
  browserHistory.push(location);
};

/**
 * @param {Object} query
 */
export const replaceQuery = query => {
  const location = Object.assign({}, browserHistory.getCurrentLocation());
  Object.assign(location.query, query);
  browserHistory.replace(location);
};

/**
 * @param {...String} queryNames
 */
export const removeQuery = (...queryNames) => {
  const location = Object.assign({}, browserHistory.getCurrentLocation());
  queryNames.forEach(q => delete location.query[q]);
  browserHistory.push(location);
};

export const getURL = () => {
  return browserHistory.getCurrentLocation();
};

export const redirect = url => {
  window.location.href = `${url}`;
};
