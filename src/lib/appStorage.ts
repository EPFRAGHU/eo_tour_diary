import { EstablishmentDTO, TourProgramItem, InspectionLogItem, ClaimItem, DocumentRecord } from '@/types';
import { logUserActivity, DEFAULT_SUPER_ADMIN } from './userStorage';

const ESTABLISHMENTS_KEY = 'epfo_live_establishments';
const TOURS_KEY = 'epfo_live_tours';
const INSPECTIONS_KEY = 'epfo_live_inspections';
const CLAIMS_KEY = 'epfo_live_claims';
const DOCUMENTS_KEY = 'epfo_live_documents';

// Default initial state: In live clean mode, all start EMPTY [] unless user loads demo data or adds records.
export const SAMPLE_ESTABLISHMENTS: EstablishmentDTO[] = [
  {
    id: 'est-1',
    establishmentCode: 'OR/BBS/0006276/000',
    name: 'M/s Jindal Stainless Steel Ltd',
    location: 'Danagadi, Jajpur',
    district: 'Jajpur',
    coverageStatus: 'COVERED',
    industryType: 'Manufacturing / Metallurgy',
  },
  {
    id: 'est-2',
    establishmentCode: 'OR/BBS/0001238/000',
    name: 'M/s Bhimtanagar Sukinda Chromite Mines',
    location: 'Sukinda, Jajpur',
    district: 'Jajpur',
    coverageStatus: 'EXEMPTED',
    industryType: 'Mining & Extraction',
  },
  {
    id: 'est-3',
    establishmentCode: 'OR/BBS/0005077/000',
    name: 'M/s NTPC Kanhia Thermal Power Plant',
    location: 'Kanhia, Angul',
    district: 'Angul',
    coverageStatus: 'COVERED',
    industryType: 'Power Generation',
  },
  {
    id: 'est-4',
    establishmentCode: 'OR/BBS/0016917/024',
    name: 'M/s Executive Engineer, Mahanadi South Division',
    location: 'Cuttack',
    district: 'Cuttack',
    coverageStatus: 'GOVT_UNDERTAKING',
    industryType: 'Public Works / Irrigation',
  },
  {
    id: 'est-5',
    establishmentCode: 'OR/BBS/0045231/000',
    name: 'Apex Logistics & Freight India Pvt Ltd',
    location: 'Choudwar Industrial Area, Cuttack',
    district: 'Cuttack',
    coverageStatus: 'COVERED',
    industryType: 'Logistics & Supply Chain',
  },
];

export const SAMPLE_TOURS: TourProgramItem[] = [
  {
    id: 'tour-1',
    officerId: 'usr-super-admin-1',
    month: 8,
    year: 2026,
    title: 'Monsoon Compliance Drive & 7A Quasi-Judicial Inquiries',
    purpose: 'Verification of 14B damages defaults & un-enrolled contract worker verification across Jajpur industrial cluster.',
    startDate: '2026-08-10',
    endDate: '2026-08-28',
    status: 'APPROVED',
    remarks: 'APFC approved for 8 major establishment visits',
    inspectionsCount: 4,
    createdAt: '2026-08-01',
  },
];

export const SAMPLE_INSPECTIONS: InspectionLogItem[] = [
  {
    id: 'insp-1',
    tourId: 'tour-1',
    date: '2026-08-12',
    establishmentCode: 'OR/BBS/0006276/000',
    establishmentName: 'M/s Jindal Stainless Steel Ltd',
    location: 'Danagadi, Jajpur',
    inspectionPurpose: 'PMVBRY Campaigning & Verification',
    observations: 'Inspected 14B damages compliance and conducted labor code awareness camp.',
    status: 'CONDUCTED',
    distanceKm: 42,
  },
];

export const SAMPLE_CLAIMS: ClaimItem[] = [
  {
    id: 'claim-1',
    tourId: 'tour-1',
    tourTitle: 'Special Compliance Drive - Jajpur Industrial Cluster',
    officerId: 'usr-super-admin-1',
    totalAmount: 3450,
    taAmount: 1200,
    daAmount: 1500,
    hotelAmount: 750,
    otherAmount: 0,
    status: 'SUBMITTED',
    remarks: 'Taxi vouchers & DA rate per grade IV attached.',
    createdAt: '2026-08-06',
  },
];

// Establishments Storage
export function getLiveEstablishments(): EstablishmentDTO[] {
  try {
    const data = localStorage.getItem(ESTABLISHMENTS_KEY);
    if (!data) return [];
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export function saveLiveEstablishments(list: EstablishmentDTO[]): void {
  try {
    localStorage.setItem(ESTABLISHMENTS_KEY, JSON.stringify(list));
  } catch (e) {
    console.error('Failed to save establishments', e);
  }
}

// Tours Storage
export function getLiveTours(): TourProgramItem[] {
  try {
    const data = localStorage.getItem(TOURS_KEY);
    if (!data) return [];
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export function saveLiveTours(list: TourProgramItem[]): void {
  try {
    localStorage.setItem(TOURS_KEY, JSON.stringify(list));
  } catch (e) {
    console.error('Failed to save tours', e);
  }
}

// Inspections Storage
export function getLiveInspections(): InspectionLogItem[] {
  try {
    const data = localStorage.getItem(INSPECTIONS_KEY);
    if (!data) return [];
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export function saveLiveInspections(list: InspectionLogItem[]): void {
  try {
    localStorage.setItem(INSPECTIONS_KEY, JSON.stringify(list));
  } catch (e) {
    console.error('Failed to save inspections', e);
  }
}

// Claims Storage
export function getLiveClaims(): ClaimItem[] {
  try {
    const data = localStorage.getItem(CLAIMS_KEY);
    if (!data) return [];
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export function saveLiveClaims(list: ClaimItem[]): void {
  try {
    localStorage.setItem(CLAIMS_KEY, JSON.stringify(list));
  } catch (e) {
    console.error('Failed to save claims', e);
  }
}

// Documents Storage
export function getLiveDocuments(): DocumentRecord[] {
  try {
    const data = localStorage.getItem(DOCUMENTS_KEY);
    if (!data) return [];
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export function saveLiveDocuments(list: DocumentRecord[]): void {
  try {
    localStorage.setItem(DOCUMENTS_KEY, JSON.stringify(list));
  } catch (e) {
    console.error('Failed to save documents', e);
  }
}

// Global Super Admin Master Data Purge (Clears all data across the platform)
export function purgeAllPortalData(adminEmail?: string): { success: boolean; clearedCounts: Record<string, number> } {
  const ests = getLiveEstablishments().length;
  const tours = getLiveTours().length;
  const insps = getLiveInspections().length;
  const claims = getLiveClaims().length;
  const docs = getLiveDocuments().length;

  // Clear all localStorage keys
  localStorage.setItem(ESTABLISHMENTS_KEY, JSON.stringify([]));
  localStorage.setItem(TOURS_KEY, JSON.stringify([]));
  localStorage.setItem(INSPECTIONS_KEY, JSON.stringify([]));
  localStorage.setItem(CLAIMS_KEY, JSON.stringify([]));
  localStorage.setItem(DOCUMENTS_KEY, JSON.stringify([]));

  logUserActivity({
    userId: 'super-admin',
    userEmail: adminEmail || DEFAULT_SUPER_ADMIN.email,
    performedBy: adminEmail || DEFAULT_SUPER_ADMIN.email,
    action: 'PORTAL_MASTER_DATA_PURGED',
    module: 'SYSTEM',
    recordId: `purge-${Date.now()}`,
    remarks: `Super Admin executed full portal master purge: Cleared ${ests} establishments, ${tours} tours, ${insps} inspections, ${claims} claims, and ${docs} documents. App reset to 100% clean live mode.`,
    ipAddress: '192.168.1.153',
    success: true,
  });

  return {
    success: true,
    clearedCounts: {
      establishments: ests,
      tours,
      inspections: insps,
      claims,
      documents: docs,
    },
  };
}

// Granular Purge for specific module
export function purgeSpecificModule(moduleKey: 'establishments' | 'tours' | 'inspections' | 'claims' | 'documents', adminEmail?: string): number {
  let count = 0;
  if (moduleKey === 'establishments') {
    count = getLiveEstablishments().length;
    localStorage.setItem(ESTABLISHMENTS_KEY, JSON.stringify([]));
  } else if (moduleKey === 'tours') {
    count = getLiveTours().length;
    localStorage.setItem(TOURS_KEY, JSON.stringify([]));
  } else if (moduleKey === 'inspections') {
    count = getLiveInspections().length;
    localStorage.setItem(INSPECTIONS_KEY, JSON.stringify([]));
  } else if (moduleKey === 'claims') {
    count = getLiveClaims().length;
    localStorage.setItem(CLAIMS_KEY, JSON.stringify([]));
  } else if (moduleKey === 'documents') {
    count = getLiveDocuments().length;
    localStorage.setItem(DOCUMENTS_KEY, JSON.stringify([]));
  }

  logUserActivity({
    userId: 'super-admin',
    userEmail: adminEmail || DEFAULT_SUPER_ADMIN.email,
    performedBy: adminEmail || DEFAULT_SUPER_ADMIN.email,
    action: `PURGE_${moduleKey.toUpperCase()}`,
    module: 'SYSTEM',
    recordId: `purge-${moduleKey}-${Date.now()}`,
    remarks: `Super Admin purged all ${count} records from ${moduleKey} master table.`,
    ipAddress: '192.168.1.153',
    success: true,
  });

  return count;
}

// Load Sample Demo Dataset (Optional for demonstration)
export function loadSampleDataset(adminEmail?: string): void {
  saveLiveEstablishments(SAMPLE_ESTABLISHMENTS);
  saveLiveTours(SAMPLE_TOURS);
  saveLiveInspections(SAMPLE_INSPECTIONS);
  saveLiveClaims(SAMPLE_CLAIMS);

  logUserActivity({
    userId: 'super-admin',
    userEmail: adminEmail || DEFAULT_SUPER_ADMIN.email,
    performedBy: adminEmail || DEFAULT_SUPER_ADMIN.email,
    action: 'SAMPLE_DATA_LOADED',
    module: 'SYSTEM',
    recordId: `sample-${Date.now()}`,
    remarks: 'Loaded standard EPFO sample dataset for testing and demonstration.',
    ipAddress: '192.168.1.153',
    success: true,
  });
}
