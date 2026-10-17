package com.romio.androiddemo

import android.content.Context
import android.graphics.Color
import android.os.Bundle
import android.view.View
import android.widget.Button
import android.widget.EditText
import android.widget.LinearLayout
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import org.json.JSONObject
import java.io.BufferedReader
import java.io.OutputStreamWriter
import java.net.HttpURLConnection
import java.net.URL
import java.util.concurrent.ExecutorService
import java.util.concurrent.Executors

class MainActivity : AppCompatActivity() {
    private lateinit var executor: ExecutorService
    private lateinit var loginCard: LinearLayout
    private lateinit var appContainer: LinearLayout
    private lateinit var loginError: TextView
    private lateinit var usernameInput: EditText
    private lateinit var passwordInput: EditText
    private lateinit var whoAmIText: TextView
    private lateinit var profileStatusText: TextView
    private lateinit var viewHome: LinearLayout
    private lateinit var viewSettings: LinearLayout
    private lateinit var viewForm: LinearLayout
    private lateinit var emailInput: EditText
    private lateinit var messageInput: EditText
    private lateinit var formStatusText: TextView
    private lateinit var submitButton: Button

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        executor = Executors.newSingleThreadExecutor()
        bindViews()
        bindEvents()
        restoreSession()
    }

    override fun onDestroy() {
        super.onDestroy()
        executor.shutdownNow()
    }

    private fun bindViews() {
        loginCard = findViewById(R.id.login_card)
        appContainer = findViewById(R.id.app_container)
        loginError = findViewById(R.id.login_error)
        usernameInput = findViewById(R.id.login_username)
        passwordInput = findViewById(R.id.login_password)
        whoAmIText = findViewById(R.id.home_whoami)
        profileStatusText = findViewById(R.id.home_profile_status)
        viewHome = findViewById(R.id.view_home)
        viewSettings = findViewById(R.id.view_settings)
        viewForm = findViewById(R.id.view_form)
        emailInput = findViewById(R.id.form_email)
        messageInput = findViewById(R.id.form_message)
        formStatusText = findViewById(R.id.form_status)
        submitButton = findViewById(R.id.form_submit)
    }

    private fun bindEvents() {
        findViewById<Button>(R.id.login_submit).setOnClickListener { onLoginPressed() }
        findViewById<Button>(R.id.nav_home).setOnClickListener { showView(Screen.HOME) }
        findViewById<Button>(R.id.nav_settings).setOnClickListener { showView(Screen.SETTINGS) }
        findViewById<Button>(R.id.nav_form).setOnClickListener { showView(Screen.FORM) }
        findViewById<Button>(R.id.nav_logout).setOnClickListener { setLoggedOut() }
        submitButton.setOnClickListener { submitContact() }
    }

    private fun restoreSession() {
        val username = prefs().getString(PREF_USERNAME, null)
        if (username.isNullOrBlank()) {
            setLoggedOut(clearPersistedSession = false)
            return
        }
        setLoggedIn(username, persist = false)
    }

    private fun onLoginPressed() {
        val username = usernameInput.text.toString().trim()
        val password = passwordInput.text.toString()

        if (username == VALID_USERNAME && password == VALID_PASSWORD) {
            loginError.visibility = View.GONE
            setLoggedIn(username)
            return
        }

        loginError.visibility = View.VISIBLE
    }

    private fun setLoggedIn(username: String, persist: Boolean = true) {
        loginCard.visibility = View.GONE
        appContainer.visibility = View.VISIBLE
        whoAmIText.text = username
        formStatusText.text = ""

        if (persist) {
            prefs().edit().putString(PREF_USERNAME, username).apply()
        }

        showView(Screen.HOME)
        fetchDemoProfile()
    }

    private fun setLoggedOut(clearPersistedSession: Boolean = true) {
        appContainer.visibility = View.GONE
        loginCard.visibility = View.VISIBLE
        loginError.visibility = View.GONE
        usernameInput.setText("")
        passwordInput.setText("")
        emailInput.setText("")
        messageInput.setText("")
        formStatusText.text = ""
        profileStatusText.text = getString(R.string.profile_status_idle)
        profileStatusText.setTextColor(Color.DKGRAY)

        if (clearPersistedSession) {
            prefs().edit().remove(PREF_USERNAME).apply()
        }
    }

    private fun showView(screen: Screen) {
        viewHome.visibility = if (screen == Screen.HOME) View.VISIBLE else View.GONE
        viewSettings.visibility = if (screen == Screen.SETTINGS) View.VISIBLE else View.GONE
        viewForm.visibility = if (screen == Screen.FORM) View.VISIBLE else View.GONE
    }

    private fun fetchDemoProfile() {
        profileStatusText.text = getString(R.string.profile_status_loading)
        profileStatusText.setTextColor(Color.DKGRAY)

        executor.execute {
            val endpoint = "${BuildConfig.DEMO_API_BASE_URL}/api/users/demo"
            val result = runCatching {
                val response = requestJson("GET", endpoint)
                val user = response.getJSONObject("user")
                val role = user.getString("role")
                val features = user.getJSONArray("features")
                val featureList = buildString {
                    for (index in 0 until features.length()) {
                        if (index > 0) append(", ")
                        append(features.getString(index))
                    }
                }
                getString(R.string.profile_status_loaded, role, featureList)
            }

            runOnUiThread {
                if (result.isSuccess) {
                    profileStatusText.text = result.getOrThrow()
                    profileStatusText.setTextColor(Color.parseColor("#14532d"))
                } else {
                    profileStatusText.text = getString(R.string.profile_status_error, endpoint)
                    profileStatusText.setTextColor(Color.parseColor("#b91c1c"))
                }
            }
        }
    }

    private fun submitContact() {
        val email = emailInput.text.toString().trim()
        val message = messageInput.text.toString().trim()

        if (!isValidEmail(email) || message.length < 10) {
            showFormStatus(getString(R.string.form_error_validation), isError = true)
            return
        }

        submitButton.isEnabled = false
        showFormStatus(getString(R.string.form_status_submitting), isError = false, neutral = true)

        executor.execute {
            val endpoint = "${BuildConfig.DEMO_API_BASE_URL}/api/messages"
            val result = runCatching {
                val payload = JSONObject()
                    .put("email", email)
                    .put("message", message)

                val response = requestJson("POST", endpoint, payload.toString())
                response.getString("status")
            }

            runOnUiThread {
                submitButton.isEnabled = true
                if (result.isSuccess && result.getOrThrow() == "accepted") {
                    emailInput.setText("")
                    messageInput.setText("")
                    showFormStatus(getString(R.string.form_status_success), isError = false)
                } else {
                    showFormStatus(getString(R.string.form_status_error), isError = true)
                }
            }
        }
    }

    private fun showFormStatus(message: String, isError: Boolean, neutral: Boolean = false) {
        formStatusText.text = message
        formStatusText.setTextColor(
            when {
                neutral -> Color.DKGRAY
                isError -> Color.parseColor("#b91c1c")
                else -> Color.parseColor("#14532d")
            }
        )
    }

    private fun requestJson(method: String, endpoint: String, body: String? = null): JSONObject {
        val connection = (URL(endpoint).openConnection() as HttpURLConnection).apply {
            requestMethod = method
            connectTimeout = 5_000
            readTimeout = 5_000
            setRequestProperty("Content-Type", "application/json; charset=utf-8")
            setRequestProperty("Accept", "application/json")
            doInput = true
            if (body != null) {
                doOutput = true
            }
        }

        try {
            if (body != null) {
                OutputStreamWriter(connection.outputStream, Charsets.UTF_8).use { writer ->
                    writer.write(body)
                }
            }

            val statusCode = connection.responseCode
            val stream = if (statusCode in 200..299) connection.inputStream else connection.errorStream
            val responseBody = BufferedReader(stream.reader(Charsets.UTF_8)).use { reader ->
                reader.readText()
            }

            if (statusCode !in 200..299) {
                throw IllegalStateException("HTTP $statusCode: $responseBody")
            }

            return JSONObject(responseBody)
        } finally {
            connection.disconnect()
        }
    }

    private fun prefs() = getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)

    private fun isValidEmail(email: String): Boolean =
        email.contains('@') && email.substringAfter('@', "").contains('.')

    private enum class Screen {
        HOME,
        SETTINGS,
        FORM
    }

    companion object {
        private const val VALID_USERNAME = "demo"
        private const val VALID_PASSWORD = "secret"
        private const val PREFS_NAME = "android-demo-app"
        private const val PREF_USERNAME = "username"
    }
}
