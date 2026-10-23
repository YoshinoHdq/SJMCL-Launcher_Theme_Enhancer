  // src/utils/storage.ts
  var PREFIX = "lte-";
  var _lteHostApi = null;
  function getLocal(key, defaultValue) {
    try {
      const v = localStorage.getItem(PREFIX + key);
      return v !== null ? JSON.parse(v) : defaultValue;
    } catch (e) {
      return defaultValue;
    }
  }
  function setLocal(key, value) {
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(value));
    } catch (e) {
    }
  }
  