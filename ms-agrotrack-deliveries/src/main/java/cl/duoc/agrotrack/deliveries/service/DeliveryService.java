package cl.duoc.agrotrack.deliveries.service;

import cl.duoc.agrotrack.deliveries.dto.DeliveryRequest;
import cl.duoc.agrotrack.deliveries.exception.DeliveryNotFoundException;
import cl.duoc.agrotrack.deliveries.exception.InvalidStatusTransitionException;
import cl.duoc.agrotrack.deliveries.model.Delivery;
import cl.duoc.agrotrack.deliveries.model.DeliveryStatus;
import cl.duoc.agrotrack.deliveries.repository.DeliveryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DeliveryService {

    private final DeliveryRepository repository;

    // TODO (Lian): cuando ms-agrotrack-catalog este listo, inyectar un
    // cliente (WebClient/RestTemplate) para validar/descontar capacidad
    // de bodega al crear o recibir una entrega.

    @Transactional
    public Delivery crear(DeliveryRequest request) {
        Delivery delivery = Delivery.builder()
                .productorRut(request.productorRut())
                .productorNombre(request.productorNombre())
                .productoId(request.productoId())
                .cantidadKg(request.cantidadKg())
                .status(DeliveryStatus.REGISTRADA)
                .build();
        return repository.save(delivery);
    }

    public Delivery buscarPorId(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new DeliveryNotFoundException(id));
    }

    public List<Delivery> listar(DeliveryStatus status) {
        return status == null ? repository.findAll() : repository.findByStatus(status);
    }

    @Transactional
    public Delivery cambiarEstado(Long id, DeliveryStatus nuevoEstado) {
        Delivery delivery = buscarPorId(id);

        if (!delivery.getStatus().puedeTransicionarA(nuevoEstado)) {
            throw new InvalidStatusTransitionException(delivery.getStatus(), nuevoEstado);
        }

        delivery.setStatus(nuevoEstado);
        delivery.setFechaUltimoCambio(LocalDateTime.now());

        // TODO (Lian): publicar el evento en el topico Kafka "deliveries.events"
        // aqui, una vez que la infraestructura de Kafka este levantada.

        return repository.save(delivery);
    }
}
