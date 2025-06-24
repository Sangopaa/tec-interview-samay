# Frontend Dashboard IoT

## 🎯 **QUÉ DEBES IMPLEMENTAR**

Este directorio contiene solo el **esqueleto básico**. Debes implementar las funcionalidades del dashboard IoT.

### **Archivos Proporcionados:**
- ✅ `package.json` - Dependencias mínimas de Angular 17+
- ✅ `angular.json` - Configuración básica del proyecto
- ✅ `src/index.html` - HTML base con placeholder
- ✅ `src/main.ts` - Bootstrap temporal
- ✅ `src/styles.css` - Archivo de estilos
- ✅ `src/app/types/sensor.types.ts` - Esqueleto de interfaces

---

## 🚀 **PASO A PASO PARA EMPEZAR**

### **1. Setup Inicial**
```bash
# En el directorio frontend/
npm install

# Instalar Angular CLI si no lo tienes
npm install -g @angular/cli@17
```

### **2. Conectar al Servidor**
El servidor WebSocket está en `ws://localhost:8080` totalmente funcional.

**Mensajes que recibirás:**
```typescript
// Conexión establecida
{
  tipo: 'conexion_establecida',
  clienteId: 'client_xxx',
  timestamp: '2024-01-01T00:00:00.000Z'
}

// Lectura de sensor
{
  tipo: 'lectura_sensor', 
  datos: {
    id: 'TEMP_001_reading_xxx',
    sensorId: 'TEMP_001',
    tipo: 'temperatura',
    valor: 23.5,
    unidad: '°C',
    estado: 'normal',
    // ... más propiedades
  }
}

// Error de sensor
{
  tipo: 'error_sensor',
  datos: {
    codigoError: 'SENSOR_OFFLINE',
    mensaje: 'El sensor no responde',
    severidad: 'alta'
    // ... más propiedades  
  }
}
```

**Comandos que puedes enviar:**
```typescript
// Ping
{ tipo: 'ping' }

// Obtener sensores
{ tipo: 'obtener_sensores' }

// Obtener estadísticas  
{ tipo: 'obtener_estadisticas_servidor' }
```

---

## 📋 **CHECKLIST DE IMPLEMENTACIÓN**

### **Funcionalidades Core (Obligatorias)**

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

## 🎨 **RECOMENDACIONES DE DISEÑO**

### **Framework CSS**
Elige uno y configura:
- **Tailwind CSS** (recomendado) - Utility-first
- **Bootstrap 5** - Component-based
- **Angular Material** - Google's design system

### **Color Palette Sugerida**
```css
:root {
  --primary: #3b82f6;
  --secondary: #8b5cf6;
  --success: #10b981;
  --warning: #f59e0b;
  --error: #ef4444;
  --background: #ffffff;
  --surface: #f8fafc;
  --text-primary: #1f2937;
  --text-secondary: #6b7280;
}
```

### **Layout Sugerido**
```
┌─────────────────────────────────────┐
│ Header (conexión, nav, theme)       │
├─────────────────────────────────────┤
│ Dashboard Stats (métricas)          │
├─────────────────────────────────────┤
│ Sensor Grid/List                    │
│ ┌─────┐ ┌─────┐ ┌─────┐             │
│ │ S1  │ │ S2  │ │ S3  │             │
│ └─────┘ └─────┘ └─────┘             │
├─────────────────────────────────────┤
│ Error Panel (si hay errores)        │
└─────────────────────────────────────┘
```

---

Recuerda: El servidor está listo en `ws://localhost:8080`. 
Solo necesitas construir el frontend.