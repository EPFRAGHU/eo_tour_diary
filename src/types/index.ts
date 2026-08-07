export type UserRole = 'EO_AO' | 'APFC' | 'RPFC' | 'ADMIN';

export type TourStatusType = 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'REJECTED' | 'IN_PROGRESS' | 'COMPLETED';

export type InspectionStatusType = 'PENDING' | 'CONDUCTED' | 'DEFERRED' | 'NON_COMPLIANT_FOUND';

export type ClaimStatusType = 'DRAFT' | 'SUBMITTED' | 'VERIFIED_BY_APFC' | 'APPROVED_BY_RPFC' | 'REJECTED' | 'DISBURSED';

export interface UserProfile {
  id: string;
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
  purpose: string;
  month: number;
  year: number;
  startDate: string;
  endDate: string;
  status: TourStatusType;
  remarks?: string;
  inspectionsCount?: number;
  createdAt: string;
}

export interface InspectionLogItem {
  id: string;
  tourId: string;
  date: string;
  establishmentCode: string;
  establishmentName: string;
  location: string;
  inspectionPurpose: string;
  observations: string;
  status: InspectionStatusType;
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
  status: ClaimStatusType;
  remarks?: string;
  createdAt: string;
}
