import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
import { LOGIN_USER, LOGOUT_USER, REGISTER_USER } from './constants';

import {
  loginUserSuccess,
  loginUserError,
  registerUserError,
  registerUserSuccess
} from '../actions';

import { login, fetchRegister } from '../../api/auth';

import { systemNotif } from '../actions';
import { actionsEnum, typesEnum } from '../notifications/enums';
import StorageManeger from '../storage.manager';

/**
 * LOGIN
 *
 */
export function* watchLoginUser() {
  yield takeEvery(LOGIN_USER, loginWithEmailPassword);
}

const logintAsync = async (Identificator, password) =>
  await login(Identificator, password);

function* loginWithEmailPassword({ payload }) {
  const { Identificator, password } = payload.user;
  const { history } = payload;
  try {
    const loginUser = yield call(logintAsync, Identificator, password);
    const { token, refreshToken, user } = loginUser;

    // token & refreshToken saved in localstorage only
    StorageManeger.saveAllObj([
      { key: 'user', value: user },
      { key: 'token', value: token },
      { key: 'refreshToken', value: refreshToken }
    ]);

    // push just user in store
    yield put(loginUserSuccess(user));
    history.push('/');
  } catch ({ status = 400, errMessage }) {
    yield put(loginUserError());
    yield put(
      systemNotif(
        actionsEnum.PUSH,
        typesEnum.ERROR,
        errMessage,
        status === 401 ? 400 : status ,
        status === 401 ? 'Authentication Error' : 'Error'
      )
    );
    if (status === 406) history.push('/user/send-mail');
  }
}

/**
 * REGISTER
 *
 */
export function* watchRegisterUser() {
  yield takeEvery(REGISTER_USER, register);
}

function* register({ payload }) {
  const { user, history } = payload;
  try {
    yield call(registerAsync, user, history);
    yield put(registerUserSuccess());
    yield put(
      systemNotif(
        actionsEnum.PUSH,
        typesEnum.SUCCESS,
        'Registration successful',
        'Success'
      )
    );
  } catch ({ status, errMessage }) {
    yield put(registerUserError());
    yield put(
      systemNotif(
        actionsEnum.PUSH,
        typesEnum.ERROR,
        errMessage,
        status === 401 ? 'Authentication Error' : 'Error'
      )
    );
  }
}

const registerAsync = async (user, history) => {
  await fetchRegister(user);
  // redirect to login after successful registration
  history.push('/login');
};

/**
 *  LOGOUT
 *
 */

export function* watchLogoutUser() {
  yield takeEvery(LOGOUT_USER, logout);
}

function* logout({ payload }) {
  const { history } = payload;
  try {
    yield call(logoutAsync, history);
  } catch (error) {}
}

const logoutAsync = async history => {
  localStorage.removeItem('user');
  history.push('/');
};

export default function* rootSaga() {
  yield all([fork(watchLoginUser), fork(watchLogoutUser)]);
}
