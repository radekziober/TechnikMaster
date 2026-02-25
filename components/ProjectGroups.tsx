import React, { useState } from 'react';
import { ProjectGroup, ProjectGroupType, MagazineType } from '../types';
import { Layers, Settings, Ruler, Plus, X, Save, Trash2, Check, Box } from 'lucide-react';

interface ProjectGroupsProps {
  groups: ProjectGroup[];
  onAddGroup: (group: ProjectGroup) => void;
  onUpdateGroup: (group: ProjectGroup) => void;
  onDeleteGroup: (groupId: string) => void;
}

const AVAILABLE_COLORS = [
    'bg-red-500', 'bg-orange-500', 'bg-amber-500', 'bg-yellow-400', 
    'bg-lime-500', 'bg-green-600', 'bg-emerald-500', 'bg-teal-500',
    'bg-cyan-500', 'bg-sky-500', 'bg-blue-600', 'bg-indigo-500', 
    'bg-violet-500', 'bg-purple-500', 'bg-fuchsia-500', 'bg-pink-500', 
    'bg-rose-500', 'bg-slate-500'
];

export const ProjectGroups: React.FC<ProjectGroupsProps> = ({ groups, onAddGroup, onUpdateGroup, onDeleteGroup }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<ProjectGroup | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<ProjectGroup>>({
      name: '',
      type: ProjectGroupType.OTHER,
      magazineType: MagazineType.CAB_SMALL,
      color: 'bg-gray-500',
      pcbWidthMm: 0,
      description: ''
  });

  const handleOpenCreate = () => {
      setEditingGroup(null);
      setFormData({
        name: '',
        type: ProjectGroupType.OTHER,
        magazineType: MagazineType.CAB_SMALL,
        color: 'bg-indigo-500',
        pcbWidthMm: 100,
        description: ''
      });
      setIsModalOpen(true);
  };

  const handleOpenEdit = (group: ProjectGroup) => {
      setEditingGroup(group);
      setFormData({ ...group });
      setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
      e.preventDefault();
      
      if (editingGroup) {
          // Update existing
          onUpdateGroup({
              ...editingGroup,
              name: formData.name!,
              type: formData.type!,
              magazineType: formData.magazineType!,
              color: formData.color!,
              pcbWidthMm: Number(formData.pcbWidthMm),
              description: formData.description!
          });
      } else {
          // Create new
          const newGroup: ProjectGroup = {
              id: `g${Date.now()}`,
              name: formData.name!,
              type: formData.type!,
              magazineType: formData.magazineType || MagazineType.CAB_SMALL,
              color: formData.color!,
              pcbWidthMm: Number(formData.pcbWidthMm),
              description: formData.description!
          };
          onAddGroup(newGroup);
      }
      setIsModalOpen(false);
  };

  const handleDelete = () => {
      if (editingGroup && window.confirm(`Czy na pewno chcesz usunąć grupę "${editingGroup.name}"?`)) {
          onDeleteGroup(editingGroup.id);
          setIsModalOpen(false);
      }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Layers className="w-6 h-6" />
          Grupy Projektowe
        </h2>
        <button 
            onClick={handleOpenCreate}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition flex items-center gap-2 shadow-md"
        >
          <Plus className="w-5 h-5" />
          Nowa Grupa
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {groups.map((group) => (
          <div key={group.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition flex flex-col h-full">
            <div className={`h-3 w-full ${group.color}`}></div>
            <div className="p-5 flex-1">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg text-gray-800">{group.name}</h3>
                <span className="text-xs font-semibold px-2 py-1 bg-gray-100 text-gray-600 rounded">
                  {group.type}
                </span>
              </div>
              <p className="text-sm text-gray-500 mb-4 line-clamp-2">{group.description}</p>
              
              <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-2 rounded-lg">
                    <Ruler className="w-4 h-4 text-indigo-500" />
                    <span>Szerokość PCB: <strong>{group.pcbWidthMm} mm</strong></span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-2 rounded-lg">
                    <Box className="w-4 h-4 text-orange-500" />
                    <span>Typ: <strong>{group.magazineType}</strong></span>
                  </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3 border-t border-gray-100 flex justify-end">
              <button 
                onClick={() => handleOpenEdit(group)}
                className="text-sm text-indigo-600 font-medium hover:text-indigo-800 flex items-center gap-1"
              >
                <Settings className="w-4 h-4" />
                Edytuj ustawienia
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-fade-in-up">
                <div className="bg-slate-900 text-white p-4 flex justify-between items-center">
                    <h3 className="font-bold text-lg">
                        {editingGroup ? 'Edycja Grupy Projektowej' : 'Nowa Grupa Projektowa'}
                    </h3>
                    <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white transition">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                
                <form onSubmit={handleSave} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nazwa Grupy</label>
                        <input 
                            type="text" 
                            className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                            value={formData.name}
                            onChange={e => setFormData({...formData, name: e.target.value})}
                            required
                            placeholder="np. VW Golf 8"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Typ Projektu</label>
                            <select 
                                className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                value={formData.type}
                                onChange={e => setFormData({...formData, type: e.target.value as ProjectGroupType})}
                            >
                                {Object.values(ProjectGroupType).map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Rodzaj Magazynka</label>
                            <select 
                                className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                value={formData.magazineType}
                                onChange={e => setFormData({...formData, magazineType: e.target.value as MagazineType})}
                            >
                                {Object.values(MagazineType).map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Szerokość PCB (mm)</label>
                        <input 
                            type="number" 
                            className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                            value={formData.pcbWidthMm}
                            onChange={e => setFormData({...formData, pcbWidthMm: Number(e.target.value)})}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Kolor Oznaczenia</label>
                        <div className="grid grid-cols-9 gap-2">
                            {AVAILABLE_COLORS.map(colorClass => (
                                <button
                                    key={colorClass}
                                    type="button"
                                    onClick={() => setFormData({...formData, color: colorClass})}
                                    className={`w-8 h-8 rounded-full ${colorClass} flex items-center justify-center transition hover:scale-110 ${formData.color === colorClass ? 'ring-2 ring-offset-2 ring-slate-900 scale-110' : ''}`}
                                >
                                    {formData.color === colorClass && <Check className="w-4 h-4 text-white drop-shadow-md" />}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Opis</label>
                        <textarea 
                            className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                            rows={3}
                            value={formData.description}
                            onChange={e => setFormData({...formData, description: e.target.value})}
                            placeholder="Dodatkowe informacje o grupie..."
                        ></textarea>
                    </div>

                    <div className="flex justify-between pt-4 border-t border-gray-100 mt-4">
                        {editingGroup ? (
                            <button 
                                type="button"
                                onClick={handleDelete}
                                className="px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition flex items-center gap-2"
                            >
                                <Trash2 className="w-4 h-4" />
                                Usuń
                            </button>
                        ) : <div></div>}

                        <div className="flex gap-3">
                            <button 
                                type="button"
                                onClick={() => setIsModalOpen(false)}
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
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};