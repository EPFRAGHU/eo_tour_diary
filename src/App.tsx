import { useState } from 'react';
import { Layout } from '@/components/common/Layout';
import { Dashboard } from '@/pages/Dashboard';
import { TourPrograms } from '@/pages/TourPrograms';
import { InspectionLogs } from '@/pages/InspectionLogs';
import { Establishments } from '@/pages/Establishments';
import { DocumentVault } from '@/pages/DocumentVault';
import { CommunicationHub } from '@/pages/CommunicationHub';
import { Claims } from '@/pages/Claims';
import { Reports } from '@/pages/Reports';
import { TourProgramItem, InspectionLogItem, ClaimItem, EstablishmentDTO } from '@/types';
import { useAuth } from '@/providers/AuthProvider';

export function App() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  const currentUser = user || {
    id: 'eo-101',
    name: 'Rajesh Sharma',
    email: 'rajesh.sharma@epfindia.gov.in',
    designation: 'Enforcement Officer (EO/AO)',
    officeRegion: 'RO Mumbai (Bandra)',
    role: 'EO' as const,
  };

  const [establishments, setEstablishments] = useState<EstablishmentDTO[]>([
    {
      id: 'est-1',
      establishmentCode: 'OR/6276',
      name: 'M/s Jindal Stainless Steel Ltd',
      location: 'Danagadi, Jajpur',
      district: 'Jajpur',
      coverageStatus: 'COVERED',
      industryType: 'Manufacturing / Metallurgy',
    },
    {
      id: 'est-2',
      establishmentCode: 'OR/BBS/1238',
      name: 'M/s Bhimtanagar Sukinda Chromite Mines',
      location: 'Sukinda, Jajpur',
      district: 'Jajpur',
      coverageStatus: 'EXEMPTED',
      industryType: 'Mining & Extraction',
    },
    {
      id: 'est-3',
      establishmentCode: 'OR/BBS/5077',
      name: 'M/s NTPC Kanhia Thermal Power Plant',
      location: 'Kanhia, Angul',
      district: 'Angul',
      coverageStatus: 'COVERED',
      industryType: 'Power Generation',
    },
    {
      id: 'est-4',
      establishmentCode: 'OR/BBS/16917/24',
      name: 'M/s Executive Engineer, Mahanadi South Division',
      location: 'Cuttack',
      district: 'Cuttack',
      coverageStatus: 'GOVT_UNDERTAKING',
      industryType: 'Public Works / Irrigation',
    },
    {
      id: 'est-5',
      establishmentCode: 'MH/BAN/0045231/000',
      name: 'Apex Logistics & Freight India Pvt Ltd',
      location: 'MIDC Andheri East, Mumbai',
      district: 'Cuttack',
      coverageStatus: 'COVERED',
      industryType: 'Logistics & Warehousing',
    },
  ]);

  const [tours, setTours] = useState<TourProgramItem[]>([
    {
      id: 'tour-1',
      officerId: currentUser.id,
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
      officerId: currentUser.id,
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
      establishmentCode: 'OR/6276',
      establishmentName: 'M/s Jindal Stainless Steel Ltd',
      location: 'Danagadi, Jajpur',
      inspectionPurpose: 'PMVBRY Campaigning & Verification',
      observations: 'Inspected 14B damages compliance and conducted labor code awareness camp.',
      status: 'CONDUCTED',
    },
  ]);

  const [claims, setClaims] = useState<ClaimItem[]>([
    {
      id: 'claim-1',
      tourId: 'tour-1',
      tourTitle: 'Special Compliance Drive - Andheri East Zone',
      officerId: currentUser.id,
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

  // Establishment Actions
  const handleAddEstablishment = (newEst: Omit<EstablishmentDTO, 'id'>) => {
    const item: EstablishmentDTO = {
      ...newEst,
      id: `est-${Date.now()}`,
    };
    setEstablishments([item, ...establishments]);
  };

  const handleUpdateEstablishment = (updatedEst: EstablishmentDTO) => {
    setEstablishments(establishments.map((e) => (e.id === updatedEst.id ? updatedEst : e)));
  };

  const handleDeleteEstablishment = (id: string) => {
    setEstablishments(establishments.filter((e) => e.id !== id));
  };

  const handleImportEstablishments = (imported: Omit<EstablishmentDTO, 'id'>[]) => {
    const newItems: EstablishmentDTO[] = imported.map((item, idx) => ({
      ...item,
      id: `est-imp-${Date.now()}-${idx}`,
    }));
    setEstablishments([...newItems, ...establishments]);
  };

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
    <Layout user={currentUser} activeTab={activeTab} setActiveTab={setActiveTab}>
      {activeTab === 'dashboard' && (
        <Dashboard
          user={currentUser}
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
      {activeTab === 'establishments' && (
        <Establishments
          establishments={establishments}
          inspections={inspections}
          onAddEstablishment={handleAddEstablishment}
          onUpdateEstablishment={handleUpdateEstablishment}
          onDeleteEstablishment={handleDeleteEstablishment}
          onImportEstablishments={handleImportEstablishments}
        />
      )}
      {activeTab === 'documents' && (
        <DocumentVault establishments={establishments} />
      )}
      {activeTab === 'communication' && (
        <CommunicationHub establishments={establishments} />
      )}
      {activeTab === 'claims' && (
        <Claims claims={claims} tours={tours} onAddClaim={handleAddClaim} />
      )}
      {activeTab === 'reports' && (
        <Reports user={currentUser} tours={tours} inspections={inspections} claims={claims} />
      )}
    </Layout>
  );
}
