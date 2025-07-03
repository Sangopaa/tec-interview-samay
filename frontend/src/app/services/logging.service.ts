export class LoggingService {
  private logs: string[] = [];

  log(message: string, level: "info" | "warn" | "error" = "info"): void {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    this.logs.push(logEntry);
    if (this.logs.length > 100) {
      this.logs = this.logs.slice(-100);
    }

    const output = {
      info: console.log,
      warn: console.warn,
      error: console.error,
    }[level];

    output(logEntry);
  }

  getLogs(): string[] {
    return [...this.logs];
  }

  clear(): void {
    this.logs = [];
  }
}
