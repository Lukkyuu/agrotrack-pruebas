package cl.duoc.agrotrack.bff.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

/**
 * Proxy hacia ms-agrotrack-deliveries. Al llegar aqui, Spring Security
 * ya garantizo que el JWT es valido y que el rol tiene permiso
 * (ver SecurityConfig). Este controlador solo reenvia la peticion.
 */
@RestController
@RequestMapping("/api/deliveries")
@RequiredArgsConstructor
public class DeliveriesProxyController {

    private final WebClient deliveriesWebClient;

    @PostMapping
    public Mono<ResponseEntity<Object>> crear(@RequestBody Object body) {
        return deliveriesWebClient.post().uri("/api/deliveries").bodyValue(body)
                .retrieve().toEntity(Object.class);
    }

    @GetMapping("/{id}")
    public Mono<ResponseEntity<Object>> buscarPorId(@PathVariable Long id) {
        return deliveriesWebClient.get().uri("/api/deliveries/{id}", id)
                .retrieve().toEntity(Object.class);
    }

    @GetMapping
    public Mono<ResponseEntity<Object>> listar(@RequestParam(required = false) String status) {
        return deliveriesWebClient.get()
                .uri(uriBuilder -> uriBuilder.path("/api/deliveries")
                        .queryParamIfPresent("status", java.util.Optional.ofNullable(status))
                        .build())
                .retrieve().toEntity(Object.class);
    }

    @PutMapping("/{id}/status")
    public Mono<ResponseEntity<Object>> cambiarEstado(@PathVariable Long id, @RequestBody Object body) {
        return deliveriesWebClient.put().uri("/api/deliveries/{id}/status", id).bodyValue(body)
                .retrieve().toEntity(Object.class);
    }
}
