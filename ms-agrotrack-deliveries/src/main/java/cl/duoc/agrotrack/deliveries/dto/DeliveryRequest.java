package cl.duoc.agrotrack.deliveries.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record DeliveryRequest(
        @NotBlank String productorRut,
        @NotBlank String productorNombre,
        @NotNull Long productoId,
        @Positive Double cantidadKg
) {}
