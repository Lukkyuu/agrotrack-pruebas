package cl.duoc.agrotrack.deliveries.dto;

import cl.duoc.agrotrack.deliveries.model.DeliveryStatus;
import jakarta.validation.constraints.NotNull;

public record DeliveryStatusUpdateRequest(
        @NotNull DeliveryStatus nuevoEstado
) {}
