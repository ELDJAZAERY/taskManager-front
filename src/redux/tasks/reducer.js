import {
  FETCH_TASK,
  FETCH_TASK_SUCCESS,
  FETCH_TASK_ERROR
} from './constants';

const INIT_STATE = {
  tasks: [],
  loading: false,
  error: ''
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {

    case FETCH_TASK:
      return { ...state, loading: true, error: '' };

    case FETCH_TASK_SUCCESS:
      return { ...state, loading: false, tasks: action.payload, error: '' };

    case FETCH_TASK_ERROR:
      return {
        ...state,
        loading: false,
        tasks: [],
        error: action.payload.message
      };

    default:
      return { ...state };
  }
};
