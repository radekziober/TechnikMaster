import React, { useState, useEffect } from 'react';
import { Magazine, DEFECT_TYPES } from '../types';
import { Scan, AlertTriangle, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';

interface OperatorViewProps {
  magazines: Magazine[];
  onReportSubmit: (magazineId: string, defects: string[], description: string) => void;
  onExit: () => void;
  initialMagazineId?: string;
}

export const OperatorView: React.FC<OperatorViewProps> = ({ magazines, onReportSubmit, onExit, initialMagazineId }) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [scannedId, setScannedId] = useState('');
  const [selectedMagazine, setSelectedMagazine] = useState<Magazine | null>(null);
  const [selectedDefects, setSelectedDefects] = useState<string[]>([]);
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  // Auto-fill from props if available
  useEffect(() => {
    if (initialMagazineId) {
        setScannedId(initialMagazineId);
        const found = magazines.find(m => m.name.toLowerCase() === initialMagazineId.toLowerCase() || m.id === initialMagazineId);
        if (found) {
            setSelectedMagazine(found);
            setStep(2);
            setError('');
        }
    }
  }, [initialMagazineId, magazines]);

  const handleScan = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate finding logic
    const found = magazines.find(m => m.name.toLowerCase() === scannedId.toLowerCase() || m.id === scannedId);
    
    if (found) {
        setSelectedMagazine(found);
        setStep(2);
        setError('');
    } else {
        setError('Nie znaleziono magazynka o podanym kodzie. Spróbuj $1001');
    }
  };

  const toggleDefect = (defect: string) => {
    if (selectedDefects.includes(defect)) {
        setSelectedDefects(selectedDefects.filter(d => d !== defect));
    } else {
        setSelectedDefects([...selectedDefects, defect]);
    }
  };

  const handleSubmit = () => {
    if (selectedMagazine) {
        onReportSubmit(selectedMagazine.id, selectedDefects, description);
        setStep(3);
    }
  };

  const resetForm = () => {
    setStep(1);
    setScannedId('');
    setSelectedMagazine(null);
    setSelectedDefects([]);
    setDescription('');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-slate-800 text-white p-6 flex justify-between items-center">
            <h1 className="text-2xl font-bold flex items-center gap-2">
                <AlertTriangle className="w-6 h-6 text-yellow-400" />
                Zgłoszenie Usterki
            </h1>
            <button onClick={onExit} className="text-slate-400 hover:text-white text-sm">Wyjście</button>
        </div>

        <div className="p-8">
            {/* Steps Progress */}
            <div className="flex items-center justify-between mb-8 px-4">
                <div className={`flex flex-col items-center ${step >= 1 ? 'text-indigo-600' : 'text-gray-300'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold mb-1 ${step >= 1 ? 'bg-indigo-100' : 'bg-gray-100'}`}>1</div>
                    <span className="text-xs">Skanowanie</span>
                </div>
                <div className="flex-1 h-1 bg-gray-200 mx-4">
                    <div className={`h-full bg-indigo-600 transition-all ${step >= 2 ? 'w-full' : 'w-0'}`}></div>
                </div>
                <div className={`flex flex-col items-center ${step >= 2 ? 'text-indigo-600' : 'text-gray-300'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold mb-1 ${step >= 2 ? 'bg-indigo-100' : 'bg-gray-100'}`}>2</div>
                    <span className="text-xs">Szczegóły</span>
                </div>
                <div className="flex-1 h-1 bg-gray-200 mx-4">
                    <div className={`h-full bg-indigo-600 transition-all ${step >= 3 ? 'w-full' : 'w-0'}`}></div>
                </div>
                <div className={`flex flex-col items-center ${step >= 3 ? 'text-indigo-600' : 'text-gray-300'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold mb-1 ${step >= 3 ? 'bg-indigo-100' : 'bg-gray-100'}`}>3</div>
                    <span className="text-xs">Gotowe</span>
                </div>
            </div>

            {/* Step 1: Scan */}
            {step === 1 && (
                <div className="space-y-6 text-center">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Scan className="w-10 h-10 text-gray-500" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800">Zeskanuj kod DataMatrix</h2>
                    <p className="text-gray-500">Użyj skanera ręcznego lub wpisz kod magazynka ręcznie (np. $1001).</p>
                    
                    <form onSubmit={handleScan} className="max-w-xs mx-auto">
                        <input 
                            type="text" 
                            className="w-full text-center text-2xl font-mono tracking-wider p-3 border-2 border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none uppercase"
                            placeholder="$XXXX"
                            value={scannedId}
                            onChange={(e) => setScannedId(e.target.value)}
                            autoFocus
                        />
                        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                        <button type="submit" className="w-full mt-4 bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 transition">
                            Dalej
                        </button>
                    </form>
                </div>
            )}

            {/* Step 2: Details */}
            {step === 2 && selectedMagazine && (
                <div className="space-y-6">
                    <div className="bg-indigo-50 p-4 rounded-lg flex items-center justify-between">
                        <div>
                            <span className="text-xs text-indigo-500 font-bold uppercase tracking-wide">Wybrany Magazynek</span>
                            <p className="text-2xl font-bold text-indigo-900">{selectedMagazine.name}</p>
                        </div>
                        <button onClick={() => setStep(1)} className="text-sm text-indigo-600 underline">Zmień</button>
                    </div>

                    <div>
                        <h3 className="font-bold text-gray-800 mb-3">Wybierz rodzaj usterki:</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {DEFECT_TYPES.map(defect => (
                                <label key={defect} className={`
                                    flex items-center p-3 rounded-lg border-2 cursor-pointer transition
                                    ${selectedDefects.includes(defect) ? 'border-indigo-500 bg-indigo-50' : 'border-gray-100 hover:border-indigo-200'}
                                `}>
                                    <input 
                                        type="checkbox" 
                                        className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                                        checked={selectedDefects.includes(defect)}
                                        onChange={() => toggleDefect(defect)}
                                    />
                                    <span className="ml-3 text-gray-700 font-medium">{defect}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="font-bold text-gray-800 mb-2">Dodatkowy opis (opcjonalnie):</h3>
                        <textarea 
                            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                            rows={3}
                            placeholder="Wpisz szczegóły uszkodzenia..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        ></textarea>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button onClick={() => setStep(1)} className="flex-1 py-3 border border-gray-300 rounded-lg font-bold text-gray-600 hover:bg-gray-50">
                            Wstecz
                        </button>
                        <button 
                            onClick={handleSubmit} 
                            disabled={selectedDefects.length === 0}
                            className={`flex-1 py-3 rounded-lg font-bold text-white transition ${selectedDefects.length === 0 ? 'bg-gray-300 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700 shadow-lg shadow-red-200'}`}
                        >
                            Zgłoś Usterkę
                        </button>
                    </div>
                </div>
            )}

            {/* Step 3: Success */}
            {step === 3 && (
                <div className="text-center space-y-6 py-8">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600">
                        <CheckCircle className="w-12 h-12" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Zgłoszenie przyjęte</h2>
                        <p className="text-gray-500 mt-2">Dziękujemy. Usterka została zaraportowana do działu technicznego.</p>
                    </div>
                    <button onClick={resetForm} className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-indigo-700 transition">
                        Zgłoś kolejną
                    </button>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};