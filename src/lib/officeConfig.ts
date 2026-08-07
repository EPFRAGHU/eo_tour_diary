/**
 * Centralized EPFO Office Master & System Configuration Store
 * Configures "EPFO, DO, Cuttack" as the primary system-wide default office.
 */

export interface OfficeMaster {
  id: string;
  officeCode: string;
  officeName: string;
  region: string;
  district: string;
  state: string;
  address: string;
  phone: string;
  email: string;
  status: 'ACTIVE' | 'INACTIVE';
  isDefault: boolean;
}

const OFFICE_MASTER_KEY = 'epfo_office_master_list';
const DEFAULT_OFFICE_ID_KEY = 'epfo_default_office_id';

export const INITIAL_OFFICE_MASTER: OfficeMaster[] = [
  {
    id: 'off-ctc-01',
    officeCode: 'DO_CTC',
    officeName: 'EPFO, DO, Cuttack',
    region: 'Odisha Zone',
    district: 'Cuttack',
    state: 'Odisha',
    address: 'District Office, Sector 1, CDA Market Complex, Cuttack, Odisha 753014',
    phone: '+91 671 2304567 / +91 94370 12345',
    email: 'do.cuttack@epfindia.gov.in',
    status: 'ACTIVE',
    isDefault: true,
  },
  {
    id: 'off-bbs-02',
    officeCode: 'RO_BBS',
    officeName: 'EPFO Regional Office, Bhubaneswar',
    region: 'Odisha Zone',
    district: 'Khurda',
    state: 'Odisha',
    address: 'Bhavishya Nidhi Bhawan, Unit-IX, Janpath, Bhubaneswar 751022',
    phone: '+91 674 2541234',
    email: 'ro.bhubaneswar@epfindia.gov.in',
    status: 'ACTIVE',
    isDefault: false,
  },
  {
    id: 'off-rkl-03',
    officeCode: 'RO_RKL',
    officeName: 'EPFO Regional Office, Rourkela',
    region: 'Odisha Zone',
    district: 'Sundargarh',
    state: 'Odisha',
    address: 'Sector 5, Rourkela, Sundargarh, Odisha 769002',
    phone: '+91 661 2401890',
    email: 'ro.rourkela@epfindia.gov.in',
    status: 'ACTIVE',
    isDefault: false,
  },
  {
    id: 'off-ber-04',
    officeCode: 'DO_BER',
    officeName: 'EPFO District Office, Berhampur',
    region: 'Odisha Zone',
    district: 'Ganjam',
    state: 'Odisha',
    address: 'Courtpeta, Berhampur, Ganjam, Odisha 760004',
    phone: '+91 680 2223344',
    email: 'do.berhampur@epfindia.gov.in',
    status: 'ACTIVE',
    isDefault: false,
  },
];

/**
 * Retrieves the full list of available EPFO Offices.
 */
export const getOfficeList = (): OfficeMaster[] => {
  if (typeof window === 'undefined') return INITIAL_OFFICE_MASTER;
  const raw = localStorage.getItem(OFFICE_MASTER_KEY);
  if (!raw) {
    localStorage.setItem(OFFICE_MASTER_KEY, JSON.stringify(INITIAL_OFFICE_MASTER));
    return INITIAL_OFFICE_MASTER;
  }
  try {
    return JSON.parse(raw);
  } catch (e) {
    return INITIAL_OFFICE_MASTER;
  }
};

/**
 * Retrieves the currently active Default Office (defaults to "EPFO, DO, Cuttack").
 */
export const getDefaultOffice = (): OfficeMaster => {
  const offices = getOfficeList();
  const defaultFromList = offices.find((o) => o.isDefault) || offices[0];

  if (typeof window === 'undefined') return defaultFromList;

  const savedDefaultId = localStorage.getItem(DEFAULT_OFFICE_ID_KEY);
  if (savedDefaultId) {
    const match = offices.find((o) => o.id === savedDefaultId);
    if (match) return match;
  }

  return defaultFromList;
};

/**
 * Updates the active Default Office in system settings and persists it dynamically.
 */
export const setDefaultOffice = (officeId: string): void => {
  if (typeof window === 'undefined') return;
  const offices = getOfficeList();
  const updated = offices.map((o) => ({
    ...o,
    isDefault: o.id === officeId,
  }));
  localStorage.setItem(OFFICE_MASTER_KEY, JSON.stringify(updated));
  localStorage.setItem(DEFAULT_OFFICE_ID_KEY, officeId);
};

/**
 * Helper to get default office name string directly.
 */
export const getDefaultOfficeName = (): string => {
  return getDefaultOffice().officeName;
};
