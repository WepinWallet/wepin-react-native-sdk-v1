package com.wepin.storagern

import android.app.Activity
import android.content.Context
import android.content.Intent
import android.content.SharedPreferences.Editor
import android.os.Build;
import android.util.Log
import androidx.annotation.RequiresApi
import androidx.security.crypto.EncryptedSharedPreferences
import androidx.security.crypto.MasterKey
import com.facebook.react.bridge.ActivityEventListener
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.ReadableType
import com.facebook.react.bridge.Arguments
import org.json.JSONObject

import com.wepin.storagern.utils.MapUtil.readableMapToHashMap
import com.wepin.storagern.storage.StorageManager

@RequiresApi(Build.VERSION_CODES.M)
class WepinStorageRnModule(reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext),
  ActivityEventListener {
  private val TAG = "WepinStorageRnModule"
  private val reactContext: ReactApplicationContext
  private val NAME: String = "WepinStorageRn"
  private var promise: Promise? = null
  private val PREV_PREFERENCE_NAME = "wepin_encrypted_preferences"
  private lateinit var _prevStorage: EncryptedSharedPreferences
  private lateinit var _storage: StorageManager
  private val cookie_name = "wepin:auth:"

  override fun getName(): String {
    return NAME
  }

  companion object {
    const val NAME = "WepinStorageRn"
  }

  init {
    this.reactContext = reactContext
    reactContext.addActivityEventListener(this)
  }

  override fun onNewIntent(intent: Intent?) {
    // Handle the new intent here
  }

  override fun onActivityResult(activity: Activity?, requestCode: Int, resultCode: Int, data: Intent?) {}

  private fun initializePrevStorage(context: ReactApplicationContext) {
    val masterKey = MasterKey.Builder(context)
      .setKeyScheme(MasterKey.KeyScheme.AES256_GCM)
      .build()

      _prevStorage = EncryptedSharedPreferences.create(
        context,
        PREV_PREFERENCE_NAME,
        masterKey,
        EncryptedSharedPreferences.PrefKeyEncryptionScheme.AES256_SIV,
        EncryptedSharedPreferences.PrefValueEncryptionScheme.AES256_GCM
      ) as EncryptedSharedPreferences
    }

  private fun migrationOldStorage(appId: String) {
    try {
      val migrationState = this._storage.read(appId, "migration")
      if (migrationState == "true") return

      val oldStorage = _prevStorageReadAll()
      oldStorage?.forEach { (key, value) ->
        try {
          if (!key.startsWith(cookie_name)) return@forEach

          val appId = key.substring(cookie_name.length)

          val jsonString = when (value) {
            is ByteArray -> String(value, Charsets.UTF_8)
            is String -> value
            else -> return@forEach
          }

          val jsonData = JSONObject(jsonString)
          jsonData.keys().forEach { key -> 
            val jsonValue = jsonData.get(key)
            val dataValue = when (jsonValue) {
              is ByteArray -> String(jsonValue, Charsets.UTF_8)
              is String -> jsonValue
              is JSONObject -> {
                jsonValue.toString()
              }
              else -> {
                return@forEach
              }
            }
            this._storage.write(appId, key, dataValue)
          }
        } catch (e: Exception) {}
        
      }
    } catch(e: Exception) {
          // Log.d(TAG, "Migration failed with an unexpected error - $e")
    } finally {
      this._storage.write(appId, "migration", "true")
      _prevDeleteAll()
    }
  }

  private fun _prevStorageReadAll(): Map<String, *>? {
    return _prevStorage.all
  }

  private fun _prevDeleteAll() {
    val editor: Editor = _prevStorage.edit()
    editor.clear()
    editor.commit()
  }

  @ReactMethod
  fun initializeStorage(appId: String) {
    try {
      initializePrevStorage(this.reactContext)
    } catch(error: Exception) {
      this.reactContext.getSharedPreferences(PREV_PREFERENCE_NAME, Context.MODE_PRIVATE)
        .edit()
        .clear()
        .apply()
      initializePrevStorage(this.reactContext)
    }
    this._storage = StorageManager(this.reactContext.applicationContext)
    migrationOldStorage(appId)
  }
  
  @ReactMethod
  fun setItem(appId: String, key: String, value: String, promise: Promise) {
    _storage.write(appId, key, value)
    promise.resolve(null)
  }

  @ReactMethod
  fun setAllItems(appId: String, data: ReadableMap, promise: Promise) {
    readableMapToHashMap(data).forEach { (key, value) ->
      _storage.write(appId, key, value)
    }

    promise.resolve(null)
  }

  @ReactMethod
  fun getItem(appId: String, key: String?, promise: Promise) {
    try {
      val value = _storage.read(appId, key)
      promise.resolve(value)
    } catch(e: Exception) {
      promise.reject(e)
    }
    return
  }

  @ReactMethod
  fun getAllItems(appId: String, promise: Promise) {
    try {
      val all = _storage.readAll(appId)
      val writableMap = Arguments.createMap()
      for ((key, value) in all) {
        writableMap.putString(key, value)
      }
      promise.resolve(writableMap)
    } catch(e: Exception) {
      // promise.reject(throw)
      promise.resolve(null)
    }
    return
  }

  @ReactMethod
  fun removeItem(appId: String, key: String?, promise: Promise) {
    try {
      this._storage.delete(appId, key)
      promise.resolve(null)
    } catch (e: Exception) {
      promise.reject(e)
    }
    return 
  }

  @ReactMethod
  fun clear(appId: String, promise: Promise) {
    try {
      this._storage.deleteAll()
      promise.resolve(null)
    } catch (e: Exception) {
      promise.reject(e)
    }
    return 
  }
}
