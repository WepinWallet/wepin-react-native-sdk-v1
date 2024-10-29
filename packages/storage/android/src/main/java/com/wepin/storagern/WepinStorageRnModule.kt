package com.wepin.storagern

import android.app.Activity
import android.content.Context
import android.content.Intent
import android.content.SharedPreferences.Editor
import android.os.Build;
import androidx.annotation.RequiresApi
import androidx.security.crypto.EncryptedSharedPreferences
import androidx.security.crypto.MasterKey
import com.facebook.react.bridge.ActivityEventListener
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

@RequiresApi(Build.VERSION_CODES.M)
class WepinStorageRnModule(reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext),
  ActivityEventListener {
  private val reactContext: ReactApplicationContext
  private val NAME: String = "WepinStorageRn"
  private var promise: Promise? = null
  private val TRANSFORMATION = "AES/CBC/PKCS7Padding"
  private val PREFERENCE_NAME = "wepin_encrypted_preferences"
  private lateinit var sharedPreferences: EncryptedSharedPreferences

  override fun getName(): String {
    return NAME
  }

  companion object {
    const val NAME = "WepinStorageRn"
  }

  init {
    this.reactContext = reactContext
    reactContext.addActivityEventListener(this)
    val masterKey =
      MasterKey.Builder(reactContext as Context)
        .setKeyScheme(MasterKey.KeyScheme.AES256_GCM)
        .build()
    sharedPreferences =
      EncryptedSharedPreferences.create(
        reactContext,
        PREFERENCE_NAME,
        masterKey,
        EncryptedSharedPreferences.PrefKeyEncryptionScheme.AES256_SIV,
        EncryptedSharedPreferences.PrefValueEncryptionScheme.AES256_GCM,
      ) as EncryptedSharedPreferences
  }

  override fun onNewIntent(intent: Intent?) {
    // Handle the new intent here
  }

  override fun onActivityResult(activity: Activity?, requestCode: Int, resultCode: Int, data: Intent?) {}

  @ReactMethod
  fun setItem(key: String, value: String, promise: Promise) {
    if (this.sharedPreferences == null) {
      promise.reject(NullPointerException("Could not initialize SharedPreferences"))
      return
    }
    val editor: Editor = sharedPreferences.edit()

    editor.putString(key, value)?.apply()
    val saved = editor.commit()

    if (saved) {
      promise.resolve(value)
    } else {
      promise.reject(Exception(String.format("An error occurred while saving %s", key)))
    }
  }

  @ReactMethod
  fun getItem(key: String?, promise: Promise) {
    if (this.sharedPreferences == null) {
      promise.reject(NullPointerException("Could not initialize SharedPreferences"))
      return
    }

    var value = sharedPreferences.getString(key, null)
    if (value == null) {
      promise.resolve(null)
      return
    }

    promise.resolve(value)
  }

  @ReactMethod
  fun removeItem(key: String?, promise: Promise) {
    if (this.sharedPreferences == null) {
      promise.reject(NullPointerException("Could not initialize SharedPreferences"))
      return
    }

    val editor: Editor = sharedPreferences.edit()
    editor.remove(key)
    val saved = editor.commit()

    if (saved) {
      promise.resolve(key)
    } else {
      promise.reject(Exception(String.format("An error occurred while removing %s", key)))
    }
  }

  @ReactMethod
  fun clear(promise: Promise) {
    if (this.sharedPreferences == null) {
      promise.reject(NullPointerException("Could not initialize SharedPreferences"))
      return
    }

    val editor: Editor = sharedPreferences.edit()
    editor.clear()
    val saved = editor.commit()

    if (saved) {
      promise.resolve(null)
    } else {
      promise.reject(Exception("An error occurred while clearing SharedPreferences"))
    }
  }
}
