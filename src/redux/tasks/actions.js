import {
  FETCH_TASK,
  FETCH_TASK_SUCCESS,
  FETCH_TASK_ERROR
} from './constants';

export const fetchTasks = ( history) => ({
  type: FETCH_TASK,
  payload: { history }
});

export const fetchTasksSuccess = tasks => ({
  type: FETCH_TASK_SUCCESS,
  payload: tasks
});

export const fetchTasksError = message => ({
  type: FETCH_TASK_ERROR,
  payload: { message }
});
