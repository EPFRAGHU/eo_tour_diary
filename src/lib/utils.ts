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

export function formatOdishaEstCode(code: string, district?: string): string {
  if (!code) return '';
  const trimmed = code.trim();
  if (isOdishaDistrict(district)) {
    if (trimmed.toUpperCase().startsWith('OR/BBS/') || trimmed.toUpperCase().startsWith('ORBBS/')) {
      return trimmed.toUpperCase();
    }
    if (trimmed.toUpperCase().startsWith('OR/')) {
      return trimmed.toUpperCase().replace(/^OR\//i, 'OR/BBS/');
    }
    if (trimmed.toUpperCase().startsWith('ORBBS')) {
      return `OR/BBS/${trimmed.substring(5).replace(/^\//, '')}`;
    }
    if (!trimmed.includes('/')) {
      return `OR/BBS/${trimmed}`;
    }
  }
  return trimmed;
}
