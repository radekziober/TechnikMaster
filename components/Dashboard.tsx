import React from 'react';
import { Magazine, ProjectGroup, DefectReport } from '../types';
import { AlertCircle, Wrench, CheckCircle2, Clock } from 'lucide-react';

interface DashboardProps {
  magazines: Magazine[];
  groups: ProjectGroup[];
  defects: DefectReport[];
}

export const Dashboard: React.FC<DashboardProps> = ({ magazines, groups, defects }) => {
  const totalMagazines = magazines.length;
  const maintenanceOverdue = magazines.filter(m => new Date(m.nextMaintenanceDate) < new Date()).length;
  const activeDefects = defects.filter(d => d.status !== 'RESOLVED').length;
  


  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Panel Główny (Technik)</h2>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
                <p className="text-sm text-gray-500 mb-1">Wszystkie magazynki</p>
                <p className="text-3xl font-bold text-gray-800">{totalMagazines}</p>
            </div>
            <div className="p-3 bg-indigo-50 rounded-full text-indigo-600">
                <CheckCircle2 className="w-6 h-6" />
            </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
                <p className="text-sm text-gray-500 mb-1">Otwarte zgłoszenia</p>
                <p className="text-3xl font-bold text-red-600">{activeDefects}</p>
            </div>
            <div className="p-3 bg-red-50 rounded-full text-red-600">
                <Wrench className="w-6 h-6" />
            </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
                <p className="text-sm text-gray-500 mb-1">Po terminie przeglądu</p>
                <p className="text-3xl font-bold text-orange-600">{maintenanceOverdue}</p>
            </div>
            <div className="p-3 bg-orange-50 rounded-full text-orange-600">
                <Clock className="w-6 h-6" />
            </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
                <p className="text-sm text-gray-500 mb-1">Konserwacja (30 dni)</p>
                <p className="text-3xl font-bold text-blue-600">
                    {magazines.filter(m => {
                        const next = new Date(m.nextMaintenanceDate);
                        const now = new Date();
                        const diffTime = Math.abs(next.getTime() - now.getTime());
                        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
                        return diffDays <= 30 && next > now;
                    }).length}
                </p>
            </div>
            <div className="p-3 bg-blue-50 rounded-full text-blue-600">
                <AlertCircle className="w-6 h-6" />
            </div>
        </div>
      </div>



      {/* Recent Alerts Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-bold text-gray-800">Ostatnie zgłoszenia usterek</h3>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
                <thead className="bg-gray-50 text-gray-900 font-medium">
                    <tr>
                        <th className="px-6 py-3">ID Magazynka</th>
                        <th className="px-6 py-3">Usterka</th>
                        <th className="px-6 py-3">Zgłaszający</th>
                        <th className="px-6 py-3">Data</th>
                        <th className="px-6 py-3">Status</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {defects.length === 0 ? (
                        <tr><td colSpan={5} className="px-6 py-4 text-center">Brak nowych zgłoszeń</td></tr>
                    ) : defects.map(defect => {
                        const mag = magazines.find(m => m.id === defect.magazineId);
                        return (
                            <tr key={defect.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 font-bold text-gray-900">{mag?.name || 'Unknown'}</td>
                                <td className="px-6 py-4">{defect.defects.join(', ')}</td>
                                <td className="px-6 py-4">{defect.operatorName}</td>
                                <td className="px-6 py-4">{new Date(defect.reportedAt).toLocaleDateString()}</td>
                                <td className="px-6 py-4"><span className="px-2 py-1 bg-red-100 text-red-600 rounded-full text-xs font-bold">NOWE</span></td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};
