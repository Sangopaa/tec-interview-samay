import { bootstrapApplication } from "@angular/platform-browser";
import { provideHttpClient } from "@angular/common/http";

import { DashboardComponentComponent } from "./app/components/dashboard-component/dashboard-component.component";
import { ErrorHandlingInterceptor } from "./app/interceptors/error-handling.interceptor";

bootstrapApplication(DashboardComponentComponent, {
  providers: [
    provideHttpClient(),
    {
      provide: "HTTP_INTERCEPTORS",
      useClass: ErrorHandlingInterceptor,
      multi: true,
    },
  ],
}).catch((err) => console.error(err));
