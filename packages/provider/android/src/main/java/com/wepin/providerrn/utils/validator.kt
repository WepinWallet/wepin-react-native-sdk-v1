package com.wepin.providerrn.utils

import android.app.Activity
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReadableMap
import com.wepin.providerrn.error.WepinLoginErrorCode

internal fun validateParameter(value: Any?, paramName: String, promise: Promise): Boolean {
  return when {
    value == null -> {
      promise.reject(WepinLoginErrorCode.InvalidParameters.code, "$paramName is null")
      false
    }

    value is String && value.isEmpty() -> {
      promise.reject(WepinLoginErrorCode.InvalidParameters.code, "$paramName is empty")
      false
    }

    else -> true
  }
}

internal fun validateReadableMap(
  map: ReadableMap?,
  requiredKeys: List<String>,
  promise: Promise
): Boolean {
  if (map == null) {
    promise.reject(WepinLoginErrorCode.InvalidParameters.code, "Map parameter is null")
    return false
  }

  for (key in requiredKeys) {
    if (!map.hasKey(key)) {
      promise.reject(WepinLoginErrorCode.InvalidParameters.code, "Required key '$key' is missing")
      return false
    }

    val value = map.getString(key)
    if (value == null || value.isEmpty()) {
      promise.reject(
        WepinLoginErrorCode.InvalidParameters.code,
        "Value for key '$key' is null or empty"
      )
      return false
    }
  }

  return true
}

internal fun <T : Enum<T>> validateEnum(
  value: String?,
  enumClass: Class<T>,
  paramName: String,
  promise: Promise
): T? {
  if (value == null || value.isEmpty()) {
    promise.reject(WepinLoginErrorCode.InvalidParameters.code, "$paramName is null or empty")
    return null
  }

  return try {
    java.lang.Enum.valueOf(enumClass, value)
  } catch (e: IllegalArgumentException) {
    promise.reject(WepinLoginErrorCode.InvalidParameters.code, "Invalid $paramName value: $value")
    null
  }
}

internal fun validateActivity(context: Activity?, promise: Promise): Activity? {
  if (context == null) {
    promise.reject(WepinLoginErrorCode.NotActivity.code, "Activity context is invalid")
    return null
  }
  return context
}
