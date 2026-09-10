package cl.duoc.agrotrack.deliveries.repository;

import cl.duoc.agrotrack.deliveries.model.Delivery;
import cl.duoc.agrotrack.deliveries.model.DeliveryStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DeliveryRepository extends JpaRepository<Delivery, Long> {
    List<Delivery> findByStatus(DeliveryStatus status);
}
