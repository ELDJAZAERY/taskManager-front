import {
  SUCCESS_MESSAGE,
  CLEAR_SUCCESS_MESSAGE,
  ERROR_MESSAGE,
  CLEAR_ERROR_MESSAGE,
  WARNING_MESSAGE,
  CLEAR_WARNING_MESSAGE
} from './constants';

const INIT_STATE = {
  error: null,
  success: null,
  warning: null
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case SUCCESS_MESSAGE:
      return { ...state, success: action.payload };
    case CLEAR_SUCCESS_MESSAGE:
      return { ...state, success: INIT_STATE.success };
    case ERROR_MESSAGE:
      return { ...state, error: action.payload };
    case CLEAR_ERROR_MESSAGE:
      return { ...state, error: INIT_STATE.error };
    case WARNING_MESSAGE:
      return { ...state, warning: action.payload };
    case CLEAR_WARNING_MESSAGE:
      return { ...state, warning: INIT_STATE.warning };

    default:
      return { ...state };
  }
};
