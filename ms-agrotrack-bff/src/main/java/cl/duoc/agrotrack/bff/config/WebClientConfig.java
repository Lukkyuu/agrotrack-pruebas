package cl.duoc.agrotrack.bff.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class WebClientConfig {

    @Value("${agrotrack.services.deliveries-url}")
    private String deliveriesUrl;

    @Value("${agrotrack.services.catalog-url}")
    private String catalogUrl;

    @Bean
    public WebClient deliveriesWebClient() {
        return WebClient.builder().baseUrl(deliveriesUrl).build();
    }

    @Bean
    public WebClient catalogWebClient() {
        return WebClient.builder().baseUrl(catalogUrl).build();
    }
}
