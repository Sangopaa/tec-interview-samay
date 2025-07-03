import { HttpInterceptorFn } from "@angular/common/http";
import { throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { mapServerError } from "../utils/error-mapper.utils";

export const errorHandlingInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error) => {
      const friendlyMessage =
        error.error instanceof ErrorEvent
          ? `Error del cliente: ${error.error.message}`
          : mapServerError(error.status, error.statusText);

      console.error("HTTP Error", {
        url: req.url,
        method: req.method,
        status: error.status,
        message: friendlyMessage,
        timestamp: new Date().toISOString(),
      });

      const enrichedError = {
        ...error,
        friendlyMessage,
        timestamp: new Date().toISOString(),
      };

      return throwError(() => enrichedError);
    })
  );
};
