import { HttpInterceptorFn } from "@angular/common/http";
import { throwError } from "rxjs";
import { catchError, finalize, tap } from "rxjs/operators";
import { LoggingService } from "../services/logging.service";
import { generateRequestId } from "../utils/request-id.utils";

export const LoggingInterceptor: HttpInterceptorFn = (req, next) => {
  const logger = new LoggingService();
  const start = Date.now();

  logger.log(`🚀 HTTP ${req.method} ${req.url}`);

  const requestWithHeaders = req.clone({
    setHeaders: {
      "X-App-Version": "1.0.0",
      "X-Client-Type": "IoT Dashboard",
      "X-Request-ID": generateRequestId(),
    },
  });

  return next(requestWithHeaders).pipe(
    tap(() => {
      const duration = Date.now() - start;
      logger.log(`✅ HTTP ${req.method} ${req.url} - ${duration}ms`);
    }),
    catchError((error) => {
      const duration = Date.now() - start;
      logger.log(
        `❌ HTTP ${req.method} ${req.url} - ${duration}ms - Error: ${error.status} ${error.statusText}`,
        "error"
      );

      if (error.status === 0) {
        logger.log("🔌 Conectividad perdida", "warn");
      } else if (error.status >= 500) {
        logger.log("🔥 Error del servidor", "error");
      } else if (error.status === 401) {
        logger.log("🔐 Token expirado", "warn");
      } else if (error.status === 403) {
        logger.log("🚫 Acceso denegado", "warn");
      }

      return throwError(() => error);
    }),
    finalize(() => {})
  );
};
