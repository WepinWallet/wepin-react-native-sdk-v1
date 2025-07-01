"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BaseProvider = void 0;
var _events = require("events");
// src/providers/BaseProvider.ts

/**
 * React Native용 BaseProvider 클래스
 * EventEmitter를 상속하여 Web3 이벤트 지원
 */
class BaseProvider extends _events.EventEmitter {
  // EIP-5749 기본 속성
  uuid = 'wepinprovider';
  name = 'Wepin';
  icon = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyLjE1IDIuNjkzODVDNy45MjQ5NiAyLjY5Mzg1IDQuNSA2LjExODgxIDQuNSAxMC4zNDM4QzQuNSAxMS42OTE2IDQuODU3MjYgMTIuNTM0NSA1LjQ1NDExIDE0LjA2MTlMNy44MzkzOSAxOS42NzUzQzguMTkwMjMgMjAuNjU5NCA5LjEyNTA4IDIxLjM2MzIgMTAuMjI4OSAyMS4zNjMyQzExLjI2MDEgMjEuMzYzMiAxMi4xNDc5IDIwLjc0NzEgMTIuNTQzNiAxOS44NjE0TDEzLjQ3MjEgMTcuODc2MkMxNy4wNjYgMTcuMjQ5NCAxOS44IDE0LjExNzUgMTkuOCAxMC4zNDM4QzE5Ljc5NzkgNi4xMTg4MSAxNi4zNzI5IDIuNjkzODUgMTIuMTUgMi42OTM4NVpNMTIuMTUgMTUuMzUxOUMxMi4wMDQ1IDE1LjM1MTkgMTEuODYzMyAxNS4zNDMzIDExLjcyMjEgMTUuMzMyNkwxMS43MDcyIDE1LjM2NDdMMTAuMjE4MiAxOC41NDE1TDEwLjIxNCAxOC41MzI5TDcuNzcwOTMgMTIuNzgwNUM3LjMyMzgzIDExLjY4NTIgNy4xNDE5OSAxMS4yMjc0IDcuMTQxOTkgMTAuMzQxN0M3LjE0MTk5IDcuNTc1NjQgOS4zODM5MyA1LjMzMzcgMTIuMTUgNS4zMzM3QzE0LjkxNjEgNS4zMzM3IDE3LjE1OCA3LjU3NTY0IDE3LjE1OCAxMC4zNDE3QzE3LjE1OCAxMy4xMDc4IDE0LjkxNjEgMTUuMzQ5NyAxMi4xNSAxNS4zNDk3VjE1LjM1MTlaIiBmaWxsPSIjNjQ0MEREIi8+CjxwYXRoIGQ9Ik0xMi4xNTA0IDEyLjI5NjlDMTMuMjI5MSAxMi4yOTY5IDE0LjEwMzYgMTEuNDIyNSAxNC4xMDM2IDEwLjM0MzhDMTQuMTAzNiA5LjI2NTA4IDEzLjIyOTEgOC4zOTA2MiAxMi4xNTA0IDguMzkwNjJDMTEuMDcxNyA4LjM5MDYyIDEwLjE5NzMgOS4yNjUwOCAxMC4xOTczIDEwLjM0MzhDMTAuMTk3MyAxMS40MjI1IDExLjA3MTcgMTIuMjk2OSAxMi4xNTA0IDEyLjI5NjlaIiBmaWxsPSIjNjQ0MEREIi8+Cjwvc3ZnPgo=';
  description = 'Wepin provider';

  // 상태 관리
  _state = {
    accounts: null,
    isConnected: false,
    initialized: false,
    isPermanentlyDisconnected: false
  };

  // 공개 속성
  chainId = null;
  selectedAddress = null;
  constructor() {
    super();
    // 이벤트 리스너 최대 개수 설정
    this.setMaxListeners(100);

    // 메서드 바인딩
    this._handleAccountsChanged = this._handleAccountsChanged.bind(this);
    this._handleConnect = this._handleConnect.bind(this);
    this._handleChainChanged = this._handleChainChanged.bind(this);
    this._handleDisconnect = this._handleDisconnect.bind(this);
    this.request = this.request.bind(this);
  }

  /**
   * EIP-1193 request 메서드
   * Web3 요청 수행
   */

  /**
   * 계정 변경 이벤트 처리
   */
  _handleAccountsChanged(accounts) {
    let _accounts = accounts;

    // 유효성 검증
    if (!Array.isArray(accounts)) {
      console.error('Received invalid accounts parameter', accounts);
      _accounts = [];
    }
    for (const account of _accounts) {
      if (typeof account !== 'string') {
        console.error('Received non-string account', accounts);
        _accounts = [];
        break;
      }
    }

    // 계정 변경 감지
    const accountsEqual = this._areArraysEqual(this._state.accounts || [], _accounts);
    if (!accountsEqual) {
      this._state.accounts = _accounts;

      // 선택된 주소 업데이트
      if (this.selectedAddress !== _accounts[0]) {
        this.selectedAddress = _accounts[0] || null;
      }

      // 이벤트 발생
      if (this._state.initialized) {
        this.emit('accountsChanged', _accounts);
      }
    }
  }

  /**
   * 체인 변경 이벤트 처리
   */
  _handleChainChanged({
    chainId
  }) {
    // 유효성 검증
    if (!chainId || !/^0x[0-9a-f]+$/i.test(chainId)) {
      console.error('Invalid chainId', chainId);
      return;
    }
    this._handleConnect(chainId);
    if (chainId !== this.chainId) {
      this.chainId = chainId;
      if (this._state.initialized) {
        this.emit('chainChanged', this.chainId);
      }
    }
  }

  /**
   * 연결 이벤트 처리
   */
  _handleConnect(chainId) {
    if (!this._state.isConnected) {
      this._state.isConnected = true;
      this.emit('connect', {
        chainId
      });
    }
  }

  /**
   * 연결 해제 이벤트 처리
   */
  _handleDisconnect(isRecoverable, errorMessage) {
    if (this._state.isConnected || !this._state.isPermanentlyDisconnected && !isRecoverable) {
      this._state.isConnected = false;
      let error;
      if (isRecoverable) {
        error = new Error(errorMessage || 'Provider disconnected');
        console.debug(error);
      } else {
        error = new Error(errorMessage || 'Provider permanently disconnected');
        console.error(error);
        this.chainId = null;
        this._state.accounts = null;
        this.selectedAddress = null;
        this._state.isPermanentlyDisconnected = true;
      }
      this.emit('disconnect', error);
    }
  }

  /**
   * Provider 초기화
   */
  _initializeState(initialState) {
    if (this._state.initialized) {
      throw new Error('Provider already initialized.');
    }
    if (initialState) {
      const {
        accounts,
        chainId
      } = initialState;

      // 상태 초기화
      this._handleConnect(chainId);
      this._handleChainChanged({
        chainId
      });
      this._handleAccountsChanged(accounts);
    }
    this._state.initialized = true;
    this.emit('_initialized');
  }

  /**
   * 배열 동등성 비교 유틸리티
   */
  _areArraysEqual(a, b) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  }

  /**
   * 연결 상태 확인
   */
  isConnected() {
    return this._state.isConnected;
  }
}
exports.BaseProvider = BaseProvider;
//# sourceMappingURL=BaseProvider.js.map