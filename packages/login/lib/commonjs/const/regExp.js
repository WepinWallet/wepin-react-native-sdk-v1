"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.passwordRegExp = exports.emailRegExp = void 0;
const emailRegExp = exports.emailRegExp = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/i;
const passwordRegExp = exports.passwordRegExp = /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,128}$/;
//# sourceMappingURL=regExp.js.map