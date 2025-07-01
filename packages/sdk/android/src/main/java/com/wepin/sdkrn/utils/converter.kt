package com.wepin.sdkrn.utils

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.WritableArray
import com.facebook.react.bridge.WritableMap
import com.wepin.android.commonlib.types.Providers
import com.wepin.android.commonlib.types.WepinLifeCycle
import com.wepin.android.commonlib.types.WepinUser
import com.wepin.android.loginlib.types.FBToken
import com.wepin.android.loginlib.types.LoginOauthResult
import com.wepin.android.loginlib.types.LoginResult
import com.wepin.android.widgetlib.types.WepinAccount
import com.wepin.android.widgetlib.types.WepinAccountBalanceInfo
import com.wepin.android.widgetlib.types.WepinNFT
import com.wepin.android.widgetlib.types.WepinNFTContract
import com.wepin.android.widgetlib.types.WepinReceiveResponse
import com.wepin.android.widgetlib.types.WepinSendResponse
import com.wepin.android.widgetlib.types.WepinTokenBalanceInfo
import com.wepin.sdkrn.error.WepinLoginErrorCode

internal fun LoginOauthResult.toWritableMap(): WritableMap {
  return Arguments.createMap().apply {
    putString("provider", provider)
    putString("token", token)
    putString("type", type.value)
  }
}

internal fun LoginResult.toWritableMap(): WritableMap {
  return Arguments.createMap().apply {
    putString("provider", provider.value)
    putMap("token", Arguments.createMap().apply {
      putString("idToken", token.idToken)
      putString("refreshToken", token.refreshToken)
    })
  }
}

internal fun WepinUser.toWritableMap(): WritableMap {
  return Arguments.createMap().apply {
    putString("status", status)
    putOptionalString("walletId", walletId)

    // userInfo가 null이 아닐 때만 WritableMap으로 변환
    val userInfoMap = userInfo?.let { info ->
      Arguments.createMap().apply {
        putString("userId", info.userId)
        putString("email", info.email)
        putString("provider", info.provider.value)
        info.use2FA?.let { putBoolean("user2FA", it) } ?: putBoolean("user2FA", false)
      }
    }
    putOptionalMap("userInfo", userInfoMap)

    // userStatus가 null이 아닐 때만 WritableMap으로 변환
    val userStatusMap = userStatus?.let { status ->
      Arguments.createMap().apply {
        putString("loginStatus", status.loginStatus.value)
        status.pinRequired?.let { putBoolean("pinRequired", it) } ?: putNull("pinRequired")
      }
    }
    putOptionalMap("userStatus", userStatusMap)

    // token이 null이 아닐 때만 WritableMap으로 변환
    val tokenMap = token?.let { t ->
      Arguments.createMap().apply {
        putString("accessToken", t.accessToken)
        putString("refreshToken", t.refreshToken)
      }
    }
    putOptionalMap("token", tokenMap)
  }
}

private fun WritableMap.putOptionalString(key: String, value: String?) {
  if (value != null) {
    putString(key, value)
  } else {
    putNull(key)
  }
}

private fun WritableMap.putOptionalMap(key: String, value: WritableMap?) {
  if (value != null) {
    putMap(key, value)
  } else {
    putNull(key)
  }
}

//////////////////////////////
internal fun WepinLifeCycle.toJSValue(): String {
  return when (this) {
    WepinLifeCycle.NOT_INITIALIZED -> "not_initialized"
    WepinLifeCycle.INITIALIZING -> "initializing"
    WepinLifeCycle.INITIALIZED -> "initialized"
    WepinLifeCycle.BEFORE_LOGIN -> "before_login"
    WepinLifeCycle.LOGIN -> "login"
    WepinLifeCycle.LOGIN_BEFORE_REGISTER -> "login_before_register"
  }
}

internal fun WepinAccount.toWritableMap(): WritableMap {
  return Arguments.createMap().apply {
    putString("address", address)
    putString("network", network)
    putString("contract", contract)
    putBoolean("isAA", isAA ?: false)
  }
}

internal fun List<WepinAccount>.toWepinAccountArray(): WritableArray {
  return Arguments.createArray().apply {
    this@toWepinAccountArray.forEach { account ->
      pushMap(account.toWritableMap())
    }
  }
}

internal fun WepinTokenBalanceInfo.toWritableMap(): WritableMap {
  return Arguments.createMap().apply {
    putString("contract", contract)
    putString("symbol", symbol)
    putString("balance", balance)
  }
}

internal fun WepinAccountBalanceInfo.toWritableMap(): WritableMap {
  return Arguments.createMap().apply {
    putString("network", network)
    putString("address", address)
    putString("symbol", symbol)
    putString("balance", balance)

    val tokensArray: WritableArray = Arguments.createArray()
    tokens.forEach { tokenInfo ->
      tokensArray.pushMap(tokenInfo.toWritableMap())
    }
    putArray("tokens", tokensArray)
  }
}

internal fun List<WepinAccountBalanceInfo>.toWepinAccountBalanceArray(): WritableArray {
  return Arguments.createArray().apply {
    this@toWepinAccountBalanceArray.forEach { account ->
      pushMap(account.toWritableMap())
    }
  }
}

internal fun WepinNFTContract.toWritableMap(): WritableMap {
  return Arguments.createMap().apply {
    putString("name", name)
    putString("address", address)
    putString("scheme", scheme)
    putOptionalString("description", description)
    putString("network", network)
    putOptionalString("externalLink", externalLink)
    putOptionalString("imageUrl", imageUrl)
  }
}

internal fun WepinNFT.toWritableMap(): WritableMap {
  return Arguments.createMap().apply {
    putMap("account", account.toWritableMap())
    putMap("contract", contract.toWritableMap())
    putString("name", name)
    putString("description", description)
    putString("externalLink", externalLink)
    putString("imageUrl", imageUrl)
    putOptionalString("contentUrl", contentUrl)
    quantity?.let { putInt("quantity", it) } ?: putNull("quantity")
    putString("contentType", contentType)
    putInt("state", state)
  }
}

internal fun List<WepinNFT>.toWepinNFTArray(): WritableArray {
  return Arguments.createArray().apply {
    this@toWepinNFTArray.forEach { nft ->
      pushMap(nft.toWritableMap())
    }
  }
}

internal fun WepinSendResponse.toWritableMap(): WritableMap {
  return Arguments.createMap().apply {
    putString("txId", txId)
  }
}

internal fun WepinReceiveResponse.toWritableMap(): WritableMap {
  return Arguments.createMap().apply {
    putMap("account", account.toWritableMap())
  }
}

/////////////////////////////////////////////
// LoginResult 전용 변환 함수
fun ReadableMap?.toLoginResult(promise: Promise): LoginResult? {
  if (this == null) {
    promise.reject(WepinLoginErrorCode.InvalidParameters.code, "Map parameter is null")
    return null
  }

  return try {
    val providerString = getString("provider")
      ?: throw IllegalArgumentException("provider is null or empty")

    val provider = Providers.fromValue(providerString)
      ?: throw IllegalArgumentException("invalid provider value")

    val tokenMap = getMap("token")
      ?: throw IllegalArgumentException("token is null")

    val idToken = tokenMap.getString("idToken")
      ?: throw IllegalArgumentException("idToken is null or empty")

    val refreshToken = tokenMap.getString("refreshToken")
      ?: throw IllegalArgumentException("refreshToken is null or empty")

    LoginResult(
      provider = provider,
      token = FBToken(
        idToken = idToken,
        refreshToken = refreshToken
      )
    )
  } catch (e: Exception) {
    promise.reject(
      WepinLoginErrorCode.InvalidParameters.code,
      "Invalid parameters: ${e.message}"
    )
    null
  }
}

// WepinAccount 전용 변환 함수
fun ReadableMap?.toWepinAccount(promise: Promise): WepinAccount? {
  if (this == null) {
    promise.reject(WepinLoginErrorCode.InvalidParameters.code, "Map parameter is null")
    return null
  }

  return try {
    val address = getString("address")
      ?: throw IllegalArgumentException("address is null or empty")

    val network = getString("network")
      ?: throw IllegalArgumentException("network is null or empty")

    val contract = getString("contract")
    val isAA = if (hasKey("isAA")) getBoolean("isAA") else false

    WepinAccount(
      address = address,
      network = network,
      contract = contract,
      isAA = isAA
    )
  } catch (e: Exception) {
    promise.reject(
      WepinLoginErrorCode.InvalidParameters.code,
      "Invalid parameters: ${e.message}"
    )
    null
  }
}
