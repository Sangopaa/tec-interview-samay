import { Component, Input } from "@angular/core";
import { SensorConLectura } from "src/app/types/sensor.types";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-sensor-detail",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./sensor-detail.component.html",
  styleUrl: "./sensor-detail.component.css",
})
export class SensorDetailComponent {
  @Input() sensor!: SensorConLectura;

  formatTimestamp(timestamp: string): string {
    return new Date(timestamp).toLocaleString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  getBatteryColor(level: number): string {
    if (level > 60) return "text-green-600";
    if (level > 30) return "text-yellow-600";
    return "text-red-600";
  }

  getSignalColor(strength: number): string {
    if (strength > 70) return "text-green-600";
    if (strength > 40) return "text-yellow-600";
    return "text-red-600";
  }

  getStatusColor(estado: string): string {
    return estado === "normal" ? "text-green-600" : "text-red-600";
  }
}
