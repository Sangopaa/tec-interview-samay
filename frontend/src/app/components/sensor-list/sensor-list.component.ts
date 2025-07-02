import { Component, inject, signal } from "@angular/core";
import { WebSocketService } from "src/app/services/websocket.service";
import { SensorBase } from "src/app/types/sensor.types";
import { SensorDetailComponent } from "../sensor-detail/sensor-detail.component";

@Component({
  selector: "app-sensor-list",
  standalone: true,
  imports: [SensorDetailComponent],
  templateUrl: "./sensor-list.component.html",
  styleUrl: "./sensor-list.component.css",
})
export class SensorListComponent {
  sensores = inject(WebSocketService).sensoresDisponibles;
  selectedSensor = signal<SensorBase | null>(null);

  seleccionar(sensor: SensorBase) {
    this.selectedSensor.set(sensor);
  }
}
