"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setItem = exports.setAllItems = exports.removeItem = exports.initializeStorage = exports.getItem = exports.getAllItems = exports.clear = void 0;
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
const initializeStorage = async appId => {
  return StorageRn.initializeStorage(appId);
};
exports.initializeStorage = initializeStorage;
const setItem = async (appId, key, value) => {
  return StorageRn.setItem(appId, key, value);
};
exports.setItem = setItem;
const setAllItems = async (appId, data) => {
  return StorageRn.setAllItems(appId, data);
};
exports.setAllItems = setAllItems;
const getItem = async (appId, key) => {
  return StorageRn.getItem(appId, key);
};
exports.getItem = getItem;
const getAllItems = async appId => {
  return StorageRn.getAllItems(appId);
};
exports.getAllItems = getAllItems;
const removeItem = async (appId, key) => {
  return StorageRn.removeItem(appId, key);
};
exports.removeItem = removeItem;
const clear = async appId => {
  return StorageRn.clear(appId);
};
exports.clear = clear;
//# sourceMappingURL=NativeModuleWepinStorage.js.map