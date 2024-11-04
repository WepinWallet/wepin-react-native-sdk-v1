"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AppAuthConst = void 0;
class AppAuthConst {
  static getAuthorizationEndpoint(provider) {
    switch (provider) {
      case 'google':
        return 'https://accounts.google.com/o/oauth2/v2/auth';
      case 'apple':
        return 'https://appleid.apple.com/auth/authorize';
      case 'discord':
        return 'https://discord.com/api/oauth2/authorize';
      case 'naver':
        return 'https://nid.naver.com/oauth2.0/authorize';
      default:
        return 'https://example.com';
      // 빈 문자열 대신 기본 URL을 제공
    }
  }
  static getTokenEndpoint(provider) {
    switch (provider) {
      case 'google':
        return 'https://oauth2.googleapis.com/token';
      case 'apple':
        return 'https://appleid.apple.com/auth/token';
      case 'discord':
        return 'https://discord.com/api/oauth2/token';
      case 'naver':
        return 'https://nid.naver.com/oauth2.0/token';
      default:
        return 'https://example.com';
      // 빈 문자열 대신 기본 URL을 제공
    }
  }
}
exports.AppAuthConst = AppAuthConst;
//# sourceMappingURL=appAuthConst.js.map