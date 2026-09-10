package cl.duoc.agrotrack.bff.config;

import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.OAuth2TokenValidator;
import org.springframework.security.oauth2.core.OAuth2TokenValidatorResult;
import org.springframework.security.oauth2.jwt.Jwt;

/**
 * Spring Boot valida por defecto issuer, firma y vigencia (exp/nbf) del JWT
 * a partir del issuer-uri configurado. Este validador agrega la verificacion
 * de audience, que la pauta pide explicitamente.
 */
public class JwtAudienceValidator implements OAuth2TokenValidator<Jwt> {

    private final String expectedAudience;

    public JwtAudienceValidator(String expectedAudience) {
        this.expectedAudience = expectedAudience;
    }

    @Override
    public OAuth2TokenValidatorResult validate(Jwt jwt) {
        if (jwt.getAudience() != null && jwt.getAudience().contains(expectedAudience)) {
            return OAuth2TokenValidatorResult.success();
        }
        OAuth2Error error = new OAuth2Error(
                "invalid_token",
                "El token no contiene el audience esperado: " + expectedAudience,
                null
        );
        return OAuth2TokenValidatorResult.failure(error);
    }
}
