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
import {
  getLiveEstablishments,
  saveLiveEstablishments,
  getLiveTours,
  saveLiveTours,
  getLiveInspections,
  saveLiveInspections,
  getLiveClaims,
  saveLiveClaims,
} from '@/lib/appStorage';

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
  const adminTabKeys = [
    'users',
    'roles',
    'offices',
    'establishment-import',
    'establishments-import',
    'departments',
    'districts',
    'audit-logs',
    'settings',
    'security',
    'backups',
    'config',
  ];

  // Guard activeTab if non-super admin attempts to view an admin tab
  const effectiveTab = (!isSuperAdmin && adminTabKeys.includes(activeTab)) ? 'dashboard' : activeTab;

  // Live Persistent State
  const [establishments, setEstablishments] = useState<EstablishmentDTO[]>(() => getLiveEstablishments());
  const [tours, setTours] = useState<TourProgramItem[]>(() => getLiveTours());
  const [inspections, setInspections] = useState<InspectionLogItem[]>(() => getLiveInspections());
  const [claims, setClaims] = useState<ClaimItem[]>(() => getLiveClaims());

  // Synchronize state with persistent storage on reloads or storage events
  const handleReloadLiveStorage = () => {
    setEstablishments(getLiveEstablishments());
    setTours(getLiveTours());
    setInspections(getLiveInspections());
    setClaims(getLiveClaims());
  };

  // Establishment Actions
  const handleAddEstablishment = (newEst: Omit<EstablishmentDTO, 'id'>) => {
    const item: EstablishmentDTO = {
      ...newEst,
      establishmentCode: formatOdishaEstCode(newEst.establishmentCode, newEst.district),
      id: `est-${Date.now()}`,
    };
    const updated = [item, ...establishments];
    setEstablishments(updated);
    saveLiveEstablishments(updated);
  };

  const handleUpdateEstablishment = (updatedEst: EstablishmentDTO) => {
    const formatted = {
      ...updatedEst,
      establishmentCode: formatOdishaEstCode(updatedEst.establishmentCode, updatedEst.district),
    };
    const updated = establishments.map((e) => (e.id === formatted.id ? formatted : e));
    setEstablishments(updated);
    saveLiveEstablishments(updated);
  };

  const handleDeleteEstablishment = (id: string) => {
    const updated = establishments.filter((e) => e.id !== id);
    setEstablishments(updated);
    saveLiveEstablishments(updated);
  };

  const handleImportEstablishments = (imported: Omit<EstablishmentDTO, 'id'>[]) => {
    const newItems: EstablishmentDTO[] = imported.map((item, idx) => ({
      ...item,
      establishmentCode: formatOdishaEstCode(item.establishmentCode, item.district),
      id: `est-imp-${Date.now()}-${idx}`,
    }));
    const updated = [...newItems, ...establishments];
    setEstablishments(updated);
    saveLiveEstablishments(updated);
  };

  // Tour Actions
  const handleAddTour = (newTour: Omit<TourProgramItem, 'id' | 'createdAt'>) => {
    const item: TourProgramItem = {
      ...newTour,
      id: `tour-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    const updated = [item, ...tours];
    setTours(updated);
    saveLiveTours(updated);
  };

  const handleDeleteTour = (id: string) => {
    const updated = tours.filter((t) => t.id !== id);
    setTours(updated);
    saveLiveTours(updated);
  };

  // Inspection Actions
  const handleAddInspection = (newInsp: Omit<InspectionLogItem, 'id'>) => {
    const item: InspectionLogItem = {
      ...newInsp,
      id: `insp-${Date.now()}`,
    };
    const updated = [item, ...inspections];
    setInspections(updated);
    saveLiveInspections(updated);
  };

  const handleDeleteInspection = (id: string) => {
    const updated = inspections.filter((i) => i.id !== id);
    setInspections(updated);
    saveLiveInspections(updated);
  };

  // Claim Actions
  const handleAddClaim = (newClaim: Omit<ClaimItem, 'id' | 'createdAt'>) => {
    const item: ClaimItem = {
      ...newClaim,
      id: `claim-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    const updated = [item, ...claims];
    setClaims(updated);
    saveLiveClaims(updated);
  };

  const handleDeleteClaim = (id: string) => {
    const updated = claims.filter((c) => c.id !== id);
    setClaims(updated);
    saveLiveClaims(updated);
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
        <TourPrograms
          tours={tours}
          onAddTour={handleAddTour}
          onDeleteTour={handleDeleteTour}
          isSuperAdmin={isSuperAdmin}
        />
      )}
      {effectiveTab === 'inspections' && (
        <InspectionLogs
          inspections={inspections}
          tours={tours}
          onAddInspection={handleAddInspection}
          onDeleteInspection={handleDeleteInspection}
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
        <Claims
          claims={claims}
          tours={tours}
          onAddClaim={handleAddClaim}
          onDeleteClaim={handleDeleteClaim}
        />
      )}
      {effectiveTab === 'reports' && (
        <Reports user={currentUser} tours={tours} inspections={inspections} claims={claims} />
      )}
      {isSuperAdmin && adminTabKeys.includes(effectiveTab) && (
        <UserManagement
          currentUser={currentUser}
          tours={tours}
          establishments={establishments}
          inspections={inspections}
          claims={claims}
          onImportEstablishments={handleImportEstablishments}
          onAddEstablishment={handleAddEstablishment}
          onUpdateEstablishment={handleUpdateEstablishment}
          onDeleteEstablishment={handleDeleteEstablishment}
          onDataPurgeReset={handleReloadLiveStorage}
          initialSubTab={
            effectiveTab === 'roles' ? 'roles' :
            effectiveTab === 'offices' || effectiveTab === 'departments' || effectiveTab === 'districts' ? 'offices' :
            effectiveTab === 'establishment-import' || effectiveTab === 'establishments-import' ? 'establishment-import' :
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
