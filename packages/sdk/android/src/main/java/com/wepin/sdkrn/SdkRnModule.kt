package com.wepin.sdkrn

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
import com.wepin.android.widgetlib.WepinWidget
import com.wepin.android.widgetlib.types.LoginProviderInfo
import com.wepin.android.widgetlib.types.WepinAccount
import com.wepin.android.widgetlib.types.WepinTxData
import com.wepin.android.widgetlib.types.WepinWidgetAttribute
import com.wepin.android.widgetlib.types.WepinWidgetParams
import com.wepin.sdkrn.error.WepinErrorMapper
import com.wepin.sdkrn.error.WepinLoginErrorCode
import com.wepin.sdkrn.utils.toJSValue
import com.wepin.sdkrn.utils.toLoginResult
import com.wepin.sdkrn.utils.toWepinAccount
import com.wepin.sdkrn.utils.toWepinAccountArray
import com.wepin.sdkrn.utils.toWepinAccountBalanceArray
import com.wepin.sdkrn.utils.toWepinNFTArray
import com.wepin.sdkrn.utils.toWritableMap
import com.wepin.sdkrn.utils.validateActivity

class SdkRnModule(private val reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext),
  ActivityEventListener,
  LifecycleEventListener {
  private var wepinLogin: WepinLogin? = null
  private var wepinWidget: WepinWidget? = null

  companion object {
    const val NAME = "SdkRn"
    private var instance: SdkRnModule? = null
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
  fun createWepinWidget(appId: String, appKey: String, promise: Promise) {
    try {
      val context = validateActivity(this.reactContext.currentActivity, promise) ?: return
      val widgetOption = WepinWidgetParams(
        context = context,
        appId = appId,
        appKey = appKey
      )
      wepinWidget = WepinWidget(widgetOption, "react")
      promise.resolve(true)
    } catch (error: Exception) {
      handleError(error, promise)
    }
  }

  @ReactMethod
  fun initialize(defaultLanguage: String, defaultCurrency: String, promise: Promise) {
    validateActivity(this.reactContext.currentActivity, promise) ?: return
    val attributes = WepinWidgetAttribute(
      defaultLanguage = defaultLanguage,
      defaultCurrency = defaultCurrency
    )

    wepinWidget?.initialize(attributes)?.whenComplete { result, error ->
      if (error != null) {
        handleError(error, promise)
      } else {
        wepinLogin = wepinWidget?.login
        Log.d("SdkRnModule", "initialize: $result")
        promise.resolve(result)
      }
    }
  }

  @ReactMethod
  fun isInitialized(promise: Promise) {
    val result = wepinWidget?.isInitialized()
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
  fun loginWithUI(params: ReadableArray, email: String? = null, promise: Promise) {
    UiThreadUtil.runOnUiThread {
      try {
        val context =
          validateActivity(this.reactContext.currentActivity, promise) ?: return@runOnUiThread
        val loginProviders = mutableListOf<LoginProviderInfo>()

        for (i in 0 until params.size()) {
          val item = params.getMap(i)
          val provider = item?.getString("provider") ?: ""
          val clientId = item?.getString("clientId") ?: ""
          loginProviders.add(LoginProviderInfo(provider, clientId))
        }

        wepinWidget?.loginWithUI(context, loginProviders, email)?.whenComplete { result, error ->
          if (error != null) {
            handleError(error, promise)
          } else {
            val map = result.toWritableMap()
            promise.resolve(map)
          }
        }
      } catch (error: Exception) {
        handleError(error, promise)
      }
    }
  }

  @ReactMethod
  fun changeLanguage(language: String, currency: String? = null) {
    wepinWidget?.changeLanguage(language, currency)
  }

  @ReactMethod
  fun getStatus(promise: Promise) {
    try {
      wepinWidget?.getStatus()?.whenComplete { result, error ->
        if (error != null) {
          handleError(error, promise)
        } else {
          val map = result.toJSValue()
          promise.resolve(map)
        }
      }
    } catch (e: Exception) {
      promise.reject(WepinLoginErrorCode.UnknownError.code, e.message)
    }
  }

  @ReactMethod
  fun openWidget(promise: Promise) {
    UiThreadUtil.runOnUiThread {
      try {
        Log.d("WepinSdkRnModule", "openWidget")
        val context =
          validateActivity(this.reactContext.currentActivity, promise) ?: return@runOnUiThread
        Log.d("WepinSdkRnModule", "context is exist")
        if (wepinWidget == null) {
          Log.e("WepinSdkRnModule", "wepinWidget is null")
          promise.reject("WepinWidgetNotInitialized", "WepinWidget is not initialized")
          return@runOnUiThread
        }
        wepinWidget?.openWidget(context)?.whenComplete { result, error ->
          if (error != null) {
            Log.d("WepinSdkRnModule", "error: $error")
            handleError(error, promise)
          } else {
            Log.d("WepinSdkRnModule", "result: $result")
            promise.resolve(result)
          }
        }
      } catch (e: Exception) {
        promise.reject(WepinLoginErrorCode.UnknownError.code, e.message)
      }
    }
  }

  @ReactMethod
  fun closeWidget() {
    wepinWidget?.closeWidget()
  }

  @ReactMethod
  fun register(promise: Promise) {
    UiThreadUtil.runOnUiThread {
      try {
        val context =
          validateActivity(this.reactContext.currentActivity, promise) ?: return@runOnUiThread
        wepinWidget?.register(context)?.whenComplete { result, error ->
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
  }

  @ReactMethod
  fun getAccounts(networks: ReadableArray? = null, withEoa: Boolean, promise: Promise) {
    try {
      val networkList = mutableListOf<String>()
      if (networks !== null) {
        for (i in 0 until networks.size()) {
          val item = networks.getString(i)
          if (item != null) networkList.add(item)
        }
      }
      wepinWidget?.getAccounts(networks = networkList, withEoa)?.whenComplete { result, error ->
        if (error != null) {
          handleError(error, promise)
        } else {
          val map = result.toWepinAccountArray()
          promise.resolve(map)
        }
      }
    } catch (e: Exception) {
      promise.reject(WepinLoginErrorCode.UnknownError.code, e.message)
    }
  }

  @ReactMethod
  fun getBalance(accounts: ReadableArray? = null, promise: Promise) {
    try {
      val accountList = mutableListOf<WepinAccount>()
      if (accounts != null) {
        for (i in 0 until accounts.size()) {
          val item = accounts.getMap(i).toWepinAccount(promise)
          if (item != null) {
            accountList.add(item)
          }
        }
      }
      wepinWidget?.getBalance(accountList)?.whenComplete { result, error ->
        if (error != null) {
          handleError(error, promise)
        } else {
          val map = result.toWepinAccountBalanceArray()
          promise.resolve(map)
        }
      }
    } catch (e: Exception) {
      promise.reject(WepinLoginErrorCode.UnknownError.code, e.message)
    }
  }

  @ReactMethod
  fun getNFTs(refresh: Boolean, networks: ReadableArray? = null, promise: Promise) {
    try {
      val networkList = mutableListOf<String>()
      if (networks !== null) {
        for (i in 0 until networks.size()) {
          val item = networks.getString(i)
          if (item != null) networkList.add(item)
        }
      }
      wepinWidget?.getNFTs(refresh, networkList)?.whenComplete { result, error ->
        if (error != null) {
          handleError(error, promise)
        } else {
          val array = result.toWepinNFTArray()
          promise.resolve(array)
        }
      }
    } catch (e: Exception) {
      promise.reject(WepinLoginErrorCode.UnknownError.code, e.message)
    }
  }

  @ReactMethod
  fun send(account: ReadableMap, txData: ReadableMap? = null, promise: Promise) {
    UiThreadUtil.runOnUiThread {
      try {
        val context =
          validateActivity(this.reactContext.currentActivity, promise) ?: return@runOnUiThread

        val requestAccount = account.toWepinAccount(promise) ?: return@runOnUiThread

        var requestTxData: WepinTxData? = null
        if (txData != null) {
          val toAddress = txData.getString("toAddress")
          val amount = txData.getString("amount")
          if (toAddress == null || amount == null) {
            val code = WepinLoginErrorCode.InvalidParameters.code
            val message = "Invalid Parameter"
            promise.reject(code, message)
            return@runOnUiThread
          }
          requestTxData = WepinTxData(
            toAddress = toAddress,
            amount = amount,
          )
        }
        wepinWidget?.send(context, requestAccount, requestTxData)?.whenComplete { result, error ->
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
  }

  @ReactMethod
  fun receive(account: ReadableMap, promise: Promise) {
    UiThreadUtil.runOnUiThread {
      try {
        val context =
          validateActivity(this.reactContext.currentActivity, promise) ?: return@runOnUiThread

        val requestAccount = account.toWepinAccount(promise) ?: return@runOnUiThread

        wepinWidget?.receive(context, requestAccount)?.whenComplete { result, error ->
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
  }

  @ReactMethod
  fun finalize(promise: Promise) {
    try {
      val result = wepinWidget?.finalize()
      promise.resolve(result)
    } catch (e: Exception) {
      handleError(e, promise)
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
