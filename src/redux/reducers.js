import { combineReducers } from 'redux';
import settings from './settings/reducer';
import menu from './menu/reducer';
import authUser from './auth/reducer';
import notificatoins from './notifications/reducer';
import taskManager from './tasks/reducer'

const reducers = combineReducers({
  menu,
  settings,
  authUser,
  notificatoins,
  taskManager
});

export default reducers;
