import { useState } from 'react';
import { Layout } from '@/components/common/Layout';
import { Dashboard } from '@/pages/Dashboard';
import { TourPrograms } from '@/pages/TourPrograms';
import { InspectionLogs } from '@/pages/InspectionLogs';
import { Claims } from '@/pages/Claims';
import { Reports } from '@/pages/Reports';
import { UserProfile, TourProgramItem, InspectionLogItem, ClaimItem } from '@/types';

export function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const [user] = useState<UserProfile>({
    id: 'eo-101',
    name: 'Rajesh Sharma',
    email: 'rajesh.sharma@epfindia.gov.in',
    designation: 'Enforcement Officer (EO/AO)',
    officeRegion: 'RO Mumbai (Bandra)',
    role: 'EO_AO',
  });

  const [tours, setTours] = useState<TourProgramItem[]>([
    {
      id: 'tour-1',
      officerId: 'eo-101',
      title: 'Special Compliance Drive - Andheri East Zone',
      purpose: 'Inspection of 14B damages defaults & un-enrolled contract worker verification.',
      month: 8,
      year: 2026,
      startDate: '2026-08-10',
      endDate: '2026-08-14',
      status: 'APPROVED',
      remarks: 'Approved by APFC (Compliance)',
      inspectionsCount: 4,
      createdAt: '2026-08-01',
    },
    {
      id: 'tour-2',
      officerId: 'eo-101',
      title: 'Routine Inspection Tour - MIDC Sector II',
      purpose: 'Verification of coverage eligibility for newly registered establishments under Sec 1(3)(b).',
      month: 8,
      year: 2026,
      startDate: '2026-08-20',
      endDate: '2026-08-22',
      status: 'SUBMITTED',
      remarks: 'Submitted for APFC approval',
      inspectionsCount: 2,
      createdAt: '2026-08-05',
    },
  ]);

  const [inspections, setInspections] = useState<InspectionLogItem[]>([
    {
      id: 'insp-1',
      tourId: 'tour-1',
      date: '2026-08-11',
      establishmentCode: 'MH/BAN/0045231/000',
      establishmentName: 'Apex Logistics & Freight India Pvt Ltd',
      location: 'MIDC Andheri East, Mumbai',
      inspectionPurpose: 'Section 7A Enquiry Records Examination',
      observations: 'Examined attendance registers and salary slips for May-July 2026. Detected 18 non-enrolled contractual security staff. Issued Form 11 notice.',
      status: 'NON_COMPLIANT_FOUND',
    },
    {
      id: 'insp-2',
      tourId: 'tour-1',
      date: '2026-08-12',
      establishmentCode: 'MH/BAN/0089102/000',
      establishmentName: 'Titan Tech Solutions Enterprise',
      location: 'SEEPZ Special Economic Zone, Andheri',
      inspectionPurpose: 'Routine Compliance Inspection',
      observations: 'All 142 eligible employees enrolled in ECR. Electronic return filed up to date. No default noticed.',
      status: 'CONDUCTED',
    },
  ]);

  const [claims, setClaims] = useState<ClaimItem[]>([
    {
      id: 'claim-1',
      tourId: 'tour-1',
      tourTitle: 'Special Compliance Drive - Andheri East Zone',
      officerId: 'eo-101',
      totalAmount: 3450,
      taAmount: 1200,
      daAmount: 1500,
      hotelAmount: 750,
      otherAmount: 0,
      status: 'SUBMITTED',
      remarks: 'Taxi vouchers & DA rate per grade IV attached.',
      createdAt: '2026-08-06',
    },
  ]);

  const handleAddTour = (newTour: Omit<TourProgramItem, 'id' | 'createdAt'>) => {
    const item: TourProgramItem = {
      ...newTour,
      id: `tour-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setTours([item, ...tours]);
  };

  const handleAddInspection = (newInsp: Omit<InspectionLogItem, 'id'>) => {
    const item: InspectionLogItem = {
      ...newInsp,
      id: `insp-${Date.now()}`,
    };
    setInspections([item, ...inspections]);
  };

  const handleAddClaim = (newClaim: Omit<ClaimItem, 'id' | 'createdAt'>) => {
    const item: ClaimItem = {
      ...newClaim,
      id: `claim-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setClaims([item, ...claims]);
  };

  return (
    <Layout user={user} activeTab={activeTab} setActiveTab={setActiveTab}>
      {activeTab === 'dashboard' && (
        <Dashboard
          user={user}
          tours={tours}
          inspections={inspections}
          claims={claims}
          onNavigate={setActiveTab}
        />
      )}
      {activeTab === 'tours' && (
        <TourPrograms tours={tours} onAddTour={handleAddTour} />
      )}
      {activeTab === 'inspections' && (
        <InspectionLogs
          inspections={inspections}
          tours={tours}
          onAddInspection={handleAddInspection}
        />
      )}
      {activeTab === 'claims' && (
        <Claims claims={claims} tours={tours} onAddClaim={handleAddClaim} />
      )}
      {activeTab === 'reports' && (
        <Reports user={user} tours={tours} inspections={inspections} claims={claims} />
      )}
    </Layout>
  );
}
