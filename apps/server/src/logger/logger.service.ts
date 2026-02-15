import { LoggerService as NestLoggerService } from '@nestjs/common';
import {
  createLogger,
  createConsoleHandler,
  type Logger,
} from '@repo/platform-logger';

const logger: Logger = createLogger(
  process.env.NODE_ENV === 'production' ? 'warn' : 'debug',
);

logger.addHandler(createConsoleHandler());

// Add production handlers here:
// logger.addHandler(createDatadogHandler());
// logger.addHandler(createSentryHandler());

export { logger };

/**
 * NestJS LoggerService adapter that delegates to platform-logger.
 * Pass to NestFactory.create() to route all NestJS internal logs
 * through the same pipeline as application logs.
 */
export class PlatformLoggerService implements NestLoggerService {
  log(message: string, context?: string) {
    logger.info(message, context ? { context } : undefined);
  }

  error(message: string, trace?: string, context?: string) {
    logger.error(message, { context, trace });
  }

  warn(message: string, context?: string) {
    logger.warn(message, context ? { context } : undefined);
  }

  debug(message: string, context?: string) {
    logger.debug(message, context ? { context } : undefined);
  }

  verbose(message: string, context?: string) {
    logger.debug(message, context ? { context, verbose: true } : undefined);
  }
}
