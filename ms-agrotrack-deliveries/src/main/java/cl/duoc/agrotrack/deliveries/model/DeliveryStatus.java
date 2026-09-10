package cl.duoc.agrotrack.deliveries.model;

import java.util.List;
import java.util.Map;

/**
 * Estados de una entrega y las transiciones validas entre ellos.
 * Regla de negocio critica del caso AgroTrack: no se puede saltar directo
 * a EN_DESPACHO sin haber pasado por RECIBIDA.
 */
public enum DeliveryStatus {
    REGISTRADA,
    RECIBIDA,
    EN_CLASIFICACION,
    EN_DESPACHO,
    DESPACHADA,
    RECHAZADA;

    private static final Map<DeliveryStatus, List<DeliveryStatus>> TRANSICIONES_VALIDAS = Map.of(
            REGISTRADA, List.of(RECIBIDA, RECHAZADA),
            RECIBIDA, List.of(EN_CLASIFICACION, RECHAZADA),
            EN_CLASIFICACION, List.of(EN_DESPACHO, RECHAZADA),
            EN_DESPACHO, List.of(DESPACHADA),
            DESPACHADA, List.of(),
            RECHAZADA, List.of()
    );

    public boolean puedeTransicionarA(DeliveryStatus siguiente) {
        return TRANSICIONES_VALIDAS.getOrDefault(this, List.of()).contains(siguiente);
    }
}
