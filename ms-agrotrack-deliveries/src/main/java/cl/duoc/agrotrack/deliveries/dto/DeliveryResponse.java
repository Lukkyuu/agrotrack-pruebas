package cl.duoc.agrotrack.deliveries.dto;

import cl.duoc.agrotrack.deliveries.model.Delivery;
import cl.duoc.agrotrack.deliveries.model.DeliveryStatus;

import java.time.LocalDateTime;

public record DeliveryResponse(
        Long id,
        String productorRut,
        String productorNombre,
        Long productoId,
        Double cantidadKg,
        DeliveryStatus status,
        LocalDateTime fechaCreacion,
        LocalDateTime fechaUltimoCambio
) {
    public static DeliveryResponse from(Delivery d) {
        return new DeliveryResponse(
                d.getId(), d.getProductorRut(), d.getProductorNombre(),
                d.getProductoId(), d.getCantidadKg(), d.getStatus(),
                d.getFechaCreacion(), d.getFechaUltimoCambio()
        );
    }
}
