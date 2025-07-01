package com.wepin.pinrn.utils

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.WritableMap
import com.wepin.android.commonlib.types.Providers
import com.wepin.android.commonlib.types.WepinUser
import com.wepin.android.loginlib.types.FBToken
import com.wepin.android.loginlib.types.LoginOauthResult
import com.wepin.android.loginlib.types.LoginResult
import com.wepin.android.pinlib.types.AuthOTP
import com.wepin.android.pinlib.types.AuthPinBlock
import com.wepin.android.pinlib.types.ChangePinBlock
import com.wepin.android.pinlib.types.EncUVD
import com.wepin.android.pinlib.types.RegistrationPinBlock
import com.wepin.pinrn.error.WepinReactErrorCode

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

//////////////////////////////////////////////////////////////////////////
internal fun EncUVD.toWritableMap(): WritableMap {
  return Arguments.createMap().apply {
    putOptionalInt("seqNum", seqNum)
    putString("b64SKey", b64SKey)
    putString("b64Data", b64Data)
  }
}

internal fun RegistrationPinBlock.toWritableMap(): WritableMap {
  return Arguments.createMap().apply {
    putMap("uvd", uvd.toWritableMap())
    putMap("hint", Arguments.createMap().apply {
      putInt("version", hint.version)
      putString("length", hint.length)
      putString("data", hint.data)
    })
  }
}

internal fun ChangePinBlock.toWritableMap(): WritableMap {
  return Arguments.createMap().apply {
    putMap("uvd", uvd.toWritableMap())
    putMap("newUvd", newUVD.toWritableMap())
    putMap("hint", Arguments.createMap().apply {
      putInt("version", hint.version)
      putString("length", hint.length)
      putString("data", hint.data)
    })
    putOptionalString("otp", otp)
  }
}

internal fun AuthPinBlock.toWritableMap(): WritableMap {
  return Arguments.createMap().apply {
    putArray("uvdList", Arguments.createArray().apply {
      uvdList.forEach { encUVD ->
        pushMap(encUVD.toWritableMap())
      }
    })
    putOptionalString("otp", otp)
  }
}

internal fun AuthOTP.toWritableMap(): WritableMap {
  return Arguments.createMap().apply {
    putString("code", code)
  }
}
//////////////////////////////////////////////////////////////////////////

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

private fun WritableMap.putOptionalInt(key: String, value: Int?) {
  if (value != null) {
    putInt(key, value)
  } else {
    putNull(key)
  }
}

//////////////////////////////

/////////////////////////////////////////////
// LoginResult 전용 변환 함수
fun ReadableMap?.toLoginResult(promise: Promise): LoginResult? {
  if (this == null) {
    promise.reject(WepinReactErrorCode.InvalidParameters.code, "Map parameter is null")
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
      WepinReactErrorCode.InvalidParameters.code,
      "Invalid parameters: ${e.message}"
    )
    null
  }
}
