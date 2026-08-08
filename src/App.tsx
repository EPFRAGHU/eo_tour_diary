import { useState } from 'react';
import { Layout } from '@/components/common/Layout';
import { Dashboard } from '@/pages/Dashboard';
import { AnalyticsDashboard } from '@/pages/AnalyticsDashboard';
import { TourPrograms } from '@/pages/TourPrograms';
import { InspectionLogs } from '@/pages/InspectionLogs';
import { Establishments } from '@/pages/Establishments';
import { DocumentVault } from '@/pages/DocumentVault';
import { CommunicationHub } from '@/pages/CommunicationHub';
import { FollowUpTracker } from '@/pages/FollowUpTracker';
import { Claims } from '@/pages/Claims';
import { Reports } from '@/pages/Reports';
import { UserManagement } from '@/pages/admin/UserManagement';
import { TourProgramItem, InspectionLogItem, ClaimItem, EstablishmentDTO } from '@/types';
import { useAuth } from '@/providers/AuthProvider';
import { SUPER_ADMIN_EMAIL, isProtectedSuperAdmin } from '@/lib/securityUtils';

import { formatOdishaEstCode } from '@/lib/utils';

export function App({ initialTab }: { initialTab?: string }) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(initialTab || 'dashboard');

  const currentUser = user || {
    id: 'usr-super-admin-1',
    name: 'Shri Raghunatha Maharana',
    email: SUPER_ADMIN_EMAIL,
    officialEmail: SUPER_ADMIN_EMAIL,
    designation: 'Super Administrator / Additional Central PF Commissioner',
    officeRegion: 'HQ / RO Bhubaneswar',
    role: 'SUPER_ADMIN' as const,
  };

  const isSuperAdmin = isProtectedSuperAdmin(currentUser);
  const adminTabKeys = ['users', 'roles', 'offices', 'departments', 'districts', 'audit-logs', 'settings', 'security', 'backups', 'config'];

  // Guard activeTab if non-super admin attempts to view an admin tab
  const effectiveTab = (!isSuperAdmin && adminTabKeys.includes(activeTab)) ? 'dashboard' : activeTab;

  const [establishments, setEstablishments] = useState<EstablishmentDTO[]>([
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
  ]);

  const [tours, setTours] = useState<TourProgramItem[]>([
    {
      id: 'tour-1',
      officerId: currentUser.id,
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
  ]);

  const [inspections, setInspections] = useState<InspectionLogItem[]>([
    {
      id: 'insp-1',
      tourId: 'tour-1',
      date: '2026-08-10',
      establishmentCode: 'OR/BBS/0045231/000',
      establishmentName: 'Apex Logistics & Freight India Pvt Ltd',
      location: 'Choudwar Industrial Area, Cuttack',
      inspectionPurpose: 'Section 7A Enquiry Records Examination',
      observations: 'Examined attendance registers and salary slips for May-July 2026. Detected 18 non-enrolled contractual security staff. Issued Form 11 notice.',
      status: 'NON_COMPLIANT_FOUND',
    },
    {
      id: 'insp-2',
      tourId: 'tour-1',
      date: '2026-08-12',
      establishmentCode: 'OR/BBS/0006276/000',
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
      tourTitle: 'Special Compliance Drive - Jajpur Industrial Cluster',
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
      establishmentCode: formatOdishaEstCode(newEst.establishmentCode, newEst.district),
      id: `est-${Date.now()}`,
    };
    setEstablishments([item, ...establishments]);
  };

  const handleUpdateEstablishment = (updatedEst: EstablishmentDTO) => {
    const formatted = {
      ...updatedEst,
      establishmentCode: formatOdishaEstCode(updatedEst.establishmentCode, updatedEst.district),
    };
    setEstablishments(establishments.map((e) => (e.id === formatted.id ? formatted : e)));
  };

  const handleDeleteEstablishment = (id: string) => {
    setEstablishments(establishments.filter((e) => e.id !== id));
  };

  const handleImportEstablishments = (imported: Omit<EstablishmentDTO, 'id'>[]) => {
    const newItems: EstablishmentDTO[] = imported.map((item, idx) => ({
      ...item,
      establishmentCode: formatOdishaEstCode(item.establishmentCode, item.district),
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
    <Layout user={currentUser} activeTab={effectiveTab} setActiveTab={setActiveTab}>
      {effectiveTab === 'dashboard' && (
        <Dashboard
          user={currentUser}
          tours={tours}
          inspections={inspections}
          claims={claims}
          onNavigate={setActiveTab}
        />
      )}
      {effectiveTab === 'analytics' && (
        <AnalyticsDashboard
          establishments={establishments}
          tours={tours}
          inspections={inspections}
        />
      )}
      {effectiveTab === 'tours' && (
        <TourPrograms tours={tours} onAddTour={handleAddTour} />
      )}
      {effectiveTab === 'inspections' && (
        <InspectionLogs
          inspections={inspections}
          tours={tours}
          onAddInspection={handleAddInspection}
        />
      )}
      {effectiveTab === 'followups' && (
        <FollowUpTracker establishments={establishments} onNavigate={setActiveTab} />
      )}
      {effectiveTab === 'establishments' && (
        <Establishments
          establishments={establishments}
          inspections={inspections}
          onAddEstablishment={handleAddEstablishment}
          onUpdateEstablishment={handleUpdateEstablishment}
          onDeleteEstablishment={handleDeleteEstablishment}
          onImportEstablishments={handleImportEstablishments}
        />
      )}
      {effectiveTab === 'documents' && (
        <DocumentVault establishments={establishments} />
      )}
      {effectiveTab === 'communication' && (
        <CommunicationHub establishments={establishments} />
      )}
      {effectiveTab === 'claims' && (
        <Claims claims={claims} tours={tours} onAddClaim={handleAddClaim} />
      )}
      {effectiveTab === 'reports' && (
        <Reports user={currentUser} tours={tours} inspections={inspections} claims={claims} />
      )}
      {isSuperAdmin && adminTabKeys.includes(effectiveTab) && (
        <UserManagement
          currentUser={currentUser}
          tours={tours}
          initialSubTab={
            effectiveTab === 'roles' ? 'roles' :
            effectiveTab === 'offices' || effectiveTab === 'departments' || effectiveTab === 'districts' ? 'offices' :
            effectiveTab === 'audit-logs' ? 'audit' :
            effectiveTab === 'security' ? 'security' :
            effectiveTab === 'backups' ? 'backups' :
            effectiveTab === 'config' ? 'config' :
            effectiveTab === 'settings' ? 'settings' : 'users'
          }
        />
      )}
    </Layout>
  );
}
