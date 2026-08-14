import { logger } from './logger'

export const safeStorage = {
  getItem<T>(key: string, fallback: T, validator?: (data: unknown) => data is T): T {
    if (typeof window === 'undefined') {
      return fallback
    }

    try {
      const raw = window.localStorage.getItem(key)
      if (!raw) {
        return fallback
      }

      const parsed: unknown = JSON.parse(raw)

      // التحقق من صحة بنية البيانات
      if (validator && !validator(parsed)) {
        logger.warn(`Invalid schema detected for key "${key}". Resetting to fallback.`)
        window.localStorage.removeItem(key)
        return fallback
      }

      return parsed as T
    } catch (err) {
      logger.error(`Error reading from localStorage (key: "${key}"). Resetting corrupted data.`, err)
      try {
        window.localStorage.removeItem(key)
      } catch {
        // تجاهل أخطاء التخزين عند الحظر
      }
      return fallback
    }
  },

  setItem<T>(key: string, value: T): boolean {
    if (typeof window === 'undefined') {
      return false
    }

    try {
      const serialized = JSON.stringify(value)
      window.localStorage.setItem(key, serialized)
      return true
    } catch (err) {
      logger.error(`Failed to save data to localStorage (key: "${key}").`, err)
      return false
    }
  },

  removeItem(key: string): void {
    if (typeof window === 'undefined') return
    try {
      window.localStorage.removeItem(key)
    } catch (err) {
      logger.error(`Failed to remove key "${key}" from localStorage.`, err)
    }
  },
}