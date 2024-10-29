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
export const setItem = async (key, value) => {
  return StorageRn.setItem(key, value);
};
export const getItem = async key => {
  return StorageRn.getItem(key);
};
export const removeItem = async key => {
  return StorageRn.removeItem(key);
};
export const clear = async () => {
  return StorageRn.clear();
};
//# sourceMappingURL=NativeModuleWepinStorage.js.map