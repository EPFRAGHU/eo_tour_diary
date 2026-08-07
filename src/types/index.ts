import {
  UserRole,
  CoverageStatus,
  TourStatus,
  InspectionStatus,
  ClaimStatus,
  DayType
} from '@prisma/client';

export {
  UserRole,
  CoverageStatus,
  TourStatus,
  InspectionStatus,
  ClaimStatus,
  DayType
};

export interface RegionalOfficeDTO {
  id: string;
  officeCode: string;
  officeName: string;
  district: string;
  state: string;
}

export interface EstablishmentDTO {
  id: string;
  establishmentCode: string;
  name: string;
  location: string;
  district: string;
  coverageStatus: CoverageStatus;
  industryType?: string | null;
}

export interface VisitPurposeDTO {
  id: string;
  code: string;
  name: string;
  category: string;
}

export interface ConveyanceModeDTO {
  id: string;
  code: string;
  name: string;
  ratePerKm: number;
}

export interface UserProfile {
  id: string;
  pfStaffId?: string | null;
  name: string;
  email: string;
  designation: string;
  officeRegion: string;
  role: UserRole;
}

export interface TourProgramItem {
  id: string;
  officerId: string;
  officerName?: string;
  title: string;
  purpose?: string;
  month: number;
  year: number;
  startDate: string;
  endDate: string;
  status: TourStatus;
  officeOrderRef?: string | null;
  remarks?: string | null;
  inspectionsCount?: number;
  createdAt: string;
}

export interface InspectionLogItem {
  id: string;
  tourId: string;
  date: string;
  visitDate?: string;
  establishmentCode: string;
  establishmentName: string;
  location: string;
  inspectionPurpose: string;
  workDoneDetails?: string;
  observations: string;
  distanceKm?: number;
  conveyanceMode?: string;
  vehicleDetails?: string;
  orderRef?: string | null;
  hotelStayed?: boolean;
  hotelName?: string | null;
  hotelAmount?: number;
  status: InspectionStatus;
}

export interface ClaimItem {
  id: string;
  tourId: string;
  tourTitle?: string;
  officerId: string;
  totalAmount: number;
  taAmount: number;
  daAmount: number;
  hotelAmount: number;
  otherAmount: number;
  status: ClaimStatus;
  remarks?: string | null;
  createdAt: string;
}

// Additional Dashboard Specific Data Structures
export interface FollowUpItem {
  id: string;
  establishmentCode: string;
  establishmentName: string;
  dueDate: string;
  type: '7A_ENQUIRY' | '14B_DAMAGES' | 'FORM_11_NOTICE' | 'COMPLIANCE_REMINDER';
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'PENDING' | 'RESOLVED';
  description: string;
}

export interface DocumentRecord {
  id: string;
  title: string;
  category: 'INSPECTION_NOTE' | 'OFFICE_ORDER' | 'CLAIM_RECEIPT' | 'LEGAL_NOTICE';
  refNumber: string;
  uploadedAt: string;
  fileSize: string;
}

export interface CallLogItem {
  id: string;
  contactName: string;
  establishmentName: string;
  designation: string;
  phoneNumber: string;
  callDate: string;
  purpose: string;
  notes: string;
}

export interface RecoveryMetric {
  targetAmount: number;
  recoveredAmount: number;
  pendingAmount: number;
  section7aAmount: number;
  section14bAmount: number;
}

export interface ActivityFeedItem {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  category: 'TOUR' | 'INSPECTION' | 'CLAIM' | 'RECOVERY' | 'DOCUMENT';
  badgeColor?: string;
}
