package cl.duoc.agrotrack.deliveries.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "deliveries")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Delivery {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String productorRut;

    @Column(nullable = false)
    private String productorNombre;

    @Column(nullable = false)
    private Long productoId;

    @Column(nullable = false)
    private Double cantidadKg;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    @Builder.Default
    private DeliveryStatus status = DeliveryStatus.REGISTRADA;

    @Column(nullable = false)
    private LocalDateTime fechaCreacion;

    private LocalDateTime fechaUltimoCambio;

    @PrePersist
    void alCrear() {
        this.fechaCreacion = LocalDateTime.now();
        this.fechaUltimoCambio = this.fechaCreacion;
    }
}
