"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setItem = exports.removeItem = exports.getItem = exports.clear = void 0;
var _reactNative = require("react-native");
const LINKING_ERROR = `The package '@wepin/storage-rn' doesn't seem to be linked. Make sure: \n\n` + _reactNative.Platform.select({
  ios: "- You have run 'pod install'\n",
  default: ''
}) + '- You rebuilt the app after installing the package\n' + '- You are not using Expo Go\n';
const StorageRn = _reactNative.NativeModules.WepinStorageRn ? _reactNative.NativeModules.WepinStorageRn : new Proxy({}, {
  get() {
    throw new Error(LINKING_ERROR);
  }
});
const setItem = async (key, value) => {
  return StorageRn.setItem(key, value);
};
exports.setItem = setItem;
const getItem = async key => {
  return StorageRn.getItem(key);
};
exports.getItem = getItem;
const removeItem = async key => {
  return StorageRn.removeItem(key);
};
exports.removeItem = removeItem;
const clear = async () => {
  return StorageRn.clear();
};
exports.clear = clear;
//# sourceMappingURL=NativeModuleWepinStorage.js.map