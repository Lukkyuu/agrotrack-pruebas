package cl.duoc.agrotrack.catalog.service;

import cl.duoc.agrotrack.catalog.dto.ProductoRequest;
import cl.duoc.agrotrack.catalog.model.CapacidadInsuficienteException;
import cl.duoc.agrotrack.catalog.model.Producto;
import cl.duoc.agrotrack.catalog.repository.ProductoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class ProductoService {

    private final ProductoRepository repository;

    @Transactional
    public Producto crear(ProductoRequest request) {
        Producto producto = Producto.builder()
                .nombre(request.nombre())
                .unidad(request.unidad())
                .capacidadTotalKg(request.capacidadTotalKg())
                .capacidadDisponibleKg(request.capacidadTotalKg())
                .build();
        return repository.save(producto);
    }

    public List<Producto> listar() {
        return repository.findAll();
    }

    public Producto buscarPorId(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("No existe el producto " + id));
    }

    /**
     * Descuenta capacidad de bodega al recibir una entrega.
     * Este es el metodo que ms-agrotrack-deliveries deberia llamar
     * (via WebClient/RestTemplate) cuando una entrega pasa a RECIBIDA.
     */
    @Transactional
    public Producto descontarCapacidad(Long productoId, Double cantidadKg) {
        Producto producto = buscarPorId(productoId);

        if (producto.getCapacidadDisponibleKg() < cantidadKg) {
            throw new CapacidadInsuficienteException(productoId, producto.getCapacidadDisponibleKg(), cantidadKg);
        }

        producto.setCapacidadDisponibleKg(producto.getCapacidadDisponibleKg() - cantidadKg);
        return repository.save(producto);
    }
}
