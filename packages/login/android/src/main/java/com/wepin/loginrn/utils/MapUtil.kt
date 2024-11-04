package com.wepin.loginrn.utils

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.ReadableMapKeySetIterator
import com.facebook.react.bridge.WritableArray
import com.facebook.react.bridge.WritableMap
import com.facebook.react.bridge.WritableNativeArray
import com.facebook.react.bridge.WritableNativeMap
import org.json.JSONArray
import org.json.JSONException
import org.json.JSONObject

object MapUtil {
    fun readableMapToHashMap(readableMap: ReadableMap?): HashMap<String, String> {
        val hashMap = HashMap<String, String>()
        if (readableMap != null) {
            val iterator: ReadableMapKeySetIterator = readableMap.keySetIterator()
            while (iterator.hasNextKey()) {
                val nextKey: String = iterator.nextKey()
                val value: String? = readableMap.getString(nextKey)
                if (value != null) {
                    hashMap[nextKey] = value
                }
            }
        }
        return hashMap
    }


    fun createAdditionalParametersMap(additionalParameters: Map<String?, String?>): WritableMap {
        val additionalParametersMap: WritableMap = Arguments.createMap()
        if (additionalParameters.isNotEmpty()) {
            val iterator = additionalParameters.keys.iterator()
            while (iterator.hasNext()) {
                val key = iterator.next()
                if(key != null){
                  val value = additionalParameters[key]
                  // Try to parse to JSON
                  try {
                    val jsonObject = JSONObject(value)
                    val json: WritableMap = convertJsonToMap(jsonObject)
                    additionalParametersMap.putMap(key, json)
                    continue
                  } catch (ignored: JSONException) {
                  }
                  additionalParametersMap.putString(key, additionalParameters[key])
                }

            }
        }
        return additionalParametersMap
    }

    @Throws(JSONException::class)
    private fun convertJsonToMap(jsonObject: JSONObject): WritableMap {
        val map: WritableMap = WritableNativeMap()
        val iterator = jsonObject.keys()
        while (iterator.hasNext()) {
            val key = iterator.next()
            val value = jsonObject[key]
            if (value is JSONObject) {
                map.putMap(key, convertJsonToMap(value))
            } else if (value is JSONArray) {
                map.putArray(key, convertJsonToArray(value))
            } else if (value is Boolean) {
                map.putBoolean(key, value)
            } else if (value is Int) {
                map.putInt(key, value)
            } else if (value is Double) {
                map.putDouble(key, value)
            } else if (value is Float) {
                map.putDouble(key, value.toDouble())
            } else if (value is Long) {
                map.putDouble(key, value.toDouble())
            } else if (value is String) {
                map.putString(key, value)
            } else {
                map.putString(key, value.toString())
            }
        }
        return map
    }

    @Throws(JSONException::class)
    private fun convertJsonToArray(jsonArray: JSONArray): WritableArray {
        val array: WritableArray = WritableNativeArray()
        for (i in 0 until jsonArray.length()) {
            val value = jsonArray[i]
            if (value is JSONObject) {
                array.pushMap(convertJsonToMap(value))
            } else if (value is JSONArray) {
                array.pushArray(convertJsonToArray(value))
            } else if (value is Boolean) {
                array.pushBoolean(value)
            } else if (value is Int) {
                array.pushInt(value)
            } else if (value is Double) {
                array.pushDouble(value)
            } else if (value is Float) {
                array.pushDouble(value.toDouble())
            } else if (value is Long) {
                array.pushDouble(value.toDouble())
            } else if (value is String) {
                array.pushString(value)
            } else {
                array.pushString(value.toString())
            }
        }
        return array
    }
}
