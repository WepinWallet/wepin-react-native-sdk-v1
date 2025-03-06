package com.wepin.storagern.utils

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.ReadableMapKeySetIterator

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
}
