
export function standardToLocalFormat(number: string): string {
  if(!isValidStandardizedPhoneNumber(number))
    throw new Error(`Invalid e164 phone number: ${number}`);
  
  const matches = /^\+?[1-9]([0-9]{3})([0-9]{3})([0-9]{4})$/.exec(number);

  const areaCode = matches[1];
  const prefix = matches[2];
  const lineNumber = matches[3];

  return `(${areaCode})-${prefix}-${lineNumber}`;
}

export function localToStandardFormat(number: string): string {
  if(!isValidLocalPhoneNumber(number))
    throw new Error(`Invalid local phone number: ${number}`);
  
  const matches = /^\(([0-9]{3})\)-([0-9]{3})-([0-9]{4})$/.exec(number);

  const areaCode = matches[1];
  const prefix = matches[2];
  const lineNumber = matches[3];

  return `+1${areaCode}${prefix}${lineNumber}`;
}

export function isValidLocalPhoneNumber(number: string): boolean {
  if(!number)
    return false;
  return number.replace(/\(|\)|-|_/g, '').length === 10;
}

export function isValidStandardizedPhoneNumber(number: string): boolean {
  if(!number)
    return false;
  
  return number.match(/^\+?[1-9]\d{1,14}$/) !== null;
}