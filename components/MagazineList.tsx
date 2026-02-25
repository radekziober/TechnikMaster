import React, { useState } from 'react';
import { Magazine, ProjectGroup, MagazineStatus, DefectReport, MaintenanceLog } from '../types';
import { formatDate } from '../services/mockData';
import { Plus, Search, Filter, QrCode, AlertTriangle, MapPin, Calendar, CheckCircle, X, Save, History, FileText, PenTool, CalendarClock, Activity, Factory, AlertCircle, Printer, Wrench } from 'lucide-react';

interface MagazineListProps {
  magazines: Magazine[];
  groups: ProjectGroup[];
  defects: DefectReport[];
  maintenanceLogs: MaintenanceLog[];
  onUpdateMagazine: (magazine: Magazine) => void;
  onAddMagazine: (magazine: Magazine) => void;
  onReportDefect: (magazineName: string) => void;
  onRepairMagazine: (magazineId: string, description: string) => void;
}

export const MagazineList: React.FC<MagazineListProps> = ({ magazines, groups, defects, maintenanceLogs, onUpdateMagazine, onAddMagazine, onReportDefect, onRepairMagazine }) => {
  const [filter, setFilter] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [editingMagazine, setEditingMagazine] = useState<Magazine | null>(null);
  const [historyMagazine, setHistoryMagazine] = useState<Magazine | null>(null);
  
  // State for maintenance scheduling
  const [maintenanceMagazine, setMaintenanceMagazine] = useState<Magazine | null>(null);
  const [newMaintenanceDate, setNewMaintenanceDate] = useState('');

  // State for repair
  const [repairMagazine, setRepairMagazine] = useState<Magazine | null>(null);
  const [repairDescription, setRepairDescription] = useState('');

  // State for full details view
  const [detailsMagazine, setDetailsMagazine] = useState<Magazine | null>(null);

  // State for DataMatrix modal
  const [qrCodeMagazine, setQrCodeMagazine] = useState<Magazine | null>(null);

  const filteredMagazines = magazines.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(filter.toLowerCase()) || m.lastLocation.toLowerCase().includes(filter.toLowerCase());
    const matchesGroup = selectedGroup === 'all' || m.groupId === selectedGroup;
    return matchesSearch && matchesGroup;
  });

  const getStatusBadge = (status: MagazineStatus) => {
    switch (status) {
      case MagazineStatus.OK: return <span className="px-2 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 flex items-center gap-1 w-fit"><CheckCircle className="w-3 h-3"/> OK</span>;
      case MagazineStatus.DAMAGED: return <span className="px-2 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 flex items-center gap-1 w-fit"><AlertTriangle className="w-3 h-3"/> AWARIA</span>;
      case MagazineStatus.IN_MAINTENANCE: return <span className="px-2 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700 w-fit">SERWIS</span>;
      default: return <span className="px-2 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-600 w-fit">INNY</span>;
    }
  };

  const getGroupColor = (groupId: string) => {
    const group = groups.find(g => g.id === groupId);
    return group ? group.color : 'bg-gray-400';
  };

  const getMaintenanceStatus = (dateStr: string) => {
    if (!dateStr) return { status: 'ok', days: 0, label: 'Brak daty' };
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(dateStr);
    target.setHours(0, 0, 0, 0);
    
    // Difference in milliseconds
    const diffTime = target.getTime() - today.getTime();
    // Difference in days
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { status: 'overdue', days: Math.abs(diffDays), label: `Po terminie ${Math.abs(diffDays)} dni` };
    } else if (diffDays <= 30) {
      return { status: 'warning', days: diffDays, label: `Za ${diffDays} dni` };
    } else {
      return { status: 'ok', days: diffDays, label: formatDate(dateStr) };
    }
  };

  const handleOpenCreate = () => {
    setEditingMagazine({
        id: '', // Empty ID signifies new creation
        name: '$',
        groupId: groups[0]?.id || '',
        status: MagazineStatus.OK,
        lastLocation: 'Magazyn Główny',
        lastMaintenanceDate: new Date().toISOString().split('T')[0],
        nextMaintenanceDate: '', // Will be calculated or set by user
        manufacturingDate: new Date().toISOString().split('T')[0],
        maintenanceCycleMonths: 6
    });
  };

  const handleSaveEdit = (e: React.FormEvent) => {
      e.preventDefault();
      if (editingMagazine) {
          if (editingMagazine.id === '') {
              // Creating new
              const newMag = {
                  ...editingMagazine,
                  id: `m${Date.now()}`,
              };
              onAddMagazine(newMag);
          } else {
              // Updating existing
              onUpdateMagazine(editingMagazine);
          }
          setEditingMagazine(null);
      }
  };

  const handleOpenMaintenance = (mag: Magazine) => {
    setMaintenanceMagazine(mag);
    setNewMaintenanceDate(mag.nextMaintenanceDate);
  };

  const handleSaveMaintenance = (e: React.FormEvent) => {
    e.preventDefault();
    if (maintenanceMagazine && newMaintenanceDate) {
        onUpdateMagazine({
            ...maintenanceMagazine,
            nextMaintenanceDate: newMaintenanceDate
        });
        setMaintenanceMagazine(null);
    }
  };

  const handleOpenRepair = (mag: Magazine) => {
    setRepairMagazine(mag);
    setRepairDescription('');
  };

  const handleSaveRepair = (e: React.FormEvent) => {
    e.preventDefault();
    if (repairMagazine && repairDescription) {
        onRepairMagazine(repairMagazine.id, repairDescription);
        setRepairMagazine(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Magazynki (Handling Units)</h2>
          <p className="text-gray-500 text-sm">Zarządzanie stanem i lokalizacją nośników</p>
        </div>
        <button 
            onClick={handleOpenCreate}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition flex items-center gap-2 shadow-md"
        >
          <Plus className="w-5 h-5" />
          Dodaj Magazynek
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Szukaj po nazwie ($xxxx) lub lokalizacji..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="text-gray-400 w-5 h-5" />
          <select 
            className="border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
          >
            <option value="all">Wszystkie Grupy</option>
            {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
          </select>
        </div>
      </div>

      {/* Table View */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
                <thead className="bg-gray-50 text-gray-900 font-medium border-b border-gray-200">
                    <tr>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Nazwa (Kod)</th>
                        <th className="px-6 py-4">Grupa Projektowa</th>
                        <th className="px-6 py-4">Lokalizacja</th>
                        <th className="px-6 py-4">Termin Konserwacji</th>
                        <th className="px-6 py-4 text-right">Akcje</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {filteredMagazines.length === 0 ? (
                        <tr>
                            <td colSpan={6} className="px-6 py-8 text-center text-gray-400 italic">
                                Nie znaleziono magazynków spełniających kryteria.
                            </td>
                        </tr>
                    ) : (
                        filteredMagazines.map((mag) => {
                            const group = groups.find(g => g.id === mag.groupId);
                            const maintenanceInfo = getMaintenanceStatus(mag.nextMaintenanceDate);

                            return (
                                <tr 
                                    key={mag.id} 
                                    onClick={() => setDetailsMagazine(mag)}
                                    className="hover:bg-gray-50 cursor-pointer transition group"
                                >
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {getStatusBadge(mag.status)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-1.5 h-8 rounded-full ${getGroupColor(mag.groupId)}`}></div>
                                            <div>
                                                <div className="font-bold text-gray-900 text-base">{mag.name}</div>
                                                <div className="text-xs text-gray-400 flex items-center gap-1 hover:text-indigo-600" 
                                                     onClick={(e) => { e.stopPropagation(); setQrCodeMagazine(mag); }}>
                                                    <QrCode className="w-3 h-3"/> Pokaż QR
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="font-medium text-gray-700 block">{group?.name}</span>
                                        <span className="text-xs text-gray-500">{group?.magazineType}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1.5">
                                            <MapPin className="w-4 h-4 text-gray-400" />
                                            {mag.lastLocation}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className={`flex items-center gap-2 font-medium ${
                                            maintenanceInfo.status === 'overdue' ? 'text-red-600' : 
                                            maintenanceInfo.status === 'warning' ? 'text-orange-600' : 'text-gray-700'
                                        }`}>
                                            {maintenanceInfo.status === 'overdue' ? <AlertCircle className="w-4 h-4" /> : <Calendar className="w-4 h-4" />}
                                            {formatDate(mag.nextMaintenanceDate)}
                                        </div>
                                        {maintenanceInfo.status !== 'ok' && (
                                            <span className="text-xs font-bold ml-6 block">
                                                {maintenanceInfo.label}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            
                                            {/* Repair Button - Visible if damaged */}
                                            {mag.status !== MagazineStatus.OK && (
                                                <button 
                                                    onClick={() => handleOpenRepair(mag)}
                                                    className="p-2 text-white bg-green-600 hover:bg-green-700 rounded-lg transition shadow-sm"
                                                    title="Wykonaj naprawę"
                                                >
                                                    <Wrench className="w-4 h-4" />
                                                </button>
                                            )}

                                            <button 
                                                onClick={() => handleOpenMaintenance(mag)}
                                                className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                                                title="Planuj Konserwację"
                                            >
                                                <CalendarClock className="w-4 h-4" />
                                            </button>
                                            <button 
                                                onClick={() => setEditingMagazine(mag)}
                                                className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                                                title="Edytuj"
                                            >
                                                <PenTool className="w-4 h-4" />
                                            </button>
                                            <button 
                                                onClick={() => setHistoryMagazine(mag)}
                                                className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                                                title="Historia"
                                            >
                                                <History className="w-4 h-4" />
                                            </button>
                                            <button 
                                                onClick={() => onReportDefect(mag.name)}
                                                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                                                title="Zgłoś Usterkę"
                                            >
                                                <AlertTriangle className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })
                    )}
                </tbody>
            </table>
        </div>
      </div>

      {/* Edit/Add Modal */}
      {editingMagazine && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-fade-in-up">
                <div className="bg-slate-900 text-white p-4 flex justify-between items-center">
                    <h3 className="font-bold text-lg">
                        {editingMagazine.id ? `Edycja Magazynka ${editingMagazine.name}` : 'Nowy Magazynek'}
                    </h3>
                    <button onClick={() => setEditingMagazine(null)} className="text-slate-400 hover:text-white transition">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                
                <form onSubmit={handleSaveEdit} className="p-6 space-y-4">
                    {/* Only show Name input if creating new */}
                    {!editingMagazine.id && (
                         <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nazwa Magazynka (Kod)</label>
                            <input 
                                type="text" 
                                className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                                value={editingMagazine.name}
                                onChange={e => setEditingMagazine({...editingMagazine, name: e.target.value})}
                                placeholder="$1234"
                                required
                            />
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                            <select 
                                className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                                value={editingMagazine.status}
                                onChange={e => setEditingMagazine({...editingMagazine, status: e.target.value as MagazineStatus})}
                            >
                                {Object.values(MagazineStatus).map(status => (
                                    <option key={status} value={status}>{status}</option>
                                ))}
                            </select>
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Grupa Projektowa</label>
                            <select 
                                className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                                value={editingMagazine.groupId}
                                onChange={e => setEditingMagazine({...editingMagazine, groupId: e.target.value})}
                            >
                                {groups.map(g => (
                                    <option key={g.id} value={g.id}>{g.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Lokalizacja (MES)</label>
                        <input 
                            type="text" 
                            className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                            value={editingMagazine.lastLocation}
                            onChange={e => setEditingMagazine({...editingMagazine, lastLocation: e.target.value})}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Ost. Konserwacja</label>
                            <input 
                                type="date" 
                                className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                                value={editingMagazine.lastMaintenanceDate}
                                onChange={e => setEditingMagazine({...editingMagazine, lastMaintenanceDate: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nast. Konserwacja</label>
                            <input 
                                type="date" 
                                className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                                value={editingMagazine.nextMaintenanceDate}
                                onChange={e => setEditingMagazine({...editingMagazine, nextMaintenanceDate: e.target.value})}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                         <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Data Produkcji</label>
                            <input 
                                type="date" 
                                className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                                value={editingMagazine.manufacturingDate}
                                onChange={e => setEditingMagazine({...editingMagazine, manufacturingDate: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Cykl (m-ce)</label>
                            <input 
                                type="number" 
                                className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                                value={editingMagazine.maintenanceCycleMonths}
                                onChange={e => setEditingMagazine({...editingMagazine, maintenanceCycleMonths: Number(e.target.value)})}
                                min={1}
                            />
                        </div>
                    </div>
                    
                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-4">
                        <button 
                            type="button"
                            onClick={() => setEditingMagazine(null)}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                        >
                            Anuluj
                        </button>
                        <button 
                            type="submit"
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 shadow-sm flex items-center gap-2 transition"
                        >
                            <Save className="w-4 h-4" />
                            {editingMagazine.id ? 'Zapisz zmiany' : 'Dodaj Magazynek'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}

      {/* Maintenance Schedule Modal */}
      {maintenanceMagazine && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden animate-fade-in-up">
                 <div className="bg-slate-900 text-white p-4 flex justify-between items-center">
                    <h3 className="font-bold text-lg">Planowanie Konserwacji</h3>
                    <button onClick={() => setMaintenanceMagazine(null)} className="text-slate-400 hover:text-white transition">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <form onSubmit={handleSaveMaintenance} className="p-6 space-y-4">
                    <p className="text-sm text-gray-600">
                        Ustaw datę następnego przeglądu dla magazynka <span className="font-bold text-gray-800">{maintenanceMagazine.name}</span>.
                    </p>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Data Konserwacji</label>
                        <input 
                            type="date" 
                            className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                            value={newMaintenanceDate}
                            onChange={e => setNewMaintenanceDate(e.target.value)}
                            required
                        />
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                         <button 
                            type="button"
                            onClick={() => setMaintenanceMagazine(null)}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                        >
                            Anuluj
                        </button>
                        <button 
                            type="submit"
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 shadow-sm flex items-center gap-2 transition"
                        >
                            <Save className="w-4 h-4" />
                            Zapisz
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}

      {/* Repair Report Modal */}
      {repairMagazine && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-fade-in-up">
                 <div className="bg-green-700 text-white p-4 flex justify-between items-center">
                    <h3 className="font-bold text-lg flex items-center gap-2">
                        <Wrench className="w-5 h-5" />
                        Raport Naprawy
                    </h3>
                    <button onClick={() => setRepairMagazine(null)} className="text-green-200 hover:text-white transition">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <form onSubmit={handleSaveRepair} className="p-6 space-y-4">
                    <div className="bg-green-50 border border-green-200 p-3 rounded-lg text-sm text-green-800 mb-4">
                        Naprawa magazynka <strong>{repairMagazine.name}</strong>. Po zatwierdzeniu status zostanie zmieniony na <strong>OK</strong>, a powiązane usterki zostaną zamknięte.
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Opis wykonanych czynności</label>
                        <textarea 
                            className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                            rows={4}
                            value={repairDescription}
                            onChange={e => setRepairDescription(e.target.value)}
                            placeholder="Np. Wymieniono uszkodzone rączki, wyprostowano geometrię..."
                            required
                        ></textarea>
                    </div>
                    
                    <div className="flex justify-end gap-3 pt-2">
                         <button 
                            type="button"
                            onClick={() => setRepairMagazine(null)}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                        >
                            Anuluj
                        </button>
                        <button 
                            type="submit"
                            className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 shadow-sm flex items-center gap-2 transition"
                        >
                            <CheckCircle className="w-4 h-4" />
                            Zatwierdź Naprawę
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}

      {/* QR Code / DataMatrix Modal */}
      {qrCodeMagazine && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-md">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden flex flex-col items-center animate-fade-in-up">
                <div className="bg-slate-900 w-full text-white p-4 flex justify-between items-center">
                    <h3 className="font-bold text-lg">Kod DataMatrix</h3>
                    <button onClick={() => setQrCodeMagazine(null)} className="text-slate-400 hover:text-white transition">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                
                <div className="p-8 flex flex-col items-center space-y-4">
                    <div className="bg-white p-4 rounded-lg border-4 border-gray-900 shadow-inner">
                        <QrCode className="w-48 h-48 text-gray-900" />
                    </div>
                    <div className="text-center">
                        <h2 className="text-3xl font-mono font-bold text-gray-800 tracking-wider border-b-2 border-indigo-100 pb-1 mb-2">
                            {qrCodeMagazine.name}
                        </h2>
                        <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold">Kod Skanowania</p>
                    </div>
                    
                    <button className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 text-sm font-medium mt-2">
                         <Printer className="w-4 h-4" />
                         Drukuj Etykietę
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* Full Details Modal */}
      {detailsMagazine && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-md">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
                <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6 flex justify-between items-start flex-shrink-0">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h2 className="text-3xl font-bold tracking-tight">{detailsMagazine.name}</h2>
                            <div className="bg-white/20 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm border border-white/10">
                                {groups.find(g => g.id === detailsMagazine.groupId)?.name}
                            </div>
                        </div>
                        <p className="text-slate-300 text-sm flex items-center gap-2 opacity-80">
                            <Factory className="w-4 h-4" />
                            Data produkcji: {formatDate(detailsMagazine.manufacturingDate)}
                        </p>
                    </div>
                    <button 
                        onClick={() => setDetailsMagazine(null)} 
                        className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition text-white"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="overflow-y-auto p-8 space-y-8 bg-gray-50/50">
                    {/* Top Overview Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">Status</span>
                            {getStatusBadge(detailsMagazine.status)}
                        </div>
                         <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">Lokalizacja</span>
                            <div className="flex items-center gap-2 text-gray-800 font-medium">
                                <MapPin className="w-5 h-5 text-indigo-500" />
                                {detailsMagazine.lastLocation}
                            </div>
                        </div>
                        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">Cykl Konserwacji</span>
                            <div className="flex items-center gap-2 text-gray-800 font-medium">
                                <Activity className="w-5 h-5 text-blue-500" />
                                co {detailsMagazine.maintenanceCycleMonths} miesięcy
                            </div>
                        </div>
                        
                        {/* Maintenance Card in Details */}
                        {(() => {
                           const status = getMaintenanceStatus(detailsMagazine.nextMaintenanceDate);
                           return (
                             <div className={`bg-white p-4 rounded-xl shadow-sm border border-gray-100 ${status.status !== 'ok' ? 'ring-2 ring-offset-1 ' + (status.status === 'overdue' ? 'ring-red-500' : 'ring-orange-400') : ''}`}>
                                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">Termin Przeglądu</span>
                                <div className={`flex items-center gap-2 font-bold ${
                                    status.status === 'overdue' ? 'text-red-600' : 
                                    status.status === 'warning' ? 'text-orange-600' : 'text-green-600'
                                }`}>
                                    {status.status === 'overdue' ? <AlertCircle className="w-5 h-5" /> : <Calendar className="w-5 h-5" />}
                                    {formatDate(detailsMagazine.nextMaintenanceDate)}
                                </div>
                                {status.status !== 'ok' && (
                                    <p className={`text-xs mt-1 font-medium ${status.status === 'overdue' ? 'text-red-500' : 'text-orange-500'}`}>
                                        {status.label}
                                    </p>
                                )}
                            </div>
                           );
                        })()}

                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Maintenance Logs */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full">
                            <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
                                <FileText className="w-5 h-5 text-blue-500" />
                                <h3 className="font-bold text-gray-800">Historia Konserwacji</h3>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-100">
                                        <tr>
                                            <th className="px-4 py-2">Data</th>
                                            <th className="px-4 py-2">Typ</th>
                                            <th className="px-4 py-2">Opis</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {maintenanceLogs.filter(l => l.magazineId === detailsMagazine.id).length === 0 ? (
                                            <tr><td colSpan={3} className="px-4 py-6 text-center text-gray-400 italic">Brak wpisów w dzienniku</td></tr>
                                        ) : (
                                            maintenanceLogs.filter(l => l.magazineId === detailsMagazine.id)
                                            .sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                                            .map(log => (
                                                <tr key={log.id} className="hover:bg-gray-50 transition">
                                                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{formatDate(log.date)}</td>
                                                    <td className="px-4 py-3">
                                                         <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wide ${
                                                            log.type === 'PREVENTIVE' ? 'bg-blue-50 text-blue-700 border border-blue-100' : 'bg-orange-50 text-orange-700 border border-orange-100'
                                                        }`}>
                                                            {log.type === 'PREVENTIVE' ? 'PRZEGLĄD' : 'NAPRAWA'}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 text-gray-700">{log.description}</td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                         {/* Defect History */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full">
                            <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5 text-red-500" />
                                <h3 className="font-bold text-gray-800">Zgłoszone Usterki</h3>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-100">
                                        <tr>
                                            <th className="px-4 py-2">Data</th>
                                            <th className="px-4 py-2">Usterka</th>
                                            <th className="px-4 py-2">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {defects.filter(d => d.magazineId === detailsMagazine.id).length === 0 ? (
                                            <tr><td colSpan={3} className="px-4 py-6 text-center text-gray-400 italic">Brak zgłoszonych usterek</td></tr>
                                        ) : (
                                            defects.filter(d => d.magazineId === detailsMagazine.id)
                                            .sort((a,b) => new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime())
                                            .map(defect => (
                                                <tr key={defect.id} className="hover:bg-gray-50 transition">
                                                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{formatDate(defect.reportedAt)}</td>
                                                    <td className="px-4 py-3">
                                                        <div className="font-medium text-gray-800">{defect.defects.join(', ')}</div>
                                                        <div className="text-xs text-gray-500 truncate max-w-[150px]">{defect.description}</div>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wide ${
                                                            defect.status === 'NEW' ? 'bg-red-50 text-red-700 border border-red-100' :
                                                            defect.status === 'RESOLVED' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-yellow-50 text-yellow-700 border border-yellow-100'
                                                        }`}>
                                                            {defect.status === 'NEW' ? 'NOWE' : defect.status === 'RESOLVED' ? 'ZROBIONE' : 'W TOKU'}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-4 border-t border-gray-200 bg-gray-100 flex justify-end">
                    <button 
                        onClick={() => setDetailsMagazine(null)}
                        className="px-6 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition shadow-sm"
                    >
                        Zamknij podgląd
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};