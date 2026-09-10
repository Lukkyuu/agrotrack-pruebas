package cl.duoc.agrotrack.bff.config;

import org.springframework.core.convert.converter.Converter;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;

import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Azure AD entrega los roles de la app en el claim "roles" (App Roles),
 * no en "scope". Este converter los mapea a authorities de Spring Security
 * con prefijo ROLE_, para poder usar hasRole()/hasAuthority() mas abajo.
 */
public class RolesClaimConverter implements Converter<Jwt, AbstractAuthenticationToken> {

    @Override
    public AbstractAuthenticationToken convert(Jwt jwt) {
        Collection<GrantedAuthority> authorities = extraerRoles(jwt).stream()
                .map(rol -> new SimpleGrantedAuthority("ROLE_" + rol))
                .collect(Collectors.toList());
        return new JwtAuthenticationToken(jwt, authorities);
    }

    @SuppressWarnings("unchecked")
    private List<String> extraerRoles(Jwt jwt) {
        Object roles = jwt.getClaims().get("roles");
        if (roles instanceof List<?> lista) {
            return lista.stream().map(String::valueOf).toList();
        }
        return List.of();
    }
}
