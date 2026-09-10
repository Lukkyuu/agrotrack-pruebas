package cl.duoc.agrotrack.catalog.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;

public record ProductoRequest(
        @NotBlank String nombre,
        @NotBlank String unidad,
        @Positive Double capacidadTotalKg
) {}
