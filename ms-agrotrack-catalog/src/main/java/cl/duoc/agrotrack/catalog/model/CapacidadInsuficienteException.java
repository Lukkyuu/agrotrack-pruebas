package cl.duoc.agrotrack.catalog.model;

public class CapacidadInsuficienteException extends RuntimeException {
    public CapacidadInsuficienteException(Long productoId, Double disponible, Double solicitado) {
        super("Capacidad insuficiente para el producto %d: disponible %.2f kg, solicitado %.2f kg"
                .formatted(productoId, disponible, solicitado));
    }
}
