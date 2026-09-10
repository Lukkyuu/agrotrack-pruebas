# AgroTrack — Backend (avance para EP1 de DSY1107)

Este es un backend "a medio hacer" para que Lian pueda avanzar rápido con lo
que pide la Evaluación Parcial N°1 de DSY1107 (Desarrollo Cloud Native I):
varios microservicios en Spring Boot, con el BFF validando el JWT del IDaaS
(Azure AD) antes de dejar pasar cualquier llamada.

## Qué YA está hecho

- **ms-agrotrack-deliveries** (puerto 8081): CRUD de entregas + máquina de
  estados con validación de transición (no se puede saltar a EN_DESPACHO sin
  pasar por RECIBIDA). Corre out-of-the-box con H2 en memoria.
- **ms-agrotrack-catalog** (puerto 8082): CRUD de productos + lógica de
  descuento de capacidad de bodega. También corre con H2 en memoria.
- **ms-agrotrack-bff** (puerto 8080): valida el JWT (issuer, firma, vigencia,
  audience), extrae roles desde el claim `roles` de Azure AD, aplica
  autorización por rol y hace de proxy hacia deliveries/catalog.

## Qué falta completar (con datos que da Diego)

En `ms-agrotrack-bff/src/main/resources/application.yml`:

```yaml
spring:
  security:
    oauth2:
      resourceserver:
        jwt:
          issuer-uri: https://login.microsoftonline.com/{TENANT_ID}/v2.0
agrotrack:
  security:
    expected-audience: CAMBIAR_CLIENT_ID
```

Reemplazar `{TENANT_ID}` por el Directory (tenant) ID del App Registration
de Azure AD, y `CAMBIAR_CLIENT_ID` por el Application (client) ID. Diego
tiene esos dos valores apenas cree el App Registration.

También hay que definir en Azure AD los **App Roles** `ADMIN`, `OPERADOR`,
`PRODUCTOR` y `AUDITOR` para que el claim `roles` del token venga poblado
(si no, todo el mundo cae en 403 al pedir un endpoint con rol específico).

## Cómo correr cada servicio en local

Cada microservicio es un proyecto Maven independiente:

```bash
cd ms-agrotrack-deliveries && mvn spring-boot:run   # puerto 8081
cd ms-agrotrack-catalog    && mvn spring-boot:run   # puerto 8082
cd ms-agrotrack-bff        && mvn spring-boot:run   # puerto 8080
```

Por defecto usan el perfil `local` con H2 en memoria (no se necesita Oracle
para probar la lógica). Cuando tengan la base de datos cloud, cambiar a
`-Dspring-boot.run.profiles=cloud` y completar las credenciales en el
bloque `cloud` de cada `application.yml`.

Consola H2 disponible en `http://localhost:8081/h2-console` (y 8082) con
JDBC URL `jdbc:h2:mem:agrotrack_deliveries` (o `agrotrack_catalog`).

## Cómo probar sin frontend todavía

```bash
# Crear un producto
curl -X POST http://localhost:8082/api/catalog/products \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Manzana Fuji","unidad":"kg","capacidadTotalKg":1000}'

# Crear una entrega
curl -X POST http://localhost:8081/api/deliveries \
  -H "Content-Type: application/json" \
  -d '{"productorRut":"12.345.678-9","productorNombre":"Juan Pérez","productoId":1,"cantidadKg":150}'

# Intentar un salto de estado inválido (debe responder 409)
curl -X PUT http://localhost:8081/api/deliveries/1/status \
  -H "Content-Type: application/json" \
  -d '{"nuevoEstado":"EN_DESPACHO"}'
```

El BFF (puerto 8080) expone los mismos endpoints bajo `/api/deliveries` y
`/api/catalog`, pero **exige un Bearer token válido** — para probarlo
necesitas un token real de Azure AD una vez que Diego tenga el frontend
con MSAL funcionando, o generar uno de prueba con Postman/Azure CLI.

## Pendiente (fuera del alcance de la EP1, pero sí del caso completo)

- Publicar eventos en Kafka desde `DeliveryService.cambiarEstado()`
  (hay un `// TODO` marcado en el código).
- Conectar `deliveries` con `catalog` para descontar capacidad al recibir
  una entrega (también marcado con `// TODO`).
- RabbitMQ + `ms-agrotrack-notify`.
- `ms-agrotrack-audit` y `ms-agrotrack-report`.
- Passar a la base de datos Oracle real (perfil `cloud`) y desplegar en EC2.

Ver la página de Notion del proyecto para el detalle de estas tareas.
