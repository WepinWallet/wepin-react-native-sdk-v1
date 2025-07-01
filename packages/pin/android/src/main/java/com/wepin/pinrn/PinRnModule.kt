package com.wepin.pinrn

import android.app.Activity
import android.content.Intent
import android.util.Log
import com.facebook.react.bridge.ActivityEventListener
import com.facebook.react.bridge.LifecycleEventListener
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.UiThreadUtil
import com.wepin.android.commonlib.error.WepinError
import com.wepin.android.loginlib.WepinLogin
import com.wepin.android.loginlib.types.LoginOauth2Params
import com.wepin.android.loginlib.types.LoginResult
import com.wepin.android.loginlib.types.LoginWithEmailParams
import com.wepin.android.loginlib.types.network.LoginOauthAccessTokenRequest
import com.wepin.android.loginlib.types.network.LoginOauthIdTokenRequest
import com.wepin.android.pinlib.WepinPin
import com.wepin.android.pinlib.types.WepinPinAttributes
import com.wepin.android.pinlib.types.WepinPinParams
import com.wepin.pinrn.error.WepinErrorMapper
import com.wepin.pinrn.error.WepinReactErrorCode
import com.wepin.pinrn.utils.toLoginResult
import com.wepin.pinrn.utils.toWritableMap
import com.wepin.pinrn.utils.validateActivity

class PinRnModule(private val reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext),
  ActivityEventListener,
  LifecycleEventListener {
  private var wepinLogin: WepinLogin? = null
  private var wepinPin: WepinPin? = null

  companion object {
    const val NAME = "PinRn"
    private var instance: PinRnModule? = null
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
  fun createWepinPin(appId: String, appKey: String, promise: Promise) {
    try {
      val context = validateActivity(this.reactContext.currentActivity, promise) ?: return
      val pinOption = WepinPinParams(
        context = context,
        appId = appId,
        appKey = appKey
      )
      wepinPin = WepinPin(pinOption, "react")
      promise.resolve(true)
    } catch (error: Exception) {
      handleError(error, promise)
    }
  }

  @ReactMethod
  fun initialize(defaultLanguage: String, defaultCurrency: String, promise: Promise) {
    validateActivity(this.reactContext.currentActivity, promise) ?: return
    val attributes = WepinPinAttributes(
      defaultLanguage = defaultLanguage,
      defaultCurrency = defaultCurrency
    )
    try {
      wepinPin?.initialize(attributes)?.whenComplete { result, error ->
        if (error != null) {
          handleError(error, promise)
        } else {
          wepinLogin = wepinPin?.login
          Log.d("SdkRnModule", "initialize: $result")
          promise.resolve(result)
        }
      }
    } catch (error: Exception) {
      handleError(error, promise)
    }
  }

  @ReactMethod
  fun isInitialized(promise: Promise) {
    val result = wepinPin?.isInitialized()
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
      promise.reject(WepinReactErrorCode.UnknownError.code, e.message)
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
      promise.reject(WepinReactErrorCode.UnknownError.code, e.message)
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
      promise.reject(WepinReactErrorCode.UnknownError.code, e.message)
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
      promise.reject(WepinReactErrorCode.UnknownError.code, e.message)
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
      promise.reject(WepinReactErrorCode.UnknownError.code, e.message)
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
      promise.reject(WepinReactErrorCode.UnknownError.code, e.message)
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
      promise.reject(WepinReactErrorCode.FailedLogin.code, e.message ?: "Unknown error occurred")
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
      promise.reject(WepinReactErrorCode.UnknownError.code, e.message)
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
      promise.reject(WepinReactErrorCode.UnknownError.code, e.message)
    }
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////
  @ReactMethod
  fun changeLanguage(language: String, promise: Promise) {
    try {
      wepinPin?.changeLanguage(language)?.whenComplete { result, error ->
        if (error != null) {
          handleError(error, promise)
        } else {
          promise.resolve(result)
        }
      }
    } catch (e: Exception) {
      promise.reject(WepinReactErrorCode.UnknownError.code, e.message)
    }
  }

  @ReactMethod
  fun generateRegistrationPINBlock(promise: Promise) {
    UiThreadUtil.runOnUiThread {
      try {
        wepinPin?.generateRegistrationPINBlock()?.whenComplete { result, error ->
          if (error != null) {
            handleError(error, promise)
          } else {
            val map = result?.toWritableMap()
            promise.resolve(map)
          }
        }
      } catch (error: Exception) {
        handleError(error, promise)
      }
    }
  }

  @ReactMethod
  fun generateAuthPINBlock(count: Int, promise: Promise) {
    UiThreadUtil.runOnUiThread {
      try {
        wepinPin?.generateAuthPINBlock(count)?.whenComplete { result, error ->
          if (error != null) {
            handleError(error, promise)
          } else {
            val map = result?.toWritableMap()
            promise.resolve(map)
          }
        }
      } catch (error: Exception) {
        handleError(error, promise)
      }
    }
  }

  @ReactMethod
  fun generateChangePINBlock(promise: Promise) {
    UiThreadUtil.runOnUiThread {
      try {
        wepinPin?.generateChangePINBlock()?.whenComplete { result, error ->
          if (error != null) {
            handleError(error, promise)
          } else {
            val map = result?.toWritableMap()
            promise.resolve(map)
          }
        }
      } catch (error: Exception) {
        handleError(error, promise)
      }
    }
  }

  @ReactMethod
  fun generateAuthOTPCode(promise: Promise) {
    UiThreadUtil.runOnUiThread {
      try {
        wepinPin?.generateAuthOTPCode()?.whenComplete { result, error ->
          if (error != null) {
            handleError(error, promise)
          } else {
            val map = result?.toWritableMap()
            promise.resolve(map)
          }
        }
      } catch (error: Exception) {
        handleError(error, promise)
      }
    }
  }

  @ReactMethod
  fun finalize(promise: Promise) {
    try {
      val result = wepinPin?.finalize()
      promise.resolve(result)
    } catch (e: Exception) {
      promise.reject(WepinReactErrorCode.UnknownError.code, e.message)
    }
  }

  private fun handleError(error: Throwable, promise: Promise) {
    val actualError = if (error.cause is WepinError) {
      error.cause
    } else {
      error
    }
    if (actualError is WepinError) {
      val (code, message) = WepinErrorMapper.getCodeAndMessage(actualError)
      promise.reject(code, message)
    } else {
      val code = WepinReactErrorCode.UnknownError.code
      val message = actualError?.message ?: "Unknown native error"
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
