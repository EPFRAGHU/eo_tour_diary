export type UserRole = 'ADMIN' | 'APFC' | 'EO' | 'EO_AO' | 'VIEWER';

export type TourStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'RECOMMENDED_APFC'
  | 'APPROVED_RPFC'
  | 'APPROVED'
  | 'REJECTED'
  | 'IN_PROGRESS'
  | 'COMPLETED';

export type InspectionStatus =
  | 'SCHEDULED'
  | 'CONDUCTED'
  | 'DEFERRED'
  | 'NON_COMPLIANT_FOUND'
  | 'REPORT_SUBMITTED';

export type ClaimStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'VERIFIED_APFC'
  | 'APPROVED_RPFC'
  | 'REJECTED'
  | 'DISBURSED';

export type CoverageStatus =
  | 'COVERED'
  | 'UNCOVERED'
  | 'EXEMPTED'
  | 'CLUSTER_HANDLOOM'
  | 'GOVT_UNDERTAKING';

export type DayType =
  | 'OFFICE_DAY'
  | 'TOUR_DAY'
  | 'WEEKEND_SATURDAY'
  | 'WEEKEND_SUNDAY'
  | 'PUBLIC_HOLIDAY'
  | 'SPECIAL_CAMP';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  designation: string;
  officeRegion: string;
  role: UserRole;
  pfStaffId?: string;
  avatarUrl?: string;
}

export interface EstablishmentDTO {
  id: string;
  establishmentCode: string;
  name: string;
  establishmentName?: string;
  location: string;
  district: string;
  coverageStatus: CoverageStatus;
  industryType?: string;
}

export interface InspectionLogItem {
  id: string;
  tourId: string;
  date?: string;
  visitDate?: string;
  establishmentCode: string;
  establishmentName: string;
  location: string;
  inspectionPurpose: string;
  observations: string;
  status: InspectionStatus;
  distanceKm?: number;
  conveyanceMode?: string;
}

export interface TourProgramItem {
  id: string;
  officerId: string;
  title: string;
  purpose: string;
  month: number;
  year: number;
  startDate: string;
  endDate: string;
  status: TourStatus;
  remarks?: string;
  inspectionsCount?: number;
  createdAt: string;
}

export interface ClaimItem {
  id: string;
  tourId: string;
  tourTitle: string;
  officerId: string;
  totalAmount: number;
  taAmount: number;
  daAmount: number;
  hotelAmount: number;
  otherAmount: number;
  status: ClaimStatus;
  remarks?: string;
  createdAt: string;
}

export interface FollowUpItem {
  id: string;
  establishmentCode: string;
  establishmentName: string;
  dueDate: string;
  type: 'FORM_11_NOTICE' | '7A_ENQUIRY' | '14B_DAMAGES' | 'COVERAGE_CHECK' | 'PMVBRY_CAMP';
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  description: string;
}

export interface DocumentVersionItem {
  version: string;
  uploadedAt: string;
  uploadedBy: string;
  fileName: string;
  fileSize: string;
  changeNotes?: string;
}

export type FileFormatType = 'PHOTO' | 'PDF' | 'WORD' | 'EXCEL' | 'ZIP';

export interface DocumentRecord {
  id: string;
  title: string;
  category: 'INSPECTION_NOTE' | 'NOTICE_7A' | 'DAMAGES_14B' | 'TA_RECEIPT' | 'OFFICE_ORDER' | 'GENERAL';
  refNumber: string;
  uploadedAt: string;
  fileSize: string;
  establishmentCode: string;
  establishmentName: string;
  folderPath: string;
  fileFormat: FileFormatType;
  fileUrl?: string;
  currentVersion: string;
  versions: DocumentVersionItem[];
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
  category: 'INSPECTION' | 'CLAIM' | 'TOUR' | 'RECOVERY' | 'DOCUMENT';
  badgeColor?: string;
}
