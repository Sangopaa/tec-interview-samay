import { bootstrapApplication } from "@angular/platform-browser";
import { provideHttpClient, withInterceptors } from "@angular/common/http";

import { DashboardComponentComponent } from "./app/components/dashboard-component/dashboard-component.component";

import { errorHandlingInterceptor } from "./app/interceptors/error-handling.interceptor";
import { LoggingInterceptor } from "./app/interceptors/logging.interceptor";

bootstrapApplication(DashboardComponentComponent, {
  providers: [
    provideHttpClient(
      withInterceptors([LoggingInterceptor, errorHandlingInterceptor])
    ),
  ],
}).catch((err) => console.error("Error iniciando aplicación:", err));
