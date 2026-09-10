package cl.duoc.agrotrack.deliveries.controller;

import cl.duoc.agrotrack.deliveries.dto.DeliveryRequest;
import cl.duoc.agrotrack.deliveries.dto.DeliveryResponse;
import cl.duoc.agrotrack.deliveries.dto.DeliveryStatusUpdateRequest;
import cl.duoc.agrotrack.deliveries.model.Delivery;
import cl.duoc.agrotrack.deliveries.model.DeliveryStatus;
import cl.duoc.agrotrack.deliveries.service.DeliveryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/deliveries")
@RequiredArgsConstructor
public class DeliveryController {

    private final DeliveryService service;

    @PostMapping
    public ResponseEntity<DeliveryResponse> crear(@Valid @RequestBody DeliveryRequest request) {
        Delivery creada = service.crear(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(DeliveryResponse.from(creada));
    }

    @GetMapping("/{id}")
    public DeliveryResponse buscarPorId(@PathVariable Long id) {
        return DeliveryResponse.from(service.buscarPorId(id));
    }

    @GetMapping
    public List<DeliveryResponse> listar(@RequestParam(required = false) DeliveryStatus status) {
        return service.listar(status).stream().map(DeliveryResponse::from).toList();
    }

    @PutMapping("/{id}/status")
    public DeliveryResponse cambiarEstado(@PathVariable Long id,
                                           @Valid @RequestBody DeliveryStatusUpdateRequest request) {
        return DeliveryResponse.from(service.cambiarEstado(id, request.nuevoEstado()));
    }
}
