package com.wepin.loginrn

import android.app.Activity
import android.content.Intent
import com.facebook.react.bridge.ActivityEventListener
import com.facebook.react.bridge.LifecycleEventListener
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableMap
import com.wepin.android.commonlib.error.WepinError
import com.wepin.android.loginlib.WepinLogin
import com.wepin.android.loginlib.types.LoginOauth2Params
import com.wepin.android.loginlib.types.LoginResult
import com.wepin.android.loginlib.types.LoginWithEmailParams
import com.wepin.android.loginlib.types.WepinLoginOptions
import com.wepin.android.loginlib.types.network.LoginOauthAccessTokenRequest
import com.wepin.android.loginlib.types.network.LoginOauthIdTokenRequest
import com.wepin.loginrn.error.WepinErrorMapper
import com.wepin.loginrn.error.WepinLoginErrorCode
import com.wepin.loginrn.utils.toLoginResult
import com.wepin.loginrn.utils.toWritableMap

class LoginRnModule(reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext),
  ActivityEventListener,
  LifecycleEventListener {
  private val reactContext: ReactApplicationContext

  private var wepinLogin: WepinLogin? = null

  companion object {
    const val NAME = "LoginRn"
    private var instance: LoginRnModule? = null
  }

  init {
    this.reactContext = reactContext
    reactContext.addActivityEventListener(this)
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
  fun createWepinLogin(appId: String, appKey: String) {
    val loginOptions = WepinLoginOptions(
      context = this.reactContext.currentActivity!!,
      appId = appId,
      appKey = appKey
    )
    wepinLogin = WepinLogin(loginOptions, "react")
  }

  @ReactMethod
  fun initialize(promise: Promise) {
    if (this.reactContext.currentActivity == null) {
      promise.reject(WepinLoginErrorCode.NotActivity.code, "React Context is null")
      return
    }

    wepinLogin?.init()?.whenComplete { result, error ->
      if (error != null) {
        handleError(error, promise)
      } else {
        promise.resolve(result)
      }
    }
  }

  @ReactMethod
  fun isInitialized(promise: Promise) {
    val result = wepinLogin?.isInitialized()
    promise.resolve(result)
  }

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

  @ReactMethod
  fun finalize(promise: Promise) {
    val result = wepinLogin?.finalize()
    promise.resolve(result)
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
      val code = WepinLoginErrorCode.UnknownError.code
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
