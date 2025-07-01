package com.wepin.providerrn.utils

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.ReadableType
import com.facebook.react.bridge.WritableArray
import com.facebook.react.bridge.WritableMap
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.wepin.android.commonlib.types.Providers
import com.wepin.android.commonlib.types.WepinLifeCycle
import com.wepin.android.commonlib.types.WepinUser
import com.wepin.android.loginlib.types.FBToken
import com.wepin.android.loginlib.types.LoginOauthResult
import com.wepin.android.loginlib.types.LoginResult
import com.wepin.providerrn.error.WepinLoginErrorCode
import java.math.BigDecimal
import java.math.BigInteger

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

/**
 * ReadableMap을 Map<String, Any?>로 변환
 */
private fun convertReadableMapToMap(map: ReadableMap): Map<String, Any?> {
  val result = mutableMapOf<String, Any?>()
  val iterator = map.keySetIterator()

  while (iterator.hasNextKey()) {
    val key = iterator.nextKey()
    when (map.getType(key)) {
      ReadableType.Null -> result[key] = null
      ReadableType.Boolean -> result[key] = map.getBoolean(key)
      ReadableType.Number -> result[key] = map.getDouble(key)
      ReadableType.String -> result[key] = map.getString(key)
      ReadableType.Map -> {
        val mapValue = map.getMap(key)
        if (mapValue != null) {
          result[key] = convertReadableMapToMap(mapValue)
        }
      }

      ReadableType.Array -> {
        val arrayValue = map.getArray(key)
        if (arrayValue != null) {
          result[key] = convertReadableArrayToList(arrayValue)
        }
      }
    }
  }

  return result
}

/**
 * ReadableArray를 List<Any?>로 변환
 */
internal fun convertReadableArrayToList(array: ReadableArray?): List<Any>? {
  if (array == null) return null

  val result = mutableListOf<Any>()

  for (i in 0 until array.size()) {
    when (array.getType(i)) {
      ReadableType.Null -> {
        continue
      }

      ReadableType.Boolean -> result.add(array.getBoolean(i))
      ReadableType.Number -> result.add(array.getDouble(i))
      ReadableType.String -> result.add(array.getString(i) ?: "")
      ReadableType.Map -> {
        val mapValue = array.getMap(i)
        if (mapValue != null) {
          result.add(convertReadableMapToMap(mapValue))
        }
      }

      ReadableType.Array -> {
        val arrayValue = array.getArray(i)
        if (arrayValue != null) {
          convertReadableArrayToList(arrayValue)?.let { result.add(it) }
        }
      }
    }
  }

  return result
}

internal fun convertResultToWritable(result: Any?): Any {
  return when (result) {
    null -> Arguments.createMap() // 빈 맵으로 변환

    // 기본 타입은 그대로 반환 (React Native 브릿지가 처리)
    is String, is Boolean, is Double, is Float, is Int, is Long -> result

    // 배열/리스트는 WritableArray로 변환
    is List<*> -> convertListToWritableArray(result)
    is Array<*> -> convertListToWritableArray(result.toList())

    // 맵은 WritableMap으로 변환
    is Map<*, *> -> convertMapToWritableMap(result)

    // 특수 타입 처리 (예: BigInteger, BigDecimal)
    is BigInteger -> result.toString(16) // 16진수 문자열로 변환
    is BigDecimal -> result.toDouble()

    // JSON 문자열로 변환 가능한 객체
    else -> {
      try {
        // 객체를 JSON으로 직렬화
        val json = jacksonObjectMapper().writeValueAsString(result)

        // JSON을 다시 WritableMap으로 변환
        val jsonMap = jacksonObjectMapper().readValue(json, Map::class.java) as Map<*, *>
        convertMapToWritableMap(jsonMap)
      } catch (e: Exception) {
        // 변환 실패 시 toString()
        result.toString()
      }
    }
  }
}

/**
 * List를 WritableArray로 변환
 */
private fun convertListToWritableArray(list: List<*>): WritableArray {
  val array = Arguments.createArray()

  for (item in list) {
    when (item) {
      null -> array.pushNull()
      is String -> array.pushString(item)
      is Double -> array.pushDouble(item)
      is Float -> array.pushDouble(item.toDouble())
      is Int -> array.pushInt(item)
      is Long -> {
        // Long이 JS Number 범위를 초과할 수 있으므로 문자열로 변환
        if (item > Integer.MAX_VALUE || item < Integer.MIN_VALUE) {
          array.pushString(item.toString())
        } else {
          array.pushInt(item.toInt())
        }
      }

      is Boolean -> array.pushBoolean(item)
      is List<*> -> array.pushArray(convertListToWritableArray(item))
      is Map<*, *> -> array.pushMap(convertMapToWritableMap(item))
      is BigInteger -> array.pushString("0x" + item.toString(16)) // 16진수 형식
      else -> array.pushString(item.toString())
    }
  }

  return array
}

/**
 * Map을 WritableMap으로 변환
 */
private fun convertMapToWritableMap(map: Map<*, *>): WritableMap {
  val writableMap = Arguments.createMap()

  for ((key, value) in map) {
    val keyStr = key.toString()

    when (value) {
      null -> writableMap.putNull(keyStr)
      is String -> writableMap.putString(keyStr, value)
      is Double -> writableMap.putDouble(keyStr, value)
      is Float -> writableMap.putDouble(keyStr, value.toDouble())
      is Int -> writableMap.putInt(keyStr, value)
      is Long -> {
        // Long이 JS Number 범위를 초과할 수 있으므로 문자열로 변환
        if (value > Integer.MAX_VALUE || value < Integer.MIN_VALUE) {
          writableMap.putString(keyStr, value.toString())
        } else {
          writableMap.putInt(keyStr, value.toInt())
        }
      }

      is Boolean -> writableMap.putBoolean(keyStr, value)
      is List<*> -> writableMap.putArray(keyStr, convertListToWritableArray(value))
      is Map<*, *> -> writableMap.putMap(keyStr, convertMapToWritableMap(value))
      is BigInteger -> writableMap.putString(keyStr, "0x" + value.toString(16)) // 16진수 형식
      else -> writableMap.putString(keyStr, value.toString())
    }
  }

  return writableMap
}
