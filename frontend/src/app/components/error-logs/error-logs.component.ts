import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { WebSocketService } from "src/app/services/websocket.service";

@Component({
  selector: "app-error-logs",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./error-logs.component.html",
  styleUrl: "./error-logs.component.css",
})
export class ErrorLogsComponent {
  private wsService = inject(WebSocketService);

  errores = this.wsService.erroresSensores;

  marcarComoRevisado(error: any) {
    // Usar método público para actualizar errores
    const actuales = this.wsService.erroresSensores();
    // No se puede actualizar directamente, así que delegamos a un método del servicio
    this.wsService.eliminarError(error);
  }
}
