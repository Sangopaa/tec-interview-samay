import { Component, inject } from "@angular/core";
import { WebSocketService } from "src/app/services/websocket.service";

@Component({
  selector: "app-header",
  standalone: true,
  imports: [],
  templateUrl: "./header.component.html",
  styleUrl: "./header.component.css",
})
export class HeaderComponent {
  private wsService = inject(WebSocketService);

  estadoConexion = this.wsService.estadoConexion;

  reconectar() {
    this.wsService.reconectar();
  }

  formatTime(dateValue: string | Date | undefined): string {
    if (!dateValue) return "";
    const date =
      typeof dateValue === "string" ? new Date(dateValue) : dateValue;
    return date.toLocaleTimeString();
  }
}
