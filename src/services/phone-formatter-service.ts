
/**
 * Provides services for formatting phone numbers.
 * Standardized phone numbers are in e164 format, eg +13305551234
 * Local phone numbers look like (330)-555-1234
 * 
 * @class PhoneFormatterService
 */
class PhoneFormatterService {

  /**
   * Converts a e164 phone number into a local phone number
   * 
   * @param {string} number - phone number in e164 format
   * @returns {string} phone number in local format
   * @memberof PhoneFormatterService
   */
  standardToLocalFormat(number: string): string {
    if(!this.isValidStandardizedPhoneNumber(number))
      throw new Error(`Invalid e164 phone number: ${number}`);
    
    const matches = /^\+?[1-9]([0-9]{3})([0-9]{3})([0-9]{4})$/.exec(number);
  
    const areaCode = matches[1];
    const prefix = matches[2];
    const lineNumber = matches[3];
  
    return `(${areaCode})-${prefix}-${lineNumber}`;
  }
  
  /**
   * Converts a local phone number to a e164 phone number
   * 
   * @param {string} number - phone number in local format
   * @returns {string} phone number in e164 format
   * @memberof PhoneFormatterService
   */
  localToStandardFormat(number: string): string {
    if(!this.isValidLocalPhoneNumber(number))
      throw new Error(`Invalid local phone number: ${number}`);
    
    const matches = /^\(([0-9]{3})\)-([0-9]{3})-([0-9]{4})$/.exec(number);
  
    const areaCode = matches[1];
    const prefix = matches[2];
    const lineNumber = matches[3];
  
    return `+1${areaCode}${prefix}${lineNumber}`;
  }
  
  /**
   * Checks whether or not a given phone number is local
   * 
   * @param {string} number - phone number
   * @returns {boolean} true if local, false if not
   * @memberof PhoneFormatterService
   */
  isValidLocalPhoneNumber(number: string): boolean {
    if(!number)
      return false;
    return number.replace(/\(|\)|-|_/g, '').length === 10;
  }
  
  /**
   * Checks whether or not a given phone number is in e164 format
   * 
   * @param {string} number - phone number
   * @returns {boolean} true if in e164, false if not
   * @memberof PhoneFormatterService
   */
  isValidStandardizedPhoneNumber(number: string): boolean {
    if(!number)
      return false;
    
    return number.match(/^\+?[1-9]\d{1,14}$/) !== null;
  }
}

export default new PhoneFormatterService();
