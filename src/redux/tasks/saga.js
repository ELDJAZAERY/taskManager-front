import { all, call, fork, put, takeEvery } from "redux-saga/effects";

import { FETCH_TASK } from "./constants";

import { fetchTasksSuccess, fetchTasksError } from "./actions";

import { getTasks } from "../../api/tasks";

import { systemNotif } from "../actions";
import { actionsEnum, typesEnum } from "../notifications/enums";

/**
 * LOGIN
 *
 */
export function* watchFetchTasks() {
  yield takeEvery(FETCH_TASK, fetchAlltasks);
}

const fetchTaskAsync = async () => await getTasks();

function* fetchAlltasks() {
  try {
    const tasks = yield call(fetchTaskAsync);

    // push just user in store
    yield put(fetchTasksSuccess(tasks));
  } catch ({ status = 400, errMessage }) {
    yield put(fetchTasksError(errMessage));
    yield put(
      systemNotif(
        actionsEnum.PUSH,
        typesEnum.ERROR,
        errMessage,
        status === 401 ? 400 : status,
        status === 401 ? "Authentication Error" : "Error"
      )
    );
  }
}

export default function* rootSaga() {
  yield all([fork(watchFetchTasks)]);
}
