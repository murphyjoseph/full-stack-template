import { describe, it, expect, vi } from "vitest";
import { createLogger, createConsoleHandler, toError } from "./index.js";
import type { LogHandler } from "./index.js";

function createMockHandler(): LogHandler {
  return {
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    fatal: vi.fn(),
  };
}

describe("createLogger", () => {
  it("filters messages below the configured log level", () => {
    const handler = createMockHandler();
    const logger = createLogger("warn");
    logger.addHandler(handler);

    logger.debug("should not appear");
    logger.info("should not appear");
    logger.warn("should appear");
    logger.error(new Error("should appear"));
    logger.fatal(new Error("should appear"));

    expect(handler.debug).not.toHaveBeenCalled();
    expect(handler.info).not.toHaveBeenCalled();
    expect(handler.warn).toHaveBeenCalledOnce();
    expect(handler.error).toHaveBeenCalledOnce();
    expect(handler.fatal).toHaveBeenCalledOnce();
  });

  it("dispatches to multiple handlers", () => {
    const handler1 = createMockHandler();
    const handler2 = createMockHandler();
    const logger = createLogger("debug");
    logger.addHandler(handler1);
    logger.addHandler(handler2);

    logger.info("hello");

    expect(handler1.info).toHaveBeenCalledWith("hello", undefined);
    expect(handler2.info).toHaveBeenCalledWith("hello", undefined);
  });

  it("isolates handler errors — second handler still called if first throws", () => {
    const throwingHandler: LogHandler = {
      debug: () => {
        throw new Error("boom");
      },
      info: () => {
        throw new Error("boom");
      },
      warn: () => {
        throw new Error("boom");
      },
      error: () => {
        throw new Error("boom");
      },
      fatal: () => {
        throw new Error("boom");
      },
    };
    const handler = createMockHandler();
    const logger = createLogger("debug");
    logger.addHandler(throwingHandler);
    logger.addHandler(handler);

    expect(() => logger.info("test")).not.toThrow();
    expect(handler.info).toHaveBeenCalledWith("test", undefined);
  });

  it("forwards metadata to handlers", () => {
    const handler = createMockHandler();
    const logger = createLogger("debug");
    logger.addHandler(handler);

    const meta = { userId: "123", action: "login" };
    logger.info("user logged in", meta);

    expect(handler.info).toHaveBeenCalledWith("user logged in", meta);
  });

  it("only dispatches to handlers added before the log call", () => {
    const handler1 = createMockHandler();
    const handler2 = createMockHandler();
    const logger = createLogger("debug");

    logger.addHandler(handler1);
    logger.info("first");

    logger.addHandler(handler2);
    logger.info("second");

    expect(handler1.info).toHaveBeenCalledTimes(2);
    expect(handler2.info).toHaveBeenCalledTimes(1);
    expect(handler2.info).toHaveBeenCalledWith("second", undefined);
  });

  it("allows debug level to pass all messages", () => {
    const handler = createMockHandler();
    const logger = createLogger("debug");
    logger.addHandler(handler);

    logger.debug("d");
    logger.info("i");
    logger.warn("w");
    logger.error(new Error("e"));
    logger.fatal(new Error("f"));

    expect(handler.debug).toHaveBeenCalledOnce();
    expect(handler.info).toHaveBeenCalledOnce();
    expect(handler.warn).toHaveBeenCalledOnce();
    expect(handler.error).toHaveBeenCalledOnce();
    expect(handler.fatal).toHaveBeenCalledOnce();
  });

  it("defaults to info level when no level specified", () => {
    const handler = createMockHandler();
    const logger = createLogger();
    logger.addHandler(handler);

    logger.debug("should be filtered");
    logger.info("should pass");

    expect(handler.debug).not.toHaveBeenCalled();
    expect(handler.info).toHaveBeenCalledOnce();
  });
});

describe("error normalization", () => {
  it("passes Error instances through to handler", () => {
    const handler = createMockHandler();
    const logger = createLogger("debug");
    logger.addHandler(handler);

    const err = new Error("test error");
    logger.error(err);

    expect(handler.error).toHaveBeenCalledWith(err, undefined);
  });

  it("converts string to Error", () => {
    const handler = createMockHandler();
    const logger = createLogger("debug");
    logger.addHandler(handler);

    logger.error("string error");

    const received = (handler.error as ReturnType<typeof vi.fn>).mock
      .calls[0][0];
    expect(received).toBeInstanceOf(Error);
    expect(received.message).toBe("string error");
  });

  it("converts object to Error with JSON message", () => {
    const handler = createMockHandler();
    const logger = createLogger("debug");
    logger.addHandler(handler);

    logger.error({ code: 404, reason: "not found" });

    const received = (handler.error as ReturnType<typeof vi.fn>).mock
      .calls[0][0];
    expect(received).toBeInstanceOf(Error);
    expect(received.message).toBe('{"code":404,"reason":"not found"}');
  });

  it("handles circular references gracefully", () => {
    const handler = createMockHandler();
    const logger = createLogger("debug");
    logger.addHandler(handler);

    const circular: Record<string, unknown> = {};
    circular.self = circular;
    logger.error(circular);

    const received = (handler.error as ReturnType<typeof vi.fn>).mock
      .calls[0][0];
    expect(received).toBeInstanceOf(Error);
  });
});

describe("toError", () => {
  it("returns the same Error if given an Error", () => {
    const err = new Error("original");
    expect(toError(err)).toBe(err);
  });

  it("wraps a string in an Error", () => {
    const result = toError("oops");
    expect(result).toBeInstanceOf(Error);
    expect(result.message).toBe("oops");
  });

  it("JSON-stringifies objects", () => {
    const result = toError({ a: 1 });
    expect(result.message).toBe('{"a":1}');
  });

  it("falls back to String() for non-serializable values", () => {
    const result = toError(42);
    expect(result.message).toBe("42");
  });
});

describe("createConsoleHandler", () => {
  it("calls the correct console methods", () => {
    const debugSpy = vi.spyOn(console, "debug").mockImplementation(() => {});
    const infoSpy = vi.spyOn(console, "info").mockImplementation(() => {});
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const handler = createConsoleHandler();

    handler.debug("d");
    handler.info("i");
    handler.warn("w");
    handler.error(new Error("e"));
    handler.fatal(new Error("f"));

    expect(debugSpy).toHaveBeenCalledWith("[DEBUG]", "d", "");
    expect(infoSpy).toHaveBeenCalledWith("[INFO]", "i", "");
    expect(warnSpy).toHaveBeenCalledWith("[WARN]", "w", "");
    expect(errorSpy).toHaveBeenCalledWith("[ERROR]", expect.any(Error), "");
    expect(errorSpy).toHaveBeenCalledWith("[FATAL]", expect.any(Error), "");

    debugSpy.mockRestore();
    infoSpy.mockRestore();
    warnSpy.mockRestore();
    errorSpy.mockRestore();
  });

  it("passes metadata when provided", () => {
    const infoSpy = vi.spyOn(console, "info").mockImplementation(() => {});
    const handler = createConsoleHandler();

    const meta = { key: "value" };
    handler.info("msg", meta);

    expect(infoSpy).toHaveBeenCalledWith("[INFO]", "msg", meta);

    infoSpy.mockRestore();
  });
});

describe("destructured usage", () => {
  it("works without this binding", () => {
    const handler = createMockHandler();
    const logger = createLogger("debug");
    logger.addHandler(handler);

    const { info, error } = logger;
    expect(() => {
      info("works");
      error("also works");
    }).not.toThrow();

    expect(handler.info).toHaveBeenCalledWith("works", undefined);
    expect(handler.error).toHaveBeenCalledOnce();
  });
});
