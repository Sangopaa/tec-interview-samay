import { Component, computed, inject } from "@angular/core";
import { WebSocketService } from "src/app/services/websocket.service";

import { HeaderComponent } from "../header/header.component";
import { SensorListComponent } from "../sensor-list/sensor-list.component";

@Component({
  selector: "app-dashboard-component",
  standalone: true,
  imports: [HeaderComponent, SensorListComponent],
  templateUrl: "./dashboard-component.component.html",
  styleUrl: "./dashboard-component.component.css",
})
export class DashboardComponentComponent {
  private wsService = inject(WebSocketService);

  metricas = computed(() => {
    const lecturas = this.wsService.ultimasLecturas();
    const lecturasArray = Array.from(lecturas.values());
    
    const temperaturas = lecturasArray
      .filter((l) => l.sensorId.includes("TEMP") && typeof l.valor === "number")
      .map((l) => l.valor as number);

    const humedades = lecturasArray
      .filter((l) => l.sensorId.includes("HUM") && typeof l.valor === "number")
      .map((l) => l.valor as number);

    return {
      sensoresActivos: this.wsService.sensoresActivos(),
      sensoresConError: this.wsService.sensoresConError(),
      promedioTemperatura:
        temperaturas.length > 0
          ? Math.round(
              (temperaturas.reduce((a, b) => a + b, 0) / temperaturas.length) *
                10
            ) / 10
          : null,
      promedioHumedad:
        humedades.length > 0
          ? Math.round(
              (humedades.reduce((a, b) => a + b, 0) / humedades.length) * 10
            ) / 10
          : null,
    };
  });
}
