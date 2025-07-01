package com.wepin.providerrn

import android.app.Activity
import android.content.Intent
import android.util.Log
import com.facebook.react.bridge.ActivityEventListener
import com.facebook.react.bridge.LifecycleEventListener
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.UiThreadUtil
import com.wepin.android.commonlib.error.WepinError
import com.wepin.android.commonlib.types.LoginOauthAccessTokenRequest
import com.wepin.android.commonlib.types.LoginOauthIdTokenRequest
import com.wepin.android.loginlib.WepinLogin
import com.wepin.android.loginlib.types.LoginOauth2Params
import com.wepin.android.loginlib.types.LoginResult
import com.wepin.android.loginlib.types.LoginWithEmailParams
import com.wepin.android.providerlib.WepinProvider
import com.wepin.android.providerlib.info.ProviderNetworkInfo
import com.wepin.android.providerlib.provider.BaseProvider
import com.wepin.android.providerlib.types.WepinProviderAttributes
import com.wepin.android.providerlib.types.WepinProviderParams
import com.wepin.providerrn.error.WepinErrorMapper
import com.wepin.providerrn.error.WepinLoginErrorCode
import com.wepin.providerrn.utils.convertReadableArrayToList
import com.wepin.providerrn.utils.convertResultToWritable
import com.wepin.providerrn.utils.toLoginResult
import com.wepin.providerrn.utils.toWritableMap
import com.wepin.providerrn.utils.validateActivity

class ProviderRnModule(private val reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext),
  ActivityEventListener,
  LifecycleEventListener {
  private val TAG = "WepinProviderRnModule"
  private var wepinLogin: WepinLogin? = null
  private var wepinProvider: WepinProvider? = null
  private var provider: BaseProvider? = null

  companion object {
    const val NAME = "ProviderRn"
    private var instance: ProviderRnModule? = null
  }

  init {
    reactContext.addActivityEventListener(this)
    reactContext.addLifecycleEventListener(this)  // 라이프사이클 이벤트 리스너 추가
    instance = this
  }

  override fun getName(): String {
    return NAME
  }

  override fun onNewIntent(intent: Intent) {
    // Handle the new intent here
  }

  override fun onActivityResult(
    activity: Activity,
    requestCode: Int,
    resultCode: Int,
    data: Intent?
  ) {
  }

  @ReactMethod
  fun createWepinProvider(appId: String, appKey: String, promise: Promise) {
    try {
      val context = validateActivity(this.reactContext.currentActivity, promise) ?: return
      val widgetOption = WepinProviderParams(
        context = context,
        appId = appId,
        appKey = appKey
      )
      wepinProvider = WepinProvider(widgetOption, "react")
      promise.resolve(true)
    } catch (error: Exception) {
      handleError(error, promise)
    }
  }

  @ReactMethod
  fun initialize(defaultLanguage: String, defaultCurrency: String, promise: Promise) {
    validateActivity(this.reactContext.currentActivity, promise) ?: return
    val attributes = WepinProviderAttributes(
      defaultLanguage = defaultLanguage,
      defaultCurrency = defaultCurrency
    )

    wepinProvider?.initialize(attributes)?.whenComplete { result, error ->
      if (error != null) {
        handleError(error, promise)
      } else {
        wepinLogin = wepinProvider?.login
        promise.resolve(result)
      }
    }
  }

  @ReactMethod
  fun isInitialized(promise: Promise) {
    val result = wepinProvider?.isInitialized()
    promise.resolve(result)
  }

  ///////////////WepinLogin//////////////////////////////////////////////////////////////////////////////
  @ReactMethod
  fun loginWithOauthProvider(provider: String, clientId: String, promise: Promise) {
    try {
      wepinLogin?.loginWithOauthProvider(LoginOauth2Params(provider, clientId))
        ?.whenComplete { result, error ->
          if (error != null) {
            handleError(error, promise)
          } else {
            val map = result.toWritableMap()
            promise.resolve(map)
          }
        }
    } catch (e: Exception) {
      promise.reject(WepinLoginErrorCode.UnknownError.code, e.message)
    }
  }

  @ReactMethod
  fun signUpWithEmailAndPassword(
    email: String,
    password: String,
    locale: String? = "en",
    promise: Promise
  ) {
    try {
      val params = LoginWithEmailParams(email = email, password = password, locale = locale)
      wepinLogin?.signUpWithEmailAndPassword(params)?.whenComplete { result, error ->
        if (error != null) {
          handleError(error, promise)
        } else {
          val map = result.toWritableMap()
          promise.resolve(map)
        }
      }
    } catch (e: Exception) {
      promise.reject(WepinLoginErrorCode.UnknownError.code, e.message)
    }
  }

  @ReactMethod
  fun loginWithEmailAndPassword(email: String, password: String, promise: Promise) {
    try {
      val params = LoginWithEmailParams(email = email, password = password)
      wepinLogin?.loginWithEmailAndPassword(params)?.whenComplete { result, error ->
        if (error != null) {
          handleError(error, promise)
        } else {
          val map = result.toWritableMap()
          promise.resolve(map)
        }
      }
    } catch (e: Exception) {
      promise.reject(WepinLoginErrorCode.UnknownError.code, e.message)
    }
  }

  @ReactMethod
  fun loginWithIdToken(idToken: String, promise: Promise) {
    try {
      val params = LoginOauthIdTokenRequest(idToken = idToken)
      wepinLogin?.loginWithIdToken(params)?.whenComplete { result, error ->
        if (error != null) {
          handleError(error, promise)
        } else {
          val map = result.toWritableMap()
          promise.resolve(map)
        }
      }
    } catch (e: Exception) {
      promise.reject(WepinLoginErrorCode.UnknownError.code, e.message)
    }
  }

  @ReactMethod
  fun loginWithAccessToken(provider: String, accessToken: String, promise: Promise) {
    try {
      val params = LoginOauthAccessTokenRequest(provider = provider, accessToken = accessToken)
      wepinLogin?.loginWithAccessToken(params)?.whenComplete { result, error ->
        if (error != null) {
          handleError(error, promise)
        } else {
          val map = result.toWritableMap()
          promise.resolve(map)
        }
      }
    } catch (e: Exception) {
      promise.reject(WepinLoginErrorCode.UnknownError.code, e.message)
    }
  }

  @ReactMethod
  fun getRefreshFirebaseToken(prevToken: ReadableMap? = null, promise: Promise) {
    try {
      var token: LoginResult? = null
      if (prevToken != null) {
        token = prevToken.toLoginResult(promise)
      }
      wepinLogin?.getRefreshFirebaseToken(token)?.whenComplete { result, error ->
        if (error != null) {
          handleError(error, promise)
        } else {
          val map = result.toWritableMap()
          promise.resolve(map)
        }
      }
    } catch (e: Exception) {
      promise.reject(WepinLoginErrorCode.UnknownError.code, e.message)
    }
  }

  @ReactMethod
  fun loginWepin(params: ReadableMap, promise: Promise) {
    try {
      val token = params.toLoginResult(promise) ?: return

      wepinLogin?.loginWepin(token)?.whenComplete { result, error ->
        if (error != null) {
          handleError(error, promise)
        } else {
          promise.resolve(result.toWritableMap())
        }
      }
    } catch (e: Exception) {
      promise.reject(WepinLoginErrorCode.FailedLogin.code, e.message ?: "Unknown error occurred")
    }
  }

  @ReactMethod
  fun getCurrentWepinUser(promise: Promise) {
    try {
      wepinLogin?.getCurrentWepinUser()?.whenComplete { result, error ->
        if (error != null) {
          handleError(error, promise)
        } else {
          val map = result.toWritableMap()
          promise.resolve(map)
        }
      }
    } catch (e: Exception) {
      promise.reject(WepinLoginErrorCode.UnknownError.code, e.message)
    }
  }

  @ReactMethod
  fun logout(promise: Promise) {
    try {
      wepinLogin?.logoutWepin()?.whenComplete { result, error ->
        if (error != null) {
          handleError(error, promise)
        } else {
          promise.resolve(result)
        }
      }
    } catch (e: Exception) {
      promise.reject(WepinLoginErrorCode.UnknownError.code, e.message)
    }
  }
  ////////////////////////////////////////////////////////////////////////////////////////////////

  @ReactMethod
  fun getProvider(network: String, promise: Promise) {
    try {
      provider = wepinProvider?.getProvider(network)
      if (provider != null) {
        promise.resolve(true)
      } else {
        promise.reject(WepinLoginErrorCode.UnknownError.code, "Failed to get provider for $network")
      }
    } catch (e: Exception) {
      promise.reject(WepinLoginErrorCode.UnknownError.code, e.message ?: "getProvider failed")
    }
  }

  @ReactMethod
  fun request(network: String, method: String, params: ReadableArray, promise: Promise) {
    UiThreadUtil.runOnUiThread {
      try {
        provider?.request(
          method = method,
          params = convertReadableArrayToList(params)
        )?.whenComplete { result, error ->
          if (error != null) {
            handleError(error, promise)
          } else {
            promise.resolve(convertResultToWritable(result))
          }
        } ?: promise.reject(WepinLoginErrorCode.InvalidParameters.code, "Provider not found for network: $network")
      } catch (e: Exception) {
        promise.reject(WepinLoginErrorCode.UnknownError.code, e.message ?: "Request failed")
      }
    }
  }

  @ReactMethod
  fun finalize(promise: Promise) {
    try {
      val result = wepinProvider?.finalize()
      provider = null
      promise.resolve(result)
    } catch (e: Exception) {
      promise.reject(WepinLoginErrorCode.UnknownError.code, e.message)
    }
  }

  private fun handleError(error: Throwable, promise: Promise) {
    if (error is WepinError) {
      val (code, message) = WepinErrorMapper.getCodeAndMessage(error)
      promise.reject(code, message)
    } else {
      val code = WepinLoginErrorCode.UnknownError.code
      val message = error.message ?: "Unknown native error"
      promise.reject(code, message)
    }
  }

  override fun onHostDestroy() {
    reactContext.removeActivityEventListener(this)
    reactContext.removeLifecycleEventListener(this)
  }

  override fun onHostPause() {
  }

  override fun onHostResume() {
  }
}
