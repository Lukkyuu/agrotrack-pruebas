package cl.duoc.agrotrack.bff.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.core.OAuth2TokenValidator;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtDecoders;
import org.springframework.security.oauth2.jwt.JwtValidators;
import org.springframework.security.oauth2.server.resource.web.access.BearerTokenAccessDeniedHandler;
import org.springframework.security.oauth2.server.resource.web.access.BearerTokenAuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;

/**
 * Config de seguridad del BFF. Cubre el indicador de la pauta:
 * "Configura correctamente el BFF para que ... pueda validar el token
 * recibido con el IDaaS definido y solo permita consumir el endpoint
 * si el token es valido" (40% de la Evaluacion Parcial N1).
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Value("${spring.security.oauth2.resourceserver.jwt.issuer-uri}")
    private String issuerUri;

    @Value("${agrotrack.security.expected-audience}")
    private String expectedAudience;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/actuator/health").permitAll()
                        // Lectura de entregas y catalogo: cualquier rol autenticado
                        .requestMatchers("GET", "/api/deliveries/**", "/api/catalog/**").authenticated()
                        // Cambiar estado de una entrega: solo Admin u Operador (jefe de acopio)
                        .requestMatchers("PUT", "/api/deliveries/*/status")
                            .hasAnyRole("ADMIN", "OPERADOR")
                        // Crear entregas: Productor, Operador o Admin
                        .requestMatchers("POST", "/api/deliveries").hasAnyRole("ADMIN", "OPERADOR", "PRODUCTOR")
                        // Todo lo demas requiere token valido como minimo
                        .anyRequest().authenticated()
                )
                .oauth2ResourceServer(oauth2 -> oauth2
                        .jwt(jwt -> jwt
                                .decoder(jwtDecoder())
                                .jwtAuthenticationConverter(new RolesClaimConverter())
                        )
                        .authenticationEntryPoint(new BearerTokenAuthenticationEntryPoint()) // -> 401
                        .accessDeniedHandler(new BearerTokenAccessDeniedHandler())           // -> 403
                );

        return http.build();
    }

    /**
     * Decoder que valida, ademas de lo que Spring valida por defecto
     * (firma contra las JWKS del issuer, expiracion, not-before),
     * el audience esperado del token.
     */
    @Bean
    public JwtDecoder jwtDecoder() {
        var decoder = (org.springframework.security.oauth2.jwt.NimbusJwtDecoder) JwtDecoders.fromOidcIssuerLocation(issuerUri);

        OAuth2TokenValidator<org.springframework.security.oauth2.jwt.Jwt> validadorEstandar =
                JwtValidators.createDefaultWithIssuer(issuerUri);
        OAuth2TokenValidator<org.springframework.security.oauth2.jwt.Jwt> validadorAudience =
                new JwtAudienceValidator(expectedAudience);

        decoder.setJwtValidator(new org.springframework.security.oauth2.core.DelegatingOAuth2TokenValidator<>(
                validadorEstandar, validadorAudience
        ));

        return decoder;
    }
}
