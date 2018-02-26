
/**
 * Provides logging services
 * 
 * @class LoggingService
 */
class LoggingService {

  /**
   * Logs errors to the server 
   * 
   * @param {Error} err 
   * @memberof LoggingService
   */
  logError(err: Error) {
    // In a real application, this would send a post request to the server to log this error
  }
}

export default new LoggingService();
