import { all } from "redux-saga/effects";
import authSagas from "./auth/saga";
import taskSaga from "./tasks/saga";

export default function* rootSaga(getState) {
  yield all([authSagas(), taskSaga()]);
}
