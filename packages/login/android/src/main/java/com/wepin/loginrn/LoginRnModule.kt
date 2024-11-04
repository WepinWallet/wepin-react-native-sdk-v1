package com.wepin.loginrn

import android.app.Activity
import android.content.ActivityNotFoundException
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.os.Build
import androidx.browser.customtabs.CustomTabsIntent
import androidx.browser.customtabs.TrustedWebUtils
import com.facebook.react.bridge.ActivityEventListener
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.ReadableType
import com.facebook.react.bridge.WritableMap

import com.wepin.loginrn.utils.CustomConnectionBuilder
import com.wepin.loginrn.utils.MapUtil
import com.wepin.loginrn.utils.TokenResponseFactory

import net.openid.appauth.AppAuthConfiguration
import net.openid.appauth.AuthorizationException
import net.openid.appauth.AuthorizationRequest
import net.openid.appauth.AuthorizationResponse
import net.openid.appauth.AuthorizationService
import net.openid.appauth.AuthorizationServiceConfiguration
import net.openid.appauth.CodeVerifierUtil
import net.openid.appauth.ResponseTypeValues
import net.openid.appauth.TokenRequest
import net.openid.appauth.TokenResponse
import net.openid.appauth.connectivity.ConnectionBuilder
import net.openid.appauth.connectivity.DefaultConnectionBuilder
import java.util.concurrent.ConcurrentHashMap


class LoginRnModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext),
    ActivityEventListener {
    private val reactContext: ReactApplicationContext
    private var promise: Promise? = null
    private var codeVerifier: String? = null
    private var state: String? = null
    private var registrationRequestHeaders: Map<String, String>? = null
    private var authorizationRequestHeaders: Map<String, String>? = null
    private var tokenRequestHeaders: Map<String, String>? = null
    private var additionalParametersMap: Map<String, String>? = null
    private var skipCodeExchange: Boolean? = null
    private val mServiceConfigurations: ConcurrentHashMap<String, AuthorizationServiceConfiguration?> =
        ConcurrentHashMap<String, AuthorizationServiceConfiguration?>()

    override fun getName(): String {
        return NAME
    }

    companion object {
        const val NAME = "LoginRn"
    }

    init {
        this.reactContext = reactContext
        reactContext.addActivityEventListener(this)
    }

    override fun onNewIntent(intent: Intent?) {
        // Handle the new intent here
    }

    @ReactMethod
    fun authorize(
        wepinAppId: String,
        redirectUrl: String,
        clientId: String,
        scopes: ReadableArray?,
        additionalParameters: ReadableMap?,
        serviceConfiguration: ReadableMap?,
        skipCodeExchange: Boolean,
        connectionTimeoutMillis: Double,
        customHeaders: ReadableMap?,
        androidAllowCustomBrowsers: ReadableArray?,
        androidTrustedWebActivity: Boolean,
        promise: Promise
    ) {
        parseHeaderMap(customHeaders)
        val builder: net.openid.appauth.connectivity.ConnectionBuilder = createConnectionBuilder(
            authorizationRequestHeaders, connectionTimeoutMillis
        )
        val appAuthConfiguration: AppAuthConfiguration = createAppAuthConfiguration(
            builder
        )
        val additionalParametersMap: HashMap<String, String> =
            MapUtil.readableMapToHashMap(additionalParameters)

        // store args in private fields for later use in onActivityResult handler
        this.promise = promise
        this.additionalParametersMap = additionalParametersMap
        this.skipCodeExchange = skipCodeExchange

        // when serviceConfiguration is provided, we don't need to hit up the OpenID
        // well-known id endpoint
          try {
              val serviceConfig: AuthorizationServiceConfiguration = createAuthorizationServiceConfiguration(
                  serviceConfiguration
              )
              authorizeWithConfiguration(
                  serviceConfig,
                  appAuthConfiguration,
                  clientId,
                  scopes,
                  redirectUrl,
                  additionalParametersMap,
                  androidTrustedWebActivity
              )
          } catch (e: ActivityNotFoundException) {
              promise.reject("browser_not_found", e.message)
          } catch (e: Exception) {
              promise.reject("authentication_failed", e.message)
          }

    }

    /*
     * Called when the OAuth browser activity completes
     */
    override fun onActivityResult(activity: Activity?, requestCode: Int, resultCode: Int, data: Intent?) {
        try {
            if (requestCode == 52) {
              val currentPromise = promise // promise를 로컬 변수로 복사하여 스마트 캐스트 문제 해결
                if (data == null) {
                    currentPromise?.reject("authentication_error", "Data intent is null")
                    return
                }
                val response: AuthorizationResponse? = AuthorizationResponse.fromIntent(data)
                val ex: AuthorizationException? = AuthorizationException.fromIntent(data)
                if (ex != null) {
                  currentPromise?.let { handleAuthorizationException("authentication_error", ex, it) }
                  return
                }
                if (skipCodeExchange == true) {
                    //stata == response.state
                    val map: WritableMap? = response?.let {
                      TokenResponseFactory.authorizationCodeResponseToMap(
                        it, codeVerifier, response.state)
                    }

                    if (map != null) {
                        currentPromise?.resolve(map)
                    } else {
                        currentPromise?.reject("authorization_error", "Response map is null")
                    }
                    return
                }
                val authorizePromise: Promise? = promise
                val configuration: AppAuthConfiguration = createAppAuthConfiguration(
                    createConnectionBuilder(
                        tokenRequestHeaders
                    )
                )
                val authService = AuthorizationService(reactContext, configuration)
                val tokenRequest: net.openid.appauth.TokenRequest?
                val additionalParams = additionalParametersMap
                tokenRequest = if (additionalParams == null) {
                    response?.createTokenExchangeRequest()
                } else {
                    response?.createTokenExchangeRequest(additionalParams)
                }
                val tokenResponseCallback: AuthorizationService.TokenResponseCallback =
                  AuthorizationService.TokenResponseCallback { resp, ex ->
                    if (resp != null && response != null) {
                      val map: WritableMap = 
                        TokenResponseFactory.tokenResponseToMap(resp, response)
                      if (authorizePromise != null) {
                        authorizePromise.resolve(map)
                      }
                    } else {
                      currentPromise?.let {
                        handleAuthorizationException("token_exchange_failed", ex, it)
                      }
                    }
                  }

                if(tokenRequest != null) {
                  authService.performTokenRequest(tokenRequest, tokenResponseCallback)
                }

            }
        } catch (e: Exception) {
          val currentPromise = promise
            if (currentPromise != null) {
                currentPromise.reject("run_time_exception", e.message)
            } else {
                throw e
            }
        }
    }

    /*
     * Authorize user with the provided configuration
     */
    private fun authorizeWithConfiguration(
        serviceConfiguration: AuthorizationServiceConfiguration?,
        appAuthConfiguration: AppAuthConfiguration,
        clientId: String,
        scopes: ReadableArray?,
        redirectUrl: String,
        additionalParametersMap: MutableMap<String, String>?,
        androidTrustedWebActivity: Boolean
    ) {
        var scopesString: String? = null
        if (scopes != null) {
            scopesString = arrayToString(scopes)
        }
        val context: Context = reactContext
        val currentActivity: Activity? = getCurrentActivity()
        val authRequestBuilder: AuthorizationRequest.Builder? =
          serviceConfiguration?.let {
            net.openid.appauth.AuthorizationRequest.Builder(
              it,
              clientId,
              ResponseTypeValues.CODE,
              Uri.parse(redirectUrl)
            )
          }
        if(authRequestBuilder != null){
          if (scopesString != null) {
              authRequestBuilder.setScope(scopesString)
          }
          if (additionalParametersMap != null) {
            // handle additional parameters separately to avoid exceptions from AppAuth
            if (additionalParametersMap.containsKey("display")) {
                authRequestBuilder.setDisplay(additionalParametersMap["display"])
                additionalParametersMap.remove("display")
            }
            if (additionalParametersMap.containsKey("login_hint")) {
                authRequestBuilder.setLoginHint(additionalParametersMap["login_hint"])
                additionalParametersMap.remove("login_hint")
            }
            if (additionalParametersMap.containsKey("prompt")) {
                authRequestBuilder.setPrompt(additionalParametersMap["prompt"])
                additionalParametersMap.remove("prompt")
            }
            if (additionalParametersMap.containsKey("state")) {
                authRequestBuilder.setState(additionalParametersMap["state"])
                state = additionalParametersMap["state"]
                additionalParametersMap.remove("state")
            }
            if (additionalParametersMap.containsKey("nonce")) {
                authRequestBuilder.setNonce(additionalParametersMap["nonce"])
                additionalParametersMap.remove("nonce")
            }
            if (additionalParametersMap.containsKey("ui_locales")) {
                authRequestBuilder.setUiLocales(additionalParametersMap["ui_locales"])
                additionalParametersMap.remove("ui_locales")
            }
            if (additionalParametersMap.containsKey("response_mode")) {
                authRequestBuilder.setResponseMode(additionalParametersMap["response_mode"])
                additionalParametersMap.remove("response_mode")
            }
            authRequestBuilder.setAdditionalParameters(additionalParametersMap)
        }
        codeVerifier = CodeVerifierUtil.generateRandomCodeVerifier()
        authRequestBuilder.setCodeVerifier(codeVerifier)

//        if (!useNonce!!) {
//            authRequestBuilder.setNonce(null)
//        }
        val authRequest: AuthorizationRequest = authRequestBuilder.build()
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            val authService = AuthorizationService(context, appAuthConfiguration)
            val intentBuilder: androidx.browser.customtabs.CustomTabsIntent.Builder =
                authService.createCustomTabsIntentBuilder()
            val customTabsIntent: CustomTabsIntent = intentBuilder.build()
            if (androidTrustedWebActivity) {
                customTabsIntent.intent.putExtra(
                    TrustedWebUtils.EXTRA_LAUNCH_AS_TRUSTED_WEB_ACTIVITY,
                    true
                )
            }
            val authIntent: Intent =
                authService.getAuthorizationRequestIntent(authRequest, customTabsIntent)
            currentActivity?.startActivityForResult(authIntent, 52)
        } else {
          if ( currentActivity != null){
            val authService = AuthorizationService(currentActivity, appAuthConfiguration)
            val pendingIntent = currentActivity.createPendingResult(52, Intent(), 0)
            authService.performAuthorizationRequest(authRequest, pendingIntent)
        }
          }

      }
    }

    private fun parseHeaderMap(headerMap: ReadableMap?) {
        if (headerMap == null) {
            return
        }
        if (headerMap.hasKey("register") && headerMap.getType("register") === ReadableType.Map) {
            registrationRequestHeaders = MapUtil.readableMapToHashMap(headerMap.getMap("register"))
        }
        if (headerMap.hasKey("authorize") && headerMap.getType("authorize") === ReadableType.Map) {
            authorizationRequestHeaders =
                MapUtil.readableMapToHashMap(headerMap.getMap("authorize"))
        }
        if (headerMap.hasKey("token") && headerMap.getType("token") === ReadableType.Map) {
            tokenRequestHeaders = MapUtil.readableMapToHashMap(headerMap.getMap("token"))
        }
    }

    /*
     * Create a space-delimited string from an array
     */
    private fun arrayToString(array: ReadableArray): String {
        val strBuilder = StringBuilder()
        for (i in 0 until array.size()) {
            if (i != 0) {
                strBuilder.append(' ')
            }
            strBuilder.append(array.getString(i))
        }
        return strBuilder.toString()
    }

    /*
     * Create a string list from an array of strings
     */
    private fun arrayToList(array: ReadableArray): List<String> {
        val list = ArrayList<String>()
        for (i in 0 until array.size()) {
            list.add(array.getString(i))
        }
        return list
    }

    /*
     * Create a Uri list from an array of strings
     */
    private fun arrayToUriList(array: ReadableArray): List<Uri> {
        val list = ArrayList<Uri>()
        for (i in 0 until array.size()) {
            list.add(Uri.parse(array.getString(i)))
        }
        return list
    }

    /*
     * Create an App Auth configuration using the provided connection builder
     */
    private fun createAppAuthConfiguration(
        connectionBuilder: net.openid.appauth.connectivity.ConnectionBuilder,
    ): AppAuthConfiguration {
        return net.openid.appauth.AppAuthConfiguration.Builder()
            .setConnectionBuilder(connectionBuilder)
            .build()
    }

    /*
     * Create appropriate connection builder based on provided settings
     */
    private fun createConnectionBuilder( headers: Map<String, String>?,
        connectionTimeoutMillis: Double
    ): ConnectionBuilder {
        val proxiedBuilder: ConnectionBuilder
        proxiedBuilder = DefaultConnectionBuilder.INSTANCE

        val customConnection = CustomConnectionBuilder(proxiedBuilder)
        if (headers != null) {
            customConnection.setHeaders(headers)
        }
        customConnection.setConnectionTimeout(connectionTimeoutMillis.toInt())
        return customConnection
    }
    private fun createConnectionBuilder(
        headers: Map<String, String>?
    ): net.openid.appauth.connectivity.ConnectionBuilder {
        val proxiedBuilder: net.openid.appauth.connectivity.ConnectionBuilder
        proxiedBuilder = DefaultConnectionBuilder.INSTANCE
        val customConnection = CustomConnectionBuilder(proxiedBuilder)
        if (headers != null) {
            customConnection.setHeaders(headers)
        }
        return customConnection
    }

    /*
     * Replicated private method from AuthorizationServiceConfiguration
     */
    private fun buildConfigurationUriFromIssuer(openIdConnectIssuerUri: Uri): Uri {
        return openIdConnectIssuerUri.buildUpon()
            .appendPath(AuthorizationServiceConfiguration.WELL_KNOWN_PATH)
            .appendPath(AuthorizationServiceConfiguration.OPENID_CONFIGURATION_RESOURCE)
            .build()
    }

    @Throws(Exception::class)
    private fun createAuthorizationServiceConfiguration(serviceConfiguration: ReadableMap?): AuthorizationServiceConfiguration {
      if(serviceConfiguration != null){
        if (!serviceConfiguration.hasKey("authorizationEndpoint")) {
            throw Exception("serviceConfiguration passed without an authorizationEndpoint")
        }
        if (!serviceConfiguration.hasKey("tokenEndpoint")) {
            throw Exception("serviceConfiguration passed without a tokenEndpoint")
        }
        val authorizationEndpoint =
            Uri.parse(serviceConfiguration.getString("authorizationEndpoint"))
        val tokenEndpoint = Uri.parse(serviceConfiguration.getString("tokenEndpoint"))
        var registrationEndpoint: Uri? = null
        var endSessionEndpoint: Uri? = null
        if (serviceConfiguration.hasKey("registrationEndpoint")) {
            registrationEndpoint = Uri.parse(serviceConfiguration.getString("registrationEndpoint"))
        }
        if (serviceConfiguration.hasKey("endSessionEndpoint")) {
            endSessionEndpoint = Uri.parse(serviceConfiguration.getString("endSessionEndpoint"))
        }
        return AuthorizationServiceConfiguration(
            authorizationEndpoint,
            tokenEndpoint,
            registrationEndpoint,
            endSessionEndpoint
        )
      } else {
        throw Exception("serviceConfiguration null")
      }

    }


    private fun handleAuthorizationException(
      fallbackErrorCode: String, ex: AuthorizationException?,
      promise: Promise?
    ) {
        if (ex != null) {
            if (ex.localizedMessage == null) {
                promise?.reject(fallbackErrorCode, ex.error ?: fallbackErrorCode, ex)
            } else {
                promise?.reject(
                    ex.error ?: fallbackErrorCode,
                    ex.localizedMessage,
                    ex
                )
            }
        }
    }
}
