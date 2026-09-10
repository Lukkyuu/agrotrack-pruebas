package cl.duoc.agrotrack.catalog.repository;

import cl.duoc.agrotrack.catalog.model.Producto;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductoRepository extends JpaRepository<Producto, Long> {
}
