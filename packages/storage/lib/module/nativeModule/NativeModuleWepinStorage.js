import { NativeModules, Platform } from 'react-native';
const LINKING_ERROR = `The package '@wepin/storage-rn' doesn't seem to be linked. Make sure: \n\n` + Platform.select({
  ios: "- You have run 'pod install'\n",
  default: ''
}) + '- You rebuilt the app after installing the package\n' + '- You are not using Expo Go\n';
const StorageRn = NativeModules.WepinStorageRn ? NativeModules.WepinStorageRn : new Proxy({}, {
  get() {
    throw new Error(LINKING_ERROR);
  }
});
export const initializeStorage = async appId => {
  return StorageRn.initializeStorage(appId);
};
export const setItem = async (appId, key, value) => {
  return StorageRn.setItem(appId, key, value);
};
export const setAllItems = async (appId, data) => {
  return StorageRn.setAllItems(appId, data);
};
export const getItem = async (appId, key) => {
  return StorageRn.getItem(appId, key);
};
export const getAllItems = async appId => {
  return StorageRn.getAllItems(appId);
};
export const removeItem = async (appId, key) => {
  return StorageRn.removeItem(appId, key);
};
export const clear = async appId => {
  return StorageRn.clear(appId);
};
//# sourceMappingURL=NativeModuleWepinStorage.js.map