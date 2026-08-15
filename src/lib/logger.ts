type LogLevel = 'info' | 'warn' | 'error' | 'debug'

class AppLogger {
  private formatMessage(level: LogLevel, message: string): string {
    const timestamp = new Date().toISOString()
    return `[${timestamp}] [${level.toUpperCase()}]: ${message}`
  }

  private print(
    method: 'info' | 'warn' | 'error' | 'debug',
    level: LogLevel,
    message: string,
    extra?: unknown
  ): void {
    const formatted = this.formatMessage(level, message)
    if (extra !== undefined) {
      console[method](formatted, extra)
    } else {
      console[method](formatted)
    }
  }

  debug(message: string, context?: unknown): void {
    if (process.env.NODE_ENV === 'development') {
      this.print('debug', 'debug', message, context)
    }
  }

  info(message: string, context?: unknown): void {
    if (process.env.NODE_ENV !== 'production') {
      this.print('info', 'info', message, context)
    }
  }

  warn(message: string, context?: unknown): void {
    this.print('warn', 'warn', message, context)
  }

  error(message: string, error?: unknown): void {
    let errorDetails = error

    // استخراج معلومات الخطأ التفصيلية إذا كان Error Object
    if (error instanceof Error) {
      errorDetails = {
        name: error.name,
        message: error.message,
        stack: error.stack,
      }
    }

    this.print('error', 'error', message, errorDetails)

    // نقطة تكامل مستقبلية لخدمات تتبع الأخطاء السحابية (مثل Sentry أو Logflare):
    // if (process.env.NODE_ENV === 'production') {
    //   Sentry.captureException(error || new Error(message))
    // }
  }
}

export const logger = new AppLogger()