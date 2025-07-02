import { Component, Input } from "@angular/core";
import { SensorBase } from "src/app/types/sensor.types";

@Component({
  selector: "app-sensor-detail",
  standalone: true,
  imports: [],
  templateUrl: "./sensor-detail.component.html",
  styleUrl: "./sensor-detail.component.css",
})
export class SensorDetailComponent {
  @Input({ required: true }) sensor!: SensorBase;
}
