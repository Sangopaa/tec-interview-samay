import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";

// Simula un servicio de logging
@Injectable({ providedIn: "root" })
export class LoggingService {
  log(errorInfo: any): void {
    console.error("[Error Log]", errorInfo);
  }
}

interface ErrorCategory {
  type: "network" | "server" | "client" | "timeout";
  severity: "low" | "medium" | "high" | "critical";
  retryable: boolean;
  userMessage: string;
  technicalMessage: string;
}

@Injectable()
export class ErrorHandlingInterceptor implements HttpInterceptor {
  constructor(private logger: LoggingService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const startTime = Date.now();

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        const errorCategory = this.categorizeError(error);
        const errorId = this.generateErrorId();

        this.logger.log({
          id: errorId,
          timestamp: new Date().toISOString(),
          method: req.method,
          url: req.urlWithParams,
          headers: req.headers,
          error: error,
          category: errorCategory,
          durationMs: Date.now() - startTime,
          userContext: this.getUserContext(),
        });

        alert(errorCategory.userMessage);

        return throwError(() => error);
      })
    );
  }

  private categorizeError(error: HttpErrorResponse): ErrorCategory {
    if (error.status === 0) {
      return {
        type: "network",
        severity: "high",
        retryable: true,
        userMessage: "Sin conexión a internet",
        technicalMessage: "No response received from server",
      };
    }

    if (error.status >= 500) {
      return {
        type: "server",
        severity: "critical",
        retryable: false,
        userMessage: "Error interno del servidor",
        technicalMessage: error.message,
      };
    }

    if (error.status === 401) {
      return {
        type: "client",
        severity: "medium",
        retryable: false,
        userMessage: "Sesión expirada, por favor inicia sesión",
        technicalMessage: "Unauthorized",
      };
    }

    if (error.status === 403) {
      return {
        type: "client",
        severity: "medium",
        retryable: false,
        userMessage: "No tienes permisos para esta acción",
        technicalMessage: "Forbidden",
      };
    }

    if (error.status === 404) {
      return {
        type: "client",
        severity: "low",
        retryable: false,
        userMessage: "Recurso no encontrado",
        technicalMessage: "Not Found",
      };
    }

    return {
      type: "client",
      severity: "low",
      retryable: false,
      userMessage: "Error inesperado, intenta de nuevo",
      technicalMessage: error.message,
    };
  }

  private generateErrorId(): string {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
  }

  private getUserContext(): any {
    // Reemplaza esto con info real (servicio de auth, session, etc.)
    return {
      userId: "123456",
      sessionId: "abcde",
    };
  }
}
