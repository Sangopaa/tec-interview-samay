import { Injectable, signal, computed } from "@angular/core";
import { Subject, EMPTY } from "rxjs";
import { webSocket, WebSocketSubject } from "rxjs/webSocket";
import {
  MensajeWebSocket,
  ComandoWebSocket,
  InfoEstadoConexion,
  LecturaSensor,
  ErrorSensor,
  SensorBase,
  EstadisticasServidor,
} from "../types/sensor.types";
import { catchError, tap } from "rxjs/operators";
import { environment } from "src/environments/environment";

@Injectable({ providedIn: "root" })
export class WebSocketService {
  private readonly WS_URL = environment.wsUrl;
  private socket$: WebSocketSubject<any> | null = null;
  private reconnectAttempts = 0;
  private readonly maxReconnectAttempts = 5;
  private reconnectTimer?: any;

  // Signals de estado
  private _estadoConexion = signal<InfoEstadoConexion>({
    estado: "desconectado",
    latencia: 0,
    uptime: 0,
    intentosReconexion: 0,
  });

  private _sensoresDisponibles = signal<SensorBase[]>([]);
  private _ultimasLecturas = signal<Map<string, LecturaSensor>>(new Map());
  private _erroresSensores = signal<ErrorSensor[]>([]);
  private _estadisticasServidor = signal<EstadisticasServidor | null>(null);

  // Subjects
  private mensajesSubject = new Subject<MensajeWebSocket>();
  private lecturasSubject = new Subject<LecturaSensor>();
  private erroresSubject = new Subject<ErrorSensor>();

  // Observables públicos
  mensajes$ = this.mensajesSubject.asObservable();
  lecturas$ = this.lecturasSubject.asObservable();
  errores$ = this.erroresSubject.asObservable();

  // Signals públicos
  estadoConexion = this._estadoConexion.asReadonly();
  sensoresDisponibles = this._sensoresDisponibles.asReadonly();
  ultimasLecturas = this._ultimasLecturas.asReadonly();
  erroresSensores = this._erroresSensores.asReadonly();
  estadisticasServidor = this._estadisticasServidor.asReadonly();

  // Computed
  estaConectado = computed(() => this._estadoConexion().estado === "conectado");

  sensoresActivos = computed(() =>
    Array.from(this._ultimasLecturas().values()).filter(
      (lectura) => lectura.estado === "normal" || lectura.estado === "advertencia"
    ).length
  );

  sensoresConError = computed(() =>
    Array.from(this._ultimasLecturas().values()).filter(
      (lectura) => lectura.estado === "error" || lectura.estado === "offline"
    ).length
  );

  constructor() {
    this.iniciarConexion();
  }

  iniciarConexion(): void {
    if (this.socket$) return;

    this._estadoConexion.update((estado) => ({
      ...estado,
      estado: "conectando",
    }));

    try {
      this.socket$ = webSocket({
        url: this.WS_URL,
        openObserver: {
          next: () => {
            this.reconnectAttempts = 0;
            this._estadoConexion.update((estado) => ({
              ...estado,
              estado: "conectado",
              ultimaConexion: new Date(),
              intentosReconexion: 0,
            }));
            this.iniciarPing();
          },
        },
        closeObserver: {
          next: () => {
            this._estadoConexion.update((estado) => ({
              ...estado,
              estado: "desconectado",
            }));
            this.intentarReconexion();
          },
        },
      });

      this.socket$
        .pipe(
          tap((mensaje) => this.procesarMensaje(mensaje)),
          catchError((error) => {
            this._estadoConexion.update((estado) => ({
              ...estado,
              estado: "error",
            }));
            return EMPTY;
          })
        )
        .subscribe();

      // Solicitar datos iniciales
      setTimeout(() => {
        this.enviarComando({ tipo: "obtener_sensores" });
        this.enviarComando({ tipo: "obtener_estadisticas_servidor" });
      }, 1000);
    } catch (error) {
      this._estadoConexion.update((estado) => ({
        ...estado,
        estado: "error",
      }));
    }
  }

  private procesarMensaje(mensaje: any): void {
    try {
      console.log("Mensaje recibido:", mensaje);
      this.mensajesSubject.next(mensaje);

      switch (mensaje.tipo) {
        case "conexion_establecida":
          console.log(`Conexión establecida - Cliente: ${mensaje.clienteId}`);
          break;
        case "lectura_sensor":
          this.procesarLecturaSensor(mensaje.datos);
          break;
        case "error_sensor":
          this.procesarErrorSensor(mensaje.datos);
          break;
        case "lista_sensores":
          this._sensoresDisponibles.set(mensaje.sensores || []);
          break;
        case "estadisticas_servidor":
          this._estadisticasServidor.set(mensaje.datos);
          break;
        default:
          console.warn("Tipo de mensaje no reconocido:", mensaje.tipo);
      }
    } catch (error) {
      console.error("Error procesando mensaje:", error);
    }
  }

  private procesarLecturaSensor(lectura: LecturaSensor): void {
    this._ultimasLecturas.update((lecturas) => {
      const nuevasLecturas = new Map(lecturas);
      nuevasLecturas.set(lectura.sensorId, lectura);
      return nuevasLecturas;
    });

    this.lecturasSubject.next(lectura);
  }

  private procesarErrorSensor(error: ErrorSensor): void {
    this._erroresSensores.update((errores) => [
      ...errores.slice(-9),
      { ...error, timestamp: new Date().toISOString() },
    ]);

    this.erroresSubject.next(error);
  }

  private iniciarPing(): void {
    const pingInterval = setInterval(() => {
      if (this.estaConectado()) {
        const inicio = Date.now();
        this.enviarComando({ tipo: "ping" });

        setTimeout(() => {
          const latencia = Date.now() - inicio;
          this._estadoConexion.update((estado) => ({
            ...estado,
            latencia,
          }));
        }, 50);
      } else {
        clearInterval(pingInterval);
      }
    }, 30000);
  }

  private intentarReconexion(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error("Máximo número de intentos de reconexión alcanzado");
      return;
    }

    this.reconnectAttempts++;
    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);

    console.log(
      `Intentando reconexión ${this.reconnectAttempts}/${this.maxReconnectAttempts} en ${delay} ms`
    );

    this._estadoConexion.update((estado) => ({
      ...estado,
      estado: "conectando",
      intentosReconexion: this.reconnectAttempts,
    }));

    this.reconnectTimer = setTimeout(() => {
      this.cerrarConexion();
      this.iniciarConexion();
    }, delay);
  }

  enviarComando(comando: ComandoWebSocket): void {
    if (this.socket$ && this.estaConectado()) {
      try {
        this.socket$.next(comando);
        console.log("Comando enviado:", comando);
      } catch (error) {
        console.error("Error enviando comando:", error);
      }
    } else {
      console.warn("No se puede enviar comando: WebSocket no conectado");
    }
  }

  cerrarConexion(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
    }

    if (this.socket$) {
      this.socket$.complete();
      this.socket$ = null;
    }

    this._estadoConexion.update((estado) => ({
      ...estado,
      estado: "desconectado",
    }));
  }

  reconectar(): void {
    this.reconnectAttempts = 0;
    this.cerrarConexion();
    setTimeout(() => this.iniciarConexion(), 1000);
  }

  obtenerLecturaSensor(sensorId: string): LecturaSensor | undefined {
    return this._ultimasLecturas().get(sensorId);
  }

  obtenerSensoresPorTipo(tipo: string): SensorBase[] {
    return this._sensoresDisponibles().filter((sensor) => sensor.tipo === tipo);
  }
}
