import { Component, inject, signal, computed } from "@angular/core";
import { WebSocketService } from "src/app/services/websocket.service";
import { SensorBase, SensorConLectura } from "src/app/types/sensor.types";
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

  sensoresConLecturas = computed(() => {
    const sensores = this.sensores.sensoresDisponibles();
    const lecturas = this.sensores.ultimasLecturas();

    return sensores.map((sensor) => {
      const ultimaLectura = lecturas.get(sensor.id);

      return {
        ...sensor,
        ultimaLectura,
        estaActivo: !!ultimaLectura && ultimaLectura.estado !== "offline",
      } as SensorConLectura;
    });
  });

  selectedSensor = signal<SensorBase | null>(null);

  seleccionar(sensor: SensorBase) {
    this.selectedSensor.set(sensor);
  }
}
