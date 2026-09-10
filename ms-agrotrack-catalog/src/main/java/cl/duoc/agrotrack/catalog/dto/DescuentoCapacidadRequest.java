package cl.duoc.agrotrack.catalog.dto;

import jakarta.validation.constraints.Positive;

public record DescuentoCapacidadRequest(
        @Positive Double cantidadKg
) {}
