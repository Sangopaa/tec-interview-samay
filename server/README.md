# Servidor IoT

Servidor de simulación de sensores IoT.

## Instalación

```bash
npm install
```

## Ejecución

```bash
# Modo desarrollo (con nodemon)
npm run dev

# Modo producción
npm start
```

## Endpoints

- **WebSocket:** `ws://localhost:8080`
- **Health Check:** `http://localhost:8080/health`

## Tipos de Sensores

1. **Temperatura** - Salas de conferencias y lobby
2. **Humedad** - Sala de conferencias
3. **Movimiento** - Detector en lobby
4. **Luz** - Sensor de iluminación en oficina

## Mensajes WebSocket

### Del Cliente al Servidor
- `ping` - Verificación de conexión
- `obtener_sensores` - Obtener lista de sensores
- `obtener_estadisticas_servidor` - Obtener estadísticas del servidor

### Del Servidor al Cliente
- `conexion_establecida` - Confirmación de conexión
- `lectura_sensor` - Datos de sensor en tiempo real
- `error_sensor` - Errores de sensores
- `pong` - Respuesta a ping