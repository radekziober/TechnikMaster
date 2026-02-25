import { Magazine, ProjectGroup, ProjectGroupType, MagazineStatus, DefectReport, MaintenanceLog, MagazineType } from '../types';

// Initial Project Groups
export const INITIAL_GROUPS: ProjectGroup[] = [
  { id: 'g1', name: 'VW Passat/Golf', type: ProjectGroupType.VW, magazineType: MagazineType.CAB_SMALL, color: 'bg-orange-500', pcbWidthMm: 120, description: 'Projekty MIB3 Entry' },
  { id: 'g2', name: 'Audi e-tron', type: ProjectGroupType.AUDI, magazineType: MagazineType.CAB_LARGE, color: 'bg-blue-600', pcbWidthMm: 185, description: 'Projekty High-End AED' },
  { id: 'g3', name: 'BMW Cluster', type: ProjectGroupType.BMW, magazineType: MagazineType.ULC, color: 'bg-yellow-400', pcbWidthMm: 210, description: 'Instrument Cluster' },
  { id: 'g4', name: 'Półprodukty FLP', type: ProjectGroupType.FLP, magazineType: MagazineType.CAB_SMALL, color: 'bg-green-600', pcbWidthMm: 150, description: 'Flash Loading Process' },
];

// Initial Magazines
export const INITIAL_MAGAZINES: Magazine[] = [
  { 
    id: 'm1', name: '$1001', groupId: 'g1', status: MagazineStatus.OK, 
    lastLocation: 'SMT: CMPO-1', lastMaintenanceDate: '2023-11-15', nextMaintenanceDate: '2024-05-15', 
    manufacturingDate: '2023-01-01', maintenanceCycleMonths: 6 
  },
  { 
    id: 'm2', name: '$1002', groupId: 'g1', status: MagazineStatus.DAMAGED, 
    lastLocation: 'Repair Area', lastMaintenanceDate: '2023-10-01', nextMaintenanceDate: '2024-04-01', 
    manufacturingDate: '2023-01-05', maintenanceCycleMonths: 6 
  },
  { 
    id: 'm3', name: '$2045', groupId: 'g2', status: MagazineStatus.OK, 
    lastLocation: 'THT: Wave-2', lastMaintenanceDate: '2024-01-20', nextMaintenanceDate: '2024-07-20', 
    manufacturingDate: '2023-06-12', maintenanceCycleMonths: 6 
  },
  { 
    id: 'm4', name: '$2046', groupId: 'g2', status: MagazineStatus.OK, 
    lastLocation: 'FCT: Tester-5', lastMaintenanceDate: '2023-08-15', nextMaintenanceDate: '2024-02-15', // Overdue
    manufacturingDate: '2023-06-12', maintenanceCycleMonths: 6 
  },
  { 
    id: 'm5', name: '$3001', groupId: 'g3', status: MagazineStatus.OK, 
    lastLocation: 'Warehouse', lastMaintenanceDate: '2024-03-01', nextMaintenanceDate: '2024-09-01', 
    manufacturingDate: '2023-11-20', maintenanceCycleMonths: 6 
  },
];

// Initial Defects
export const INITIAL_DEFECTS: DefectReport[] = [
  { id: 'd1', magazineId: 'm2', reportedAt: '2024-05-10T08:30:00', operatorName: 'Jan Kowalski', defects: ['Połamane sloty/prowadnice'], description: 'Slot 4 i 5 wyłamany.', status: 'NEW' },
];

// Initial Maintenance Logs
export const INITIAL_MAINTENANCE_LOGS: MaintenanceLog[] = [
  { id: 'l1', magazineId: 'm1', date: '2023-11-15', type: 'PREVENTIVE', description: 'Okresowy przegląd. Czyszczenie i smarowanie.', technicianName: 'Adam Nowak' },
  { id: 'l2', magazineId: 'm1', date: '2023-05-15', type: 'PREVENTIVE', description: 'Pierwszy przegląd po wdrożeniu.', technicianName: 'Adam Nowak' },
  { id: 'l3', magazineId: 'm2', date: '2023-10-01', type: 'CORRECTIVE', description: 'Wymiana uszkodzonej rączki transportowej.', technicianName: 'Piotr Wiśniewski' },
  { id: 'l4', magazineId: 'm4', date: '2023-08-15', type: 'PREVENTIVE', description: 'Przegląd standardowy.', technicianName: 'Adam Nowak' },
];

// Helper to get formatted date
export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('pl-PL');
};