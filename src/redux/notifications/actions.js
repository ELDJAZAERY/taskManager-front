import {
  SUCCESS_MESSAGE,
  CLEAR_SUCCESS_MESSAGE,
  ERROR_MESSAGE,
  CLEAR_ERROR_MESSAGE,
  WARNING_MESSAGE,
  CLEAR_WARNING_MESSAGE
} from './constants';

import { actionsEnum, typesEnum } from './enums';

export const systemNotif = (
  action = 'push',
  type = 'error',
  message,
  status,
  title
) => {
  if (action === actionsEnum.PUSH) {
    let actionType =
      type === typesEnum.SUCCESS
        ? SUCCESS_MESSAGE
        : type === typesEnum.WARNING
        ? WARNING_MESSAGE
        : ERROR_MESSAGE;

    if (!title) {
      title =
        type === typesEnum.SUCCESS
          ? 'SUCCESS'
          : type === typesEnum.WARNING
          ? 'WARNING'
          : 'ERROR';
    }

    return {
      type: actionType,
      payload: { title, message, status }
    };
  }

  if (action === actionsEnum.CLEAR) {
    let actionType =
      type === typesEnum.SUCCESS
        ? CLEAR_SUCCESS_MESSAGE
        : type === typesEnum.WARNING
        ? CLEAR_WARNING_MESSAGE
        : CLEAR_ERROR_MESSAGE;

    return {
      type: actionType,
      payload: ''
    };
  }

  return {
    type: '',
    payload: ''
  };
};
