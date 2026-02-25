import React, { useState } from 'react';
import { LayoutDashboard, Box, Settings, Wrench, LogOut } from 'lucide-react';
import { INITIAL_MAGAZINES, INITIAL_GROUPS, INITIAL_DEFECTS, INITIAL_MAINTENANCE_LOGS } from './services/mockData';
import { ProjectGroups } from './components/ProjectGroups';
import { MagazineList } from './components/MagazineList';
import { Dashboard } from './components/Dashboard';
import { OperatorView } from './components/OperatorView';
import { DefectReport, MagazineStatus, Magazine, ProjectGroup, MaintenanceLog } from './types';

// Simple navigation types
type View = 'dashboard' | 'magazines' | 'groups' | 'operator';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [prefilledMagazineId, setPrefilledMagazineId] = useState<string>('');
  
  // App State (Simulating Database)
  const [magazines, setMagazines] = useState(INITIAL_MAGAZINES);
  const [defects, setDefects] = useState(INITIAL_DEFECTS);
  const [maintenanceLogs, setMaintenanceLogs] = useState(INITIAL_MAINTENANCE_LOGS);
  const [groups, setGroups] = useState(INITIAL_GROUPS);

  // Handler for Operator Reporting
  const handleDefectReport = (magazineId: string, defectTypes: string[], desc: string) => {
    const newDefect: DefectReport = {
      id: `d${Date.now()}`,
      magazineId,
      reportedAt: new Date().toISOString(),
      operatorName: 'Operator Linii 1', // Mocked user
      defects: defectTypes,
      description: desc,
      status: 'NEW'
    };

    setDefects(prev => [newDefect, ...prev]);
    
    // Update magazine status to Damaged
    setMagazines(prev => prev.map(m => 
      m.id === magazineId ? { ...m, status: MagazineStatus.DAMAGED } : m
    ));
  };

  // Handler for updating magazine details (Technician)
  const handleUpdateMagazine = (updatedMagazine: Magazine) => {
    setMagazines(prev => prev.map(m => m.id === updatedMagazine.id ? updatedMagazine : m));
  };

  // Handler for completing a repair
  const handleRepairMagazine = (magazineId: string, description: string) => {
    // 1. Add log entry
    const newLog: MaintenanceLog = {
      id: `l${Date.now()}`,
      magazineId: magazineId,
      date: new Date().toISOString(),
      type: 'CORRECTIVE',
      description: description,
      technicianName: 'Technik (Panel)' // Mocked user
    };
    setMaintenanceLogs(prev => [newLog, ...prev]);

    // 2. Update magazine status to OK
    setMagazines(prev => prev.map(m => 
      m.id === magazineId ? { ...m, status: MagazineStatus.OK } : m
    ));

    // 3. Optional: Resolve related defects (simple implementation: mark all open defects for this mag as resolved)
    setDefects(prev => prev.map(d => 
      d.magazineId === magazineId && d.status !== 'RESOLVED' 
        ? { ...d, status: 'RESOLVED' as const } 
        : d
    ));
  };

  // Handler for adding new magazine
  const handleAddMagazine = (newMagazine: Magazine) => {
    setMagazines(prev => [...prev, newMagazine]);
  };

  // Handlers for Project Groups
  const handleAddGroup = (newGroup: ProjectGroup) => {
    setGroups(prev => [...prev, newGroup]);
  };

  const handleUpdateGroup = (updatedGroup: ProjectGroup) => {
    setGroups(prev => prev.map(g => g.id === updatedGroup.id ? updatedGroup : g));
  };

  const handleDeleteGroup = (groupId: string) => {
    // Optional: Check if used in magazines before delete, for now just delete
    setGroups(prev => prev.filter(g => g.id !== groupId));
  };

  // Handler to navigate to operator view with a specific magazine selected
  const handleNavigateToOperator = (magazineName: string) => {
    setPrefilledMagazineId(magazineName);
    setCurrentView('operator');
  };

  // If in Operator Mode, show full screen Operator View
  if (currentView === 'operator') {
    return (
      <OperatorView 
        magazines={magazines} 
        onReportSubmit={handleDefectReport} 
        onExit={() => {
            setCurrentView('dashboard');
            setPrefilledMagazineId('');
        }}
        initialMagazineId={prefilledMagazineId}
      />
    );
  }

  // Technician Layout
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white hidden md:flex flex-col">
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
            MagazynMaster
          </h1>
          <p className="text-xs text-slate-400 mt-1">v1.0.0 Technician Panel</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => setCurrentView('dashboard')}
            className={`flex items-center gap-3 w-full p-3 rounded-lg transition ${currentView === 'dashboard' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="font-medium">Panel Główny</span>
          </button>

          <button 
            onClick={() => setCurrentView('magazines')}
            className={`flex items-center gap-3 w-full p-3 rounded-lg transition ${currentView === 'magazines' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <Box className="w-5 h-5" />
            <span className="font-medium">Magazynki</span>
          </button>

          <button 
            onClick={() => setCurrentView('groups')}
            className={`flex items-center gap-3 w-full p-3 rounded-lg transition ${currentView === 'groups' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <Settings className="w-5 h-5" />
            <span className="font-medium">Grupy Projektowe</span>
          </button>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={() => setCurrentView('operator')}
            className="flex items-center gap-3 w-full p-3 rounded-lg text-yellow-400 hover:bg-slate-800 transition border border-dashed border-slate-700"
          >
            <Wrench className="w-5 h-5" />
            <span className="font-medium">Tryb Operatora</span>
          </button>
          
          <button className="flex items-center gap-3 w-full p-3 mt-2 rounded-lg text-slate-400 hover:text-white transition">
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Wyloguj</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Mobile Header */}
        <div className="md:hidden bg-slate-900 text-white p-4 flex justify-between items-center">
             <h1 className="font-bold">MagazynMaster</h1>
             <button onClick={() => setCurrentView('operator')}><Wrench className="w-5 h-5"/></button>
        </div>

        <div className="p-8">
          {currentView === 'dashboard' && <Dashboard magazines={magazines} groups={groups} defects={defects} />}
          {currentView === 'magazines' && (
            <MagazineList 
              magazines={magazines} 
              groups={groups} 
              defects={defects}
              maintenanceLogs={maintenanceLogs}
              onUpdateMagazine={handleUpdateMagazine}
              onAddMagazine={handleAddMagazine}
              onReportDefect={handleNavigateToOperator}
              onRepairMagazine={handleRepairMagazine}
            />
          )}
          {currentView === 'groups' && (
            <ProjectGroups 
                groups={groups} 
                onAddGroup={handleAddGroup}
                onUpdateGroup={handleUpdateGroup}
                onDeleteGroup={handleDeleteGroup}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;