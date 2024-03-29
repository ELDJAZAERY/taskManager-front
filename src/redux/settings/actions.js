import { CHANGE_LOCALE } from './constants';

export const changeLocale = locale => {
  localStorage.setItem('currentLanguage', locale);
  return {
    type: CHANGE_LOCALE,
    payload: locale
  };
};
