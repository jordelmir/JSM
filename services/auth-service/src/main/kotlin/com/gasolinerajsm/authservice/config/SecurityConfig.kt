package com.gasolinerajsm.authservice.config

import com.gasolinerajsm.authservice.filter.JwtAuthenticationFilter // New import
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.authentication.AuthenticationProvider
import org.springframework.security.authentication.dao.DaoAuthenticationProvider
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.config.http.SessionCreationPolicy
import org.springframework.security.core.userdetails.UserDetailsService // New import
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.security.web.SecurityFilterChain
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter // New import
import org.springframework.web.cors.CorsConfiguration // New import
import org.springframework.web.cors.CorsConfigurationSource // New import
import com.gasolinerajsm.authservice.config.CorsProperties // New import
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter // New import
import org.springframework.web.cors.CorsConfiguration // New import
import org.springframework.web.cors.CorsConfigurationSource // New import
import org.springframework.web.cors.UrlBasedCorsConfigurationSource // New import

/**
 * Security configuration for the Auth Service application.
 * Configures password encoding, CSRF, session management, and request authorization.
 */
@Configuration
@EnableWebSecurity
class SecurityConfig(
    private val jwtAuthFilter: JwtAuthenticationFilter,
    private val userDetailsService: UserDetailsService,
    private val corsProperties: CorsProperties // Injected CorsProperties
) {

    /**
     * Provides a BCryptPasswordEncoder bean for password hashing.
     * @return A PasswordEncoder instance.
     */
    @Bean
    fun passwordEncoder(): PasswordEncoder {
        return BCryptPasswordEncoder()
    }

    /**
     * Configures CORS (Cross-Origin Resource Sharing) for the application.
     * Allows requests from any origin, with any headers, and any methods.
     * @return A CorsConfigurationSource instance.
     */
    @Bean
    fun corsConfigurationSource(): CorsConfigurationSource {
        val configuration = CorsConfiguration()
        configuration.allowedOrigins = corsProperties.allowedOrigins
        configuration.allowedMethods = corsProperties.allowedMethods
        configuration.allowedHeaders = corsProperties.allowedHeaders
        configuration.allowCredentials = corsProperties.allowCredentials
        val source = UrlBasedCorsConfigurationSource()
        source.registerCorsConfiguration("/**", configuration) // Apply CORS to all paths
        return source
    }

/**
 * Security configuration for the Auth Service application.
 * Configures password encoding, CSRF, session management, and request authorization.
 */
@Configuration
@EnableWebSecurity
class SecurityConfig(
    private val jwtAuthFilter: JwtAuthenticationFilter,
    private val userDetailsService: UserDetailsService
) {

    /**
     * Provides a BCryptPasswordEncoder bean for password hashing.
     * @return A PasswordEncoder instance.
     */
    @Bean
    fun passwordEncoder(): PasswordEncoder {
        return BCryptPasswordEncoder()
    }

    /**
     * Configures the authentication provider for the application.
     * Uses DaoAuthenticationProvider with custom UserDetailsService and PasswordEncoder.
     * @return An AuthenticationProvider instance.
     */
    @Bean
    fun authenticationProvider(): AuthenticationProvider {
        val authProvider = DaoAuthenticationProvider()
        authProvider.setUserDetailsService(userDetailsService)
        authProvider.setPasswordEncoder(passwordEncoder())
        return authProvider
    }

    /**
     * Configures CORS (Cross-Origin Resource Sharing) for the application.
     * Allows requests from any origin, with any headers, and any methods.
     * @return A CorsConfigurationSource instance.
     */
    @Bean
    fun corsConfigurationSource(): CorsConfigurationSource {
        val configuration = CorsConfiguration()
        configuration.allowedOrigins = listOf("*") // Allow all origins
        configuration.allowedMethods = listOf("GET", "POST", "PUT", "DELETE", "OPTIONS") // Allow all common methods
        configuration.allowedHeaders = listOf("*") // Allow all headers
        configuration.allowCredentials = true // Allow credentials (cookies, auth headers)
        val source = UrlBasedCorsConfigurationSource()
        source.registerCorsConfiguration("/**", configuration) // Apply CORS to all paths
        return source
    }

    /**
     * Configures the security filter chain for HTTP requests.
     * @param http The HttpSecurity object to configure.
     * @return A SecurityFilterChain instance.
     * @throws Exception if an error occurs during configuration.
     */
    @Bean
    fun securityFilterChain(http: HttpSecurity): SecurityFilterChain {
        http
            .csrf { it.disable() } // Disable CSRF for stateless API
            .cors { it.configurationSource(corsConfigurationSource()) } // Apply CORS configuration
            .sessionManagement { session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS) } // Set session management to stateless
            .authorizeHttpRequests { auth ->
                auth
                    .requestMatchers("/auth/**", "/api/auth/**", "/error").permitAll() // Allow unauthenticated access to auth and error endpoints
                    .anyRequest().authenticated() // All other requests require authentication
            }
            .authenticationProvider(authenticationProvider()) // Set custom authentication provider
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter::class.java) // Add JWT filter before UsernamePasswordAuthenticationFilter

        return http.build()
    }
}
