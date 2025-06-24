# 🚀 Dashboard IoT

## 📋 **OBJETIVO**

Desarrollar **desde cero** un dashboard completo de sensores IoT en tiempo real que demuestre dominio de:
- **Angular 17+** (Standalone Components, Signals, Control Flow)
- **WebSockets** para comunicación en tiempo real
- **HTTP Interceptors** para manejo de errores
- **UI/UX profesional** con diseño responsivo
- **Arquitectura escalable** y código de calidad 

**⚠️ IMPORTANTE:** Este proyecto contiene un **servidor funcional** y un **esqueleto básico**, solo debes implementar **la funcionalidad del frontend**.

---

## 🏗️ **ESTRUCTURA DEL PROYECTO**

```
sensors/
├── 📄 README.md                    # Este archivo
├── 📁 server/                    # ✅ SERVIDOR COMPLETO Y FUNCIONAL
│   ├── package.json               # Dependencias del servidor
│   ├── server.js                 # Servidor WebSocket con 5 sensores simulados
│   └── README.md                  # Documentación del servidor
└── 📁 frontend/                   # 🛠️ ESQUELETO BÁSICO (Implementar funcionalidad)
    ├── package.json               # Dependencias Angular 17+ configuradas
    ├── angular.json               # Configuración del proyecto
    ├── src/
    │   ├── index.html             # HTML base
    │   ├── main.ts                # Bootstrap temporal con componente placeholder
    │   ├── styles.css             # Archivo de estilos vacío
    │   └── app/
    │       ├── components/        # 📁 VACÍA - Crear todos los componentes
    │       │   └── README.md      # Guía de componentes a crear
    │       ├── services/          # 📁 VACÍA - Crear WebSocket service, state, etc.
    │       │   └── README.md      # Guía de servicios a implementar
    │       ├── interceptors/      # 📁 VACÍA - Crear HTTP interceptors
    │       ├── types/             # Interfaces TypeScript con esqueleto
    │       │   └── sensor.types.ts # Tipos básicos definidos
    │       └── utils/             # 📁 VACÍA - Utilidades opcionales
    └── README.md                  # Instrucciones técnicas del frontend
```

---

## 🚀 **INICIO RÁPIDO**

### **1. Instalación**
```bash
# Navegar al proyecto
cd sensors-prueba/sensors

# Instalar dependencias del servidor
cd server
npm install

# Instalar dependencias del frontend
cd ../frontend
npm install
```

### **2. Ejecutar**
```bash
# Terminal 1 - Servidor WebSocket
cd server
npm start
# ✅ Servidor corriendo en ws://localhost:8080

# Terminal 2 - Frontend Angular
cd frontend
ng serve
# 📱 Frontend en http://localhost:4200
```

### **3. Verificar**
- **Servidor Health:** http://localhost:8080/health (debe responder JSON con status)
- **Frontend:** http://localhost:4200 (verás página placeholder con instrucciones)
- **WebSocket:** `ws://localhost:8080` (para conectar desde tu servicio)

---

## 📊 **SERVIDOR IMPLEMENTADO**

### **WebSocket Endpoint:** `ws://localhost:8080`

El servidor ya está **completamente implementado** con:
- ✅ **5 Sensores Simulados:** Temperatura (2), Humedad (1), Movimiento (1), Luz (1)
- ✅ **Datos en Tiempo Real:** Actualizaciones cada 2 segundos
- ✅ **Simulación de Errores:** 2% probabilidad de errores por sensor
- ✅ **API Completa:** Múltiples tipos de mensajes y comandos
- ✅ **Health Check:** Endpoint HTTP para monitoreo

### **Sensores Disponibles:**
```typescript
[
  {
    id: 'TEMP_001',
    nombre: 'Temperatura Sala de Conferencias',
    tipo: 'temperatura',
    ubicacion: { zona: 'oficina', habitacion: 'Sala de Conferencias A' },
    unidad: '°C',
    rango: { min: 18, max: 28 }
  },
  {
    id: 'HUM_001', 
    nombre: 'Humedad Sala de Conferencias',
    tipo: 'humedad',
    ubicacion: { zona: 'oficina', habitacion: 'Sala de Conferencias A' },
    unidad: '%',
    rango: { min: 30, max: 80 }
  },
  {
    id: 'TEMP_002',
    nombre: 'Temperatura Lobby',
    tipo: 'temperatura', 
    ubicacion: { zona: 'entrada', habitacion: 'Lobby Principal' },
    unidad: '°C',
    rango: { min: 16, max: 30 }
  },
  {
    id: 'MOVIMIENTO_001',
    nombre: 'Detector de Movimiento Lobby',
    tipo: 'movimiento',
    ubicacion: { zona: 'entrada', habitacion: 'Lobby Principal' },
    unidad: 'boolean',
    rango: { min: 0, max: 1 }
  },
  {
    id: 'LUZ_001',
    nombre: 'Sensor de Iluminación Oficina',
    tipo: 'luz',
    ubicacion: { zona: 'oficina', habitacion: 'Área Abierta' },
    unidad: 'lux',
    rango: { min: 0, max: 1000 }
  }
]
```

### **Mensajes WebSocket Implementados:**

#### **Mensajes que Recibirás:**
```typescript
// 1. Conexión establecida
{
  tipo: 'conexion_establecida',
  mensaje: 'Conectado al Servidor de Sensores IoT',
  clienteId: 'cliente_xxx',
  timestamp: '2024-01-15T10:30:00.000Z',
  infoServidor: {
    version: '1.0.0',
    totalSensores: 5,
    intervaloActualizacion: 2000
  }
}

// 2. Lectura de sensor en tiempo real (cada 2 segundos por sensor)
{
  tipo: 'lectura_sensor',
  datos: {
    id: 'TEMP_001_lectura_1704444600000',
    sensorId: 'TEMP_001',
    nombreSensor: 'Temperatura Sala de Conferencias',
    tipo: 'temperatura',
    valor: 23.5,
    unidad: '°C',
    timestamp: '2024-01-15T10:30:00.000Z',
    estado: 'normal', // 'normal', 'advertencia', 'error'
    ubicacion: {
      zona: 'oficina',
      habitacion: 'Sala de Conferencias A',
      edificio: 'Edificio Principal'
    },
    metadata: {
      nivelBateria: 85,
      intensidadSenal: 92,
      ultimaCalibracion: '2024-01-10T08:15:00.000Z'
    }
  },
  timestamp: '2024-01-15T10:30:00.000Z'
}

// 3. Error de sensor (2% probabilidad)
{
  tipo: 'error_sensor',
  datos: {
    codigoError: 'SENSOR_OFFLINE', // Múltiples tipos de error
    sensorId: 'TEMP_001',
    nombreSensor: 'Temperatura Sala de Conferencias',
    mensaje: 'El sensor no responde',
    severidad: 'alta', // 'baja', 'media', 'alta'
    timestamp: '2024-01-15T10:30:00.000Z',
    ubicacion: { /* ubicación del sensor */ },
    solucionProblemas: [
      'Verificar conexión de energía del sensor',
      'Verificar conectividad de red',
      'Reiniciar sensor si es necesario'
    ],
    metadata: {
      errorId: 'ERR_1704444600000_xyz',
      reintentoAutomatico: false,
      resolucionEstimada: '15-30 minutos'
    }
  },
  timestamp: '2024-01-15T10:30:00.000Z'
}

// 4. Lista de sensores (respuesta a comando)
{
  tipo: 'lista_sensores',
  sensores: [/* array de sensores */],
  timestamp: '2024-01-15T10:30:00.000Z'
}

// 5. Estadísticas del servidor (respuesta a comando)
{
  tipo: 'estadisticas_servidor',
  estadisticas: {
    horaInicio: 1704444000000,
    conexionesTotales: 5,
    mensajesTotales: 1250,
    erroresTotal: 25,
    sensoresActivos: 5,
    uptime: 3600,
    clientesActivos: 2,
    usoMemoria: { /* object memory usage */ }
  },
  timestamp: '2024-01-15T10:30:00.000Z'
}
```

#### **Comandos que Puedes Enviar:**
```typescript
{ tipo: 'ping' }                           // Verificar conexión → recibe 'pong'
{ tipo: 'obtener_sensores' }               // Lista sensores → recibe 'lista_sensores'
{ tipo: 'obtener_estadisticas_servidor' }   // Stats → recibe 'estadisticas_servidor'
{ tipo: 'suscribir_sensor', sensorId: 'TEMP_001' }  // Suscribirse a sensor específico
```

---

## 🎯 **LO QUE DEBES IMPLEMENTAR**

### **Frontend**

#### **1. WebSocket Service**
- [ ] Conectar a `ws://localhost:8080`
- [ ] Parser de mensajes por tipo
- [ ] Métricas de conexión (latencia, uptime, errores)

#### **2. State Management con Signals**
- [ ] Signal para sensores disponibles y lecturas en tiempo real
- [ ] Computed signals para datos derivados (filtros, estadísticas)
- [ ] Integración con RxJS donde sea necesario

#### **3. HTTP Interceptors**
- [ ] Interceptor global de errores HTTP
- [ ] Logging y telemetría de requests
- [ ] Headers de autenticación si es necesario

#### **4. Componentes UI**
- [ ] **AppComponent** - Componente raíz con routing
- [ ] **HeaderComponent** - Navegación y estado de conexión
- [ ] **DashboardComponent** - Vista principal con métricas
- [ ] **SensorCardComponent** - Tarjeta individual de sensor
- [ ] **SensorListComponent** - Lista con filtros y búsqueda
- [ ] **ErrorPanelComponent** - Gestión de errores
- [ ] **LoadingComponent** - Estados de carga

#### **5. Funcionalidades del Dashboard**
- [ ] Métricas en tiempo real (sensores activos, errores, uptime)
- [ ] Lista de sensores con estado actual
- [ ] Filtrado por tipo de sensor, zona, estado
- [ ] Búsqueda de sensores por nombre/ID
- [ ] Gestión de errores

#### **6. Diseño Responsivo**
- [ ] Layout mobile-first
- [ ] Grid responsivo para sensor cards

### **Características Obligatorias**
- ✅ **Standalone Components** sin AppModule
- ✅ **Signals** para estado reactivo completo
- ✅ **Control Flow** (@for, @if, @defer) en templates
- ✅ **inject()** pattern en lugar de constructor DI
- ✅ **TypeScript estricto** sin 'any' types

---

## 🚀 **PUNTOS BONUS**


### **Features Adicionales**
- ✅ **Data Visualization** - Gráficos interactivos (Chart.js/D3.js)
- ✅ **Real-time Notifications** - Push notifications del navegador
- ✅ **Internationalization** - i18n con múltiples idiomas
- ✅ **Dark/Light Theme** - Sistema de temas con persistencia

---

## 📝 **ENTREGABLES**

### **Código Fuente (Obligatorio)**
- [ ] Repositorio Git con commits descriptivos y frecuentes
- [ ] Aplicación Angular funcionando sin errores de compilación

### **Documentación (Obligatorio)**
- [ ] README.md actualizado con instrucciones de setup
- [ ] Explicación de decisiones arquitectónicas tomadas
- [ ] Screenshots de la aplicación funcionando

---

## ❓ **PREGUNTAS FRECUENTES**

**Q: ¿Puedo usar librerías adicionales?**
A: Sí, pero justifica su uso. Preferimos implementaciones custom que demuestren tus habilidades. UI libraries (Material, PrimeNG) o charting (Chart.js) son aceptables.

**Q: ¿Es necesario completar todo?**
A: No, pero prioriza funcionalidad core sobre características bonus. Mejor pocas funcionalidades perfectas que muchas incompletas.

**Q: ¿Puedo modificar el servidor?**
A: No, el servidor está completamente implementado y no debe modificarse. Solo trabaja en el frontend.

**Q: ¿Cómo manejo TypeScript strict mode?**
A: Mantén el modo estricto habilitado. Las interfaces base están en `types/sensor.types.ts` - complétalas con todos los datos del servidor.

**Q: ¿Qué framework CSS recomiendan?**
A: Tailwind CSS (recomendado), Bootstrap 5, o Angular Material. También puedes usar CSS puro con variables CSS modernas.

**Q: ¿El servidor simula datos realistas?**
A: Sí, el servidor genera datos realistas con rangos normales, errores ocasionales, metadatos completos y ubicaciones específicas.

---

**Recuerda:** El servidor está funcional con datos realistas. Solo necesitas construir el frontend Angular 17+ y conectarlo a la API WebSocket ya implementada.
