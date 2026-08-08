import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export const ODISHA_DISTRICTS = [
  'Angul', 'Balangir', 'Balasore', 'Baleswar', 'Bargarh', 'Bhadrak', 'Boudh', 'Cuttack',
  'Deogarh', 'Dhenkanal', 'Gajapati', 'Ganjam', 'Jagatsinghpur', 'Jajpur', 'Jharsuguda',
  'Kalahandi', 'Kandhamal', 'Kendrapara', 'Kendujhar', 'Keonjhar', 'Khordha', 'Khurda',
  'Koraput', 'Malkangiri', 'Mayurbhanj', 'Nabarangpur', 'Nayagarh', 'Nuapada', 'Puri',
  'Rayagada', 'Sambalpur', 'Subarnapur', 'Sonepur', 'Sundargarh'
];

export function isOdishaDistrict(district?: string): boolean {
  if (!district) return true; // default in portal
  const normalized = district.trim().toLowerCase();
  return ODISHA_DISTRICTS.some(d => normalized.includes(d.toLowerCase()));
}

export function formatOdishaEstCode(code: string, _district?: string): string {
  if (!code || !code.trim()) return 'OR/BBS/0000000/000';
  let cleaned = code.trim().toUpperCase();

  // Strip existing prefix if present
  cleaned = cleaned.replace(/^OR\/BBS\//i, '').replace(/^ORBBS\//i, '').replace(/^OR\//i, '').replace(/^ORBBS/i, '');

  const parts = cleaned.split('/').map((p) => p.trim());
  let mainPart = parts[0] || '0000000';
  let extPart = parts.length > 1 ? parts[1] : '000';

  // Format main establishment ID (padded to 7 digits)
  if (/^\d+$/.test(mainPart)) {
    mainPart = mainPart.padStart(7, '0');
  } else if (!mainPart) {
    mainPart = '0000000';
  }

  // Format extension / sub-code (padded to 3 digits)
  if (/^\d+$/.test(extPart)) {
    extPart = extPart.padStart(3, '0');
  } else if (!extPart) {
    extPart = '000';
  }

  return `OR/BBS/${mainPart}/${extPart}`;
}
