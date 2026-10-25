export function normalizePhone(phone: string): string {
  if (!phone) {
    return '';
  }

  let value = phone.trim();

  // Remove spaces, hyphens and brackets
  value = value.replace(/[\s\-().]/g, '');

  // Convert 00 international format to +
  if (value.startsWith('00')) {
    value = '+' + value.substring(2);
  }

  // Tanzania example:
  // 0712345678 -> +255712345678
  if (value.startsWith('0') && value.length === 10) {
    value = '+255' + value.substring(1);
  }

  // Tanzania number without +
  // 255712345678 -> +255712345678
  if (value.startsWith('255') && !value.startsWith('+')) {
    value = '+' + value;
  }

  return value;
}