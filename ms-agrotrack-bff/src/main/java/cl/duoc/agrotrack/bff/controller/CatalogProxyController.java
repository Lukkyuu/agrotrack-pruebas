package cl.duoc.agrotrack.bff.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/catalog")
@RequiredArgsConstructor
public class CatalogProxyController {

    private final WebClient catalogWebClient;

    @PostMapping("/products")
    public Mono<ResponseEntity<Object>> crear(@RequestBody Object body) {
        return catalogWebClient.post().uri("/api/catalog/products").bodyValue(body)
                .retrieve().toEntity(Object.class);
    }

    @GetMapping("/products")
    public Mono<ResponseEntity<Object>> listar() {
        return catalogWebClient.get().uri("/api/catalog/products")
                .retrieve().toEntity(Object.class);
    }

    @GetMapping("/products/{id}")
    public Mono<ResponseEntity<Object>> buscarPorId(@PathVariable Long id) {
        return catalogWebClient.get().uri("/api/catalog/products/{id}", id)
                .retrieve().toEntity(Object.class);
    }
}
