const mockLogger = vi.hoisted(() => ({
  info: vi.fn(),
  error: vi.fn(),
  warn: vi.fn(),
  debug: vi.fn(),
  addHandler: vi.fn(),
}));

vi.mock('@repo/platform-logger', () => ({
  createLogger: () => mockLogger,
  createConsoleHandler: () => ({}),
}));

import { PlatformLoggerService } from './logger.service';

describe('PlatformLoggerService', () => {
  let service: PlatformLoggerService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new PlatformLoggerService();
  });

  describe('log', () => {
    it('calls logger.info with message and context', () => {
      service.log('hello', 'TestContext');
      expect(mockLogger.info).toHaveBeenCalledWith('hello', { context: 'TestContext' });
    });

    it('calls logger.info without metadata when context is omitted', () => {
      service.log('hello');
      expect(mockLogger.info).toHaveBeenCalledWith('hello', undefined);
    });
  });

  describe('error', () => {
    it('calls logger.error with message, trace, and context', () => {
      service.error('fail', 'stack-trace', 'ErrCtx');
      expect(mockLogger.error).toHaveBeenCalledWith('fail', {
        context: 'ErrCtx',
        trace: 'stack-trace',
      });
    });

    it('calls logger.error with undefined trace and context when omitted', () => {
      service.error('fail');
      expect(mockLogger.error).toHaveBeenCalledWith('fail', {
        context: undefined,
        trace: undefined,
      });
    });
  });

  describe('warn', () => {
    it('calls logger.warn with message and context', () => {
      service.warn('careful', 'WarnCtx');
      expect(mockLogger.warn).toHaveBeenCalledWith('careful', { context: 'WarnCtx' });
    });

    it('calls logger.warn without metadata when context is omitted', () => {
      service.warn('careful');
      expect(mockLogger.warn).toHaveBeenCalledWith('careful', undefined);
    });
  });

  describe('debug', () => {
    it('calls logger.debug with message and context', () => {
      service.debug('dbg', 'DbgCtx');
      expect(mockLogger.debug).toHaveBeenCalledWith('dbg', { context: 'DbgCtx' });
    });

    it('calls logger.debug without metadata when context is omitted', () => {
      service.debug('dbg');
      expect(mockLogger.debug).toHaveBeenCalledWith('dbg', undefined);
    });
  });

  describe('verbose', () => {
    it('calls logger.debug with verbose flag and context', () => {
      service.verbose('detail', 'VerbCtx');
      expect(mockLogger.debug).toHaveBeenCalledWith('detail', {
        context: 'VerbCtx',
        verbose: true,
      });
    });

    it('calls logger.debug without metadata when context is omitted', () => {
      service.verbose('detail');
      expect(mockLogger.debug).toHaveBeenCalledWith('detail', undefined);
    });
  });
});
