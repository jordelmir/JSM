package com.gasolinerajsm.redemptionservice.config

import com.gasolinerajsm.sdk.adengine.api.AdApi
import com.gasolinerajsm.sdk.adengine.ApiClient
import org.springframework.boot.web.client.RestTemplateBuilder
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.retry.annotation.EnableRetry
import org.springframework.retry.backoff.FixedBackOffPolicy
import org.springframework.retry.policy.SimpleRetryPolicy
import org.springframework.retry.support.RetryTemplate

@Configuration
@EnableRetry
class ApiClientConfig {

    @Bean
    fun retryTemplate(): RetryTemplate {
        val retryTemplate = RetryTemplate()
        val fixedBackOffPolicy = FixedBackOffPolicy()
        fixedBackOffPolicy.backOffPeriod = 1000L // 1 second backoff
        retryTemplate.setBackOffPolicy(fixedBackOffPolicy)

        val retryPolicy = SimpleRetryPolicy()
        retryPolicy.maxAttempts = 3 // Retry up to 3 times
        retryTemplate.setRetryPolicy(retryPolicy)
        return retryTemplate
    }

    @Bean
    fun restTemplate(retryTemplate: RetryTemplate): RestTemplateBuilder {
        return RestTemplateBuilder()
            .setConnectTimeout(java.time.Duration.ofSeconds(5))
            .setReadTimeout(java.time.Duration.ofSeconds(10))
            .interceptors(RetryInterceptor(retryTemplate))
    }

    @Bean
    fun adApi(restTemplateBuilder: RestTemplateBuilder): AdApi {
        val apiClient = ApiClient(restTemplateBuilder.build())
        apiClient.basePath = "https://ad-engine:8080" // URL de servicio interna en Docker, usar HTTPS para Zero Trust
        return AdApi(apiClient)
    }
}

// Custom interceptor to apply RetryTemplate
import org.springframework.http.HttpRequest
import org.springframework.http.client.ClientHttpRequestExecution
import org.springframework.http.client.ClientHttpRequestInterceptor
import org.springframework.http.client.ClientHttpResponse

class RetryInterceptor(private val retryTemplate: RetryTemplate) : ClientHttpRequestInterceptor {
    override fun intercept(request: HttpRequest, body: ByteArray, execution: ClientHttpRequestExecution): ClientHttpResponse {
        return retryTemplate.execute<ClientHttpResponse, Throwable> {
            execution.execute(request, body)
        }
    }
}
