package com.wepin.loginrn.utils

import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale
import java.util.TimeZone

import android.text.TextUtils
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableArray
import com.facebook.react.bridge.WritableMap
import com.wepin.loginrn.utils.MapUtil.createAdditionalParametersMap


import net.openid.appauth.AuthorizationResponse;
import net.openid.appauth.TokenResponse;

object TokenResponseFactory {
    private fun createScopeArray(scope: String): WritableArray {
        val scopeArray: WritableArray = Arguments.createArray()
        if (!TextUtils.isEmpty(scope)) {
            val scopesArray = scope.split(" ".toRegex()).dropLastWhile { it.isEmpty() }
                .toTypedArray()
            for (i in scopesArray.indices) {
                scopeArray.pushString(scopesArray[i])
            }
        }
        return scopeArray
    }

    /*
     * Read raw token response into a React Native map to be passed down the bridge
     */
    fun tokenResponseToMap(response: net.openid.appauth.TokenResponse): WritableMap {
        val map: WritableMap = Arguments.createMap()
        map.putString("accessToken", response.accessToken)
        map.putMap(
            "additionalParameters",
            createAdditionalParametersMap(response.additionalParameters)
        )
        map.putString("idToken", response.idToken)
        map.putString("refreshToken", response.refreshToken)
        map.putString("tokenType", response.tokenType)
        if (response.accessTokenExpirationTime != null) {
            map.putString(
                "accessTokenExpirationDate",
                DateUtil.formatTimestamp(response.accessTokenExpirationTime)
            )
        }
        return map
    }

    /*
     * Read raw token response into a React Native map to be passed down the bridge
     */
    fun tokenResponseToMap(
        response: net.openid.appauth.TokenResponse,
        authResponse: AuthorizationResponse
    ): WritableMap {
        val map: WritableMap = Arguments.createMap()
        map.putString("accessToken", response.accessToken)
        map.putMap(
            "authorizeAdditionalParameters",
            createAdditionalParametersMap(authResponse.additionalParameters)
        )
        map.putMap(
            "tokenAdditionalParameters",
            createAdditionalParametersMap(response.additionalParameters)
        )
        map.putString("idToken", response.idToken)
        map.putString("refreshToken", response.refreshToken)
        map.putString("tokenType", response.tokenType)
        map.putArray("scopes", authResponse.scope?.let { createScopeArray(it) })
        if (response.accessTokenExpirationTime != null) {
            map.putString(
                "accessTokenExpirationDate",
                DateUtil.formatTimestamp(response.accessTokenExpirationTime)
            )
        }
        return map
    }

    /*
     * Read raw authorization into a React Native map to be passed down the bridge
     */
    fun authorizationResponseToMap(authResponse: AuthorizationResponse): WritableMap {
        val map: WritableMap = Arguments.createMap()
        map.putString("authorizationCode", authResponse.authorizationCode)
        map.putString("accessToken", authResponse.accessToken)
        map.putMap(
            "additionalParameters",
            createAdditionalParametersMap(authResponse.additionalParameters)
        )
        map.putString("idToken", authResponse.idToken)
        map.putString("tokenType", authResponse.tokenType)
        map.putArray("scopes", authResponse.scope?.let { createScopeArray(it) })
        if (authResponse.accessTokenExpirationTime != null) {
            map.putString(
                "accessTokenExpirationTime",
                DateUtil.formatTimestamp(authResponse.accessTokenExpirationTime)
            )
        }
        return map
    }

    /*
     * Read raw authorization into a React Native map with codeVerifier value added if present to be passed down the bridge
     */
    fun authorizationCodeResponseToMap(
        authResponse: AuthorizationResponse,
        codeVerifier: String?,
        state: String?
    ): WritableMap {
        val map: WritableMap = Arguments.createMap()
        map.putString("authorizationCode", authResponse.authorizationCode)
        map.putString("accessToken", authResponse.accessToken)
        map.putMap(
            "additionalParameters",
            createAdditionalParametersMap(authResponse.additionalParameters)
        )
        map.putString("idToken", authResponse.idToken)
        map.putString("tokenType", authResponse.tokenType)
        map.putArray("scopes", authResponse.scope?.let { createScopeArray(it) })
        if (authResponse.accessTokenExpirationTime != null) {
            map.putString(
                "accessTokenExpirationTime",
                DateUtil.formatTimestamp(authResponse.accessTokenExpirationTime)
            )
        }
        if (!TextUtils.isEmpty(codeVerifier)) {
            map.putString("codeVerifier", codeVerifier)
        }
        if (!TextUtils.isEmpty(state)) {
            map.putString("state", state)
        }
        return map
    }
}

object DateUtil {
    fun formatTimestamp(timestamp: Long?): String? {
        val expirationDate = timestamp?.let { Date(it) }
        val formatter = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'Z'", Locale.US)
        formatter.timeZone = TimeZone.getTimeZone("UTC")
        return expirationDate?.let { formatter.format(it) }
    }
}
