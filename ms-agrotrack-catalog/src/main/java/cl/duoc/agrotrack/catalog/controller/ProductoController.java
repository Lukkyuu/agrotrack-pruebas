package cl.duoc.agrotrack.catalog.controller;

import cl.duoc.agrotrack.catalog.dto.DescuentoCapacidadRequest;
import cl.duoc.agrotrack.catalog.dto.ProductoRequest;
import cl.duoc.agrotrack.catalog.model.CapacidadInsuficienteException;
import cl.duoc.agrotrack.catalog.model.Producto;
import cl.duoc.agrotrack.catalog.service.ProductoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/api/catalog/products")
@RequiredArgsConstructor
public class ProductoController {

    private final ProductoService service;

    @PostMapping
    public ResponseEntity<Producto> crear(@Valid @RequestBody ProductoRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.crear(request));
    }

    @GetMapping
    public List<Producto> listar() {
        return service.listar();
    }

    @GetMapping("/{id}")
    public Producto buscarPorId(@PathVariable Long id) {
        return service.buscarPorId(id);
    }

    @PostMapping("/{id}/descontar-capacidad")
    public Producto descontarCapacidad(@PathVariable Long id,
                                        @Valid @RequestBody DescuentoCapacidadRequest request) {
        return service.descontarCapacidad(id, request.cantidadKg());
    }

    @ExceptionHandler(CapacidadInsuficienteException.class)
    public ResponseEntity<Object> handleCapacidadInsuficiente(CapacidadInsuficienteException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of(
                "timestamp", Instant.now().toString(),
                "status", HttpStatus.CONFLICT.value(),
                "message", ex.getMessage()
        ));
    }

    @ExceptionHandler(NoSuchElementException.class)
    public ResponseEntity<Object> handleNotFound(NoSuchElementException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
                "timestamp", Instant.now().toString(),
                "status", HttpStatus.NOT_FOUND.value(),
                "message", ex.getMessage()
        ));
    }
}
