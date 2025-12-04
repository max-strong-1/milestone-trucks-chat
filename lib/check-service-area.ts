import SERVICED_ZIP_CODES from './service-area-zips';

export function checkServiceArea(zipCode: string): boolean {
  // Clean the ZIP code (remove spaces, dashes, etc.)
  const cleanZip = zipCode.trim().split('-')[0];
  return SERVICED_ZIP_CODES.includes(cleanZip);
}
