package cl.duoc.agrotrack.deliveries.exception;

public class DeliveryNotFoundException extends RuntimeException {
    public DeliveryNotFoundException(Long id) {
        super("No existe una entrega con id " + id);
    }
}
