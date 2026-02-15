import {
  createLogger,
  createConsoleHandler,
  type Logger,
} from "@repo/platform-logger";

const logger: Logger = createLogger(
  process.env.NODE_ENV === "production" ? "warn" : "debug",
);

logger.addHandler(createConsoleHandler());

// @SETUP Add production log handlers before deploying
// Uncomment and configure one of these (or add your own):
// logger.addHandler(createSentryHandler());
// logger.addHandler(createDatadogHandler());
// logger.addHandler(createLogflareHandler());

export { logger };
