// --- Types ---

export type LogLevel = "debug" | "info" | "warn" | "error" | "fatal";

export type LogMetadata = Record<string, unknown>;

export interface LogHandler {
  debug(message: string, meta?: LogMetadata): void;
  info(message: string, meta?: LogMetadata): void;
  warn(message: string, meta?: LogMetadata): void;
  error(error: Error, meta?: LogMetadata): void;
  fatal(error: Error, meta?: LogMetadata): void;
}

export interface Logger {
  debug(message: string, meta?: LogMetadata): void;
  info(message: string, meta?: LogMetadata): void;
  warn(message: string, meta?: LogMetadata): void;
  error(error: unknown, meta?: LogMetadata): void;
  fatal(error: unknown, meta?: LogMetadata): void;
  addHandler(handler: LogHandler): void;
}

// --- Error normalization ---

export function toError(value: unknown): Error {
  if (value instanceof Error) return value;
  if (typeof value === "string") return new Error(value);
  try {
    return new Error(JSON.stringify(value));
  } catch {
    return new Error(String(value));
  }
}

// --- Log level filtering ---

const LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
  fatal: 4,
};

// --- Logger factory ---

export function createLogger(level: LogLevel = "info"): Logger {
  const handlers: LogHandler[] = [];
  const threshold = LEVELS[level];

  function dispatch(
    method: LogLevel,
    msgOrError: string | Error,
    meta?: LogMetadata
  ): void {
    if (LEVELS[method] < threshold) return;
    for (const handler of handlers) {
      try {
        handler[method](msgOrError as never, meta);
      } catch {
        // Handler errors must never propagate. Silently swallowed by design.
      }
    }
  }

  return {
    debug: (message, meta?) => dispatch("debug", message, meta),
    info: (message, meta?) => dispatch("info", message, meta),
    warn: (message, meta?) => dispatch("warn", message, meta),
    error: (error, meta?) => dispatch("error", toError(error), meta),
    fatal: (error, meta?) => dispatch("fatal", toError(error), meta),
    addHandler: (handler) => {
      handlers.push(handler);
    },
  };
}

// --- Built-in console handler ---

export function createConsoleHandler(): LogHandler {
  return {
    debug: (message, meta?) => console.debug("[DEBUG]", message, meta ?? ""),
    info: (message, meta?) => console.info("[INFO]", message, meta ?? ""),
    warn: (message, meta?) => console.warn("[WARN]", message, meta ?? ""),
    error: (error, meta?) => console.error("[ERROR]", error, meta ?? ""),
    fatal: (error, meta?) => console.error("[FATAL]", error, meta ?? ""),
  };
}
