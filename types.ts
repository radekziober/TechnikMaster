export enum ProjectGroupType {
  VW = 'VW',
  AUDI = 'AUDI',
  BMW = 'BMW',
  FLP = 'FLP',
  OTHER = 'OTHER'
}

export enum MagazineType {
  CAB_SMALL = 'CAB (mały)',
  CAB_LARGE = 'CAB (duży)',
  ULC = 'ULC'
}

export interface ProjectGroup {
  id: string;
  name: string;
  type: ProjectGroupType;
  magazineType: MagazineType; // New field
  color: string; // Hex code or Tailwind class mapping
  pcbWidthMm: number;
  description: string;
}

export enum MagazineStatus {
  OK = 'OK',
  DAMAGED = 'USZKODZONY',
  IN_MAINTENANCE = 'W_KONSERWACJI',
  RETIRED = 'WYCOFANY'
}

export interface MaintenanceLog {
  id: string;
  magazineId: string; // Link to magazine
  date: string;
  type: 'PREVENTIVE' | 'CORRECTIVE'; // Przegląd vs Naprawa
  description: string;
  technicianName: string;
}

export interface DefectReport {
  id: string;
  magazineId: string;
  reportedAt: string;
  operatorName: string;
  defects: string[]; // List of selected defects
  description: string;
  status: 'NEW' | 'IN_PROGRESS' | 'RESOLVED';
}

export interface Magazine {
  id: string;
  name: string; // Format: $ + 4 digits
  groupId: string;
  status: MagazineStatus;
  lastLocation: string; // e.g., "SMT: CMPO-3"
  lastMaintenanceDate: string;
  nextMaintenanceDate: string;
  manufacturingDate: string;
  maintenanceCycleMonths: number;
}

export const DEFECT_TYPES = [
  "Krzywy magazynek (geometria)",
  "Uszkodzona podstawa",
  "Brak śrubki/elementu mocującego",
  "Połamane sloty/prowadnice",
  "Zacinająca się regulacja",
  "Zabrudzenie/Zanieczyszczenie"
];