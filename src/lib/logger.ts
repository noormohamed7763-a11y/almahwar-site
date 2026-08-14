type LogLevel = 'info' | 'warn' | 'error'

class AppLogger {
  private formatMessage(level: LogLevel, message: string): string {
    const timestamp = new Date().toISOString()
    return `[${timestamp}] [${level.toUpperCase()}]: ${message}`
  }

  info(message: string, context?: unknown): void {
    if (process.env.NODE_ENV !== 'production') {
      console.info(this.formatMessage('info', message), context ?? '')
    }
  }

  warn(message: string, context?: unknown): void {
    console.warn(this.formatMessage('warn', message), context ?? '')
  }

  error(message: string, error?: unknown): void {
    console.error(this.formatMessage('error', message), error ?? '')
    // جاهز للربط مستقبلاً مع خدمات المراقبة السحابية (مثل Sentry)
  }
}

export const logger = new AppLogger()