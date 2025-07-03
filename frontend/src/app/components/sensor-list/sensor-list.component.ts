import { Component, inject, signal, computed } from "@angular/core";
import { WebSocketService } from "src/app/services/websocket.service";
import { SensorBase, SensorConLectura, EstadoSensor } from "src/app/types/sensor.types";
import { SensorDetailComponent } from "../sensor-detail/sensor-detail.component";

@Component({
  selector: "app-sensor-list",
  standalone: true,
  imports: [SensorDetailComponent],
  templateUrl: "./sensor-list.component.html",
  styleUrl: "./sensor-list.component.css",
})
export class SensorListComponent {
  sensores = inject(WebSocketService);

  filtro = signal('');
  filtroEstado = signal<EstadoSensor | ''>('');

  sensoresConLecturas = computed(() => {
    const sensores = this.sensores.sensoresDisponibles();
    const lecturas = this.sensores.ultimasLecturas();
    const filtro = this.filtro().toLowerCase();
    const filtroEstado = this.filtroEstado();
    return sensores
      .map((sensor) => {
        const ultimaLectura = lecturas.get(sensor.id);

        return {
          ...sensor,
          ultimaLectura,
          estaActivo: !!ultimaLectura && ultimaLectura.estado !== "offline",
        } as SensorConLectura;
      })
      .filter(sensor =>
        sensor.nombre.toLowerCase().includes(filtro)
        && (filtroEstado === '' || (sensor.ultimaLectura && sensor.ultimaLectura.estado === filtroEstado))
      );
  });

  selectedSensor = signal<SensorBase | null>(null);

  seleccionar(sensor: SensorBase) {
    this.selectedSensor.set(sensor);
  }

  estados: { value: EstadoSensor | '', label: string }[] = [
    { value: '', label: 'Todos' },
    { value: 'normal', label: 'Normal' },
    { value: 'advertencia', label: 'Advertencia' },
    { value: 'error', label: 'Error' },
    { value: 'offline', label: 'Offline' },
  ];
}
