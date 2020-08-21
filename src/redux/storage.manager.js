export default class StorageManeger {
  static saveAllObj = arrayOfKeyValue => {
    try {
      for (let obj of arrayOfKeyValue) {
        if (obj.key && obj.value) StorageManeger.saveObj(obj.key, obj.value);
      }
    } catch {}
  };
  static saveObj = (key, value) => {
    value = typeof value === 'object' ? JSON.stringify(value) : value;
    localStorage.setItem(key, value);
  };

  static getObj = (key, obj = false) => {
    let value = localStorage.getItem(key);
    if (!obj) return value;
    try {
      value = JSON.parse(value);
    } catch {
    } finally {
      return value;
    }
  };

  static removeObj = key => {
    localStorage.removeItem(key);
  };
}
