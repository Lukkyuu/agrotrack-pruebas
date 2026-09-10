package cl.duoc.agrotrack.deliveries.exception;

import cl.duoc.agrotrack.deliveries.model.DeliveryStatus;

public class InvalidStatusTransitionException extends RuntimeException {
    public InvalidStatusTransitionException(DeliveryStatus actual, DeliveryStatus solicitado) {
        super("No se puede pasar de %s a %s".formatted(actual, solicitado));
    }
}
