export type TipoSensor = 'temperatura' | 'humedad' | 'luz' | 'movimiento';
export type EstadoSensor = 'normal' | 'advertencia' | 'error' | 'offline';
export type SeveridadError = 'baja' | 'media' | 'alta';
export type EstadoConexionType = 'conectado' | 'desconectado' | 'conectando' | 'error';

export interface SensorBase {
  id: string;
  nombre: string;
  tipo: TipoSensor;
  ubicacion: UbicacionSensor;
  unidad: string;
  rango: string;
}

export interface UbicacionSensor{
  edificio: string;
  habitacion: string;
  zona: string;
}

export interface MetadataSensor {
  nivelBateria: number;
  intensidadSenal: number;
  ultimaCalibracion: string;
}

export interface LecturaSensor {
  sensorId: string;
  valor: number | boolean;
  unidad: string;
  estado: EstadoSensor;
  timestamp: string;
  metadata: MetadataSensor;
}

export interface ErrorSensor {
  codigoError: string;
  sensorId: string;
  mensaje: string;
  severidad: SeveridadError;
  timestamp?: string;
}

export interface MensajeConexion {
  tipo: 'conexion_establecida';
  mensaje: string;
  clienteId: string;
  timestamp: string;
}

export interface MensajeLectura {
  tipo: 'lectura_sensor';
  datos: LecturaSensor;
}

export interface MensajeError {
  tipo: 'error_sensor';
  datos: ErrorSensor;
}

export interface MensajeListaSensores {
  tipo: 'lista_sensores';
  sensores: SensorBase[];
}

export interface EstadisticasServidor {
  tiempoActividad: number;
  totalConexiones: number;
  sensoresActivos: number;
  erroresTotales: number;
}

export interface MensajeEstadisticas {
  tipo: 'estadisticas_servidor';
  datos: EstadisticasServidor;
}

export type MensajeWebSocket = 
  | MensajeConexion 
  | MensajeLectura 
  | MensajeError 
  | MensajeListaSensores
  | MensajeEstadisticas;

export interface ComandoWebSocket {
  tipo: 'ping' | 'obtener_sensores' | 'obtener_estadisticas_servidor';
}

export interface InfoEstadoConexion {
  estado: EstadoConexionType;
  latencia?: number;
  uptime?: number;
  ultimaConexion?: Date;
  intentosReconexion?: number;
}

export interface SensorConLectura extends SensorBase {
  ultimaLectura?: LecturaSensor;
  ultimoError?: ErrorSensor;
  estaActivo: boolean;
}

export interface FiltrosSensores {
  tipo?: TipoSensor;
  ubicacion?: string;
  estado?: EstadoSensor;
  busqueda?: string;
}

export interface MetricasDashboard {
  sensoresActivos: number;
  sensoresConError: number;
  promedioTemperatura?: number;
  promedioHumedad?: number;
  ultimaActualizacion: Date;
}
