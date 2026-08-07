export type UserRole =
  | 'SUPER_ADMIN'
  | 'REGIONAL_PF_COMMISSIONER'
  | 'ADDITIONAL_CENTRAL_PF_COMMISSIONER'
  | 'ASSISTANT_PF_COMMISSIONER'
  | 'ENFORCEMENT_OFFICER'
  | 'ACCOUNTS_OFFICER'
  | 'SECTION_SUPERVISOR'
  | 'DATA_ENTRY_OPERATOR'
  | 'READ_ONLY'
  | 'AUDITOR'
  | 'ADMIN'
  | 'APFC'
  | 'EO'
  | 'EO_AO'
  | 'VIEWER';

export type UserStatus =
  | 'ACTIVE'
  | 'INACTIVE'
  | 'SUSPENDED'
  | 'LOCKED'
  | 'PENDING_APPROVAL'
  | 'RETIRED'
  | 'TRANSFERRED'
  | 'DELETED';

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
  officialEmail?: string;
  designation: string;
  officeRegion: string;
  role: UserRole;
  pfStaffId?: string;
  avatarUrl?: string;
  photoUrl?: string;
}

export interface ExtendedUserProfile extends UserProfile {
  employeeId: string;
  epfoEmpNumber?: string;
  username: string;
  gender?: 'Male' | 'Female' | 'Other';
  dob?: string;
  mobile: string;
  altMobile?: string;
  officialEmail: string;
  personalEmail?: string;
  photoUrl?: string;
  office: string;
  region: string;
  district: string;
  joiningDate?: string;
  reportingOfficer?: string;
  status: UserStatus;
  notes?: string;
  lastLogin?: string;
  failedLoginCount: number;
  isMfaEnabled: boolean;
  createdDate: string;
  createdBy: string;
}

export type PermissionModule =
  | 'Dashboard'
  | 'Tour Diary'
  | 'Establishments'
  | 'Documents'
  | 'Reports'
  | 'Analytics'
  | 'User Management'
  | 'Audit Logs'
  | 'Settings';

export type PermissionAction =
  | 'View'
  | 'Create'
  | 'Edit'
  | 'Delete'
  | 'Approve'
  | 'Export'
  | 'Upload'
  | 'Download'
  | 'Print'
  | 'Assign'
  | 'Configure';

export type RolePermissionsMap = Record<UserRole, Record<PermissionModule, PermissionAction[]>>;

export interface UserActivityLogItem {
  id: string;
  userId: string;
  userEmail: string;
  timestamp: string;
  performedBy: string;
  action: string;
  module: PermissionModule | 'AUTH' | 'SYSTEM';
  recordId?: string;
  oldValue?: string;
  newValue?: string;
  ipAddress: string;
  device?: string;
  remarks?: string;
  success: boolean;
}

export interface UserSessionItem {
  id: string;
  userId: string;
  userEmail: string;
  device: string;
  browser: string;
  os: string;
  ipAddress: string;
  location: string;
  sessionDuration: string;
  lastActive: string;
  isActive: boolean;
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
  nextVisitDate?: string;
  type: 'FORM_11_NOTICE' | '7A_ENQUIRY' | '14B_DAMAGES' | 'COVERAGE_CHECK' | 'PMVBRY_CAMP';
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'OVERDUE';
  description: string;
  createdAt?: string;
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
