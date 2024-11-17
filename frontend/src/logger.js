import { createLogger } from 'vue-logger-plugin'
import { isDevMode } from './utils'

const isDevelopmentMode = isDevMode()
const logger = createLogger({
    enabled: true,
    consoleEnabled: isDevelopmentMode,
    level: isDevelopmentMode ? 'debug' : 'error'
})

export default logger