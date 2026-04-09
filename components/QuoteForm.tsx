// FIX: Provide full implementation for the QuoteForm component.
import React, { useState, useEffect } from 'react';
import { Quote, Client, Vehicle, LaborTask, PartItem, InterventionTemplate, Part, QuoteStatus } from '../types';
import Modal from './Modal';
import { PlusIcon, TrashIcon, SearchIcon } from './icons';
import { suggestDescription } from '../services/geminiService';

interface QuoteFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (quote: Quote) => void;
  clients: Client[];
  interventionTemplates: InterventionTemplate[];
  parts: Part[];
  existingQuote?: Quote | null;
  nextQuoteNumber: string;
}

const emptyLaborTask: Omit<LaborTask, 'id' | 'partItems'> = { description: '', hours: 1, rate: 50 };
const emptyPartItem: Omit<PartItem, 'id'> = { partId: '', description: '', quantity: 1, unitPrice: 0 };

const calculatePartSellingPrice = (part: Part): number => {
    if (part.pricingMethod === 'markup' && part.markupPercentage) {
        return part.purchasePrice * (1 + part.markupPercentage / 100);
    }
    return part.sellingPrice || 0;
};

const QuoteForm: React.FC<QuoteFormProps> = ({ isOpen, onClose, onSave, clients, interventionTemplates, parts, existingQuote, nextQuoteNumber }) => {
  const [quote, setQuote] = useState<Omit<Quote, 'id' | 'quoteNumber' | 'status' | 'statusHistory' | 'laborItems'> & { laborItems: LaborTask[] }>({
    clientId: '', vehicleId: '', date: new Date().toISOString().split('T')[0], validityDuration: 30, taxRate: 20, laborItems: []
  });
  const [selectedClientVehicles, setSelectedClientVehicles] = useState<Vehicle[]>([]);
  const [aiLoading, setAiLoading] = useState<number | null>(null);
  const [licensePlateSearch, setLicensePlateSearch] = useState('');

  const isLocked = existingQuote && !['draft', 'awaiting_part_pricing'].includes(existingQuote.status);

  useEffect(() => {
    if (isOpen) {
      if (existingQuote) {
        setQuote({ ...existingQuote, date: new Date(existingQuote.date).toISOString().split('T')[0] });
        const client = clients.find(c => c.id === existingQuote.clientId);
        setSelectedClientVehicles(client?.vehicles || []);
      } else {
        setQuote({ clientId: '', vehicleId: '', date: new Date().toISOString().split('T')[0], validityDuration: 30, taxRate: 20, laborItems: [{...emptyLaborTask, id: crypto.randomUUID(), partItems: []}] });
        setSelectedClientVehicles([]);
      }
      setLicensePlateSearch('');
    }
  }, [existingQuote, isOpen, clients]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'clientId') {
      const client = clients.find(c => c.id === value);
      setSelectedClientVehicles(client?.vehicles || []);
      setQuote(prev => ({ ...prev, [name]: value, vehicleId: '' }));
    } else {
      setQuote(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleVehicleSearch = () => {
    if (!licensePlateSearch.trim()) return;
    const plate = licensePlateSearch.trim().toUpperCase();
    
    let foundClient: Client | undefined;
    let foundVehicle: Vehicle | undefined;

    for (const client of clients) {
        const vehicle = client.vehicles.find(v => v.licensePlate.toUpperCase() === plate);
        if (vehicle) {
            foundClient = client;
            foundVehicle = vehicle;
            break;
        }
    }

    if (foundClient && foundVehicle) {
        setSelectedClientVehicles(foundClient.vehicles);
        setQuote(prev => ({ 
            ...prev, 
            clientId: foundClient!.id, 
            vehicleId: foundVehicle!.id 
        }));
    } else {
        alert(`Aucun véhicule trouvé avec la plaque d'immatriculation : ${plate}`);
    }
  };


  const handleLaborChange = (index: number, field: keyof Omit<LaborTask, 'id' | 'partItems'>, value: string | number) => {
    const newItems = [...quote.laborItems];
    (newItems[index] as any)[field] = value;
    setQuote(prev => ({...prev, laborItems: newItems}));
  };
  
  const handlePartChange = (laborIndex: number, partIndex: number, field: keyof Omit<PartItem, 'id'>, value: any) => {
      const newItems = [...quote.laborItems];
      const partItems = [...newItems[laborIndex].partItems];
      (partItems[partIndex] as any)[field] = value;
      newItems[laborIndex].partItems = partItems;
      setQuote(prev => ({...prev, laborItems: newItems}));
  };

  const handlePartSelect = (laborIndex: number, partIndex: number, partId: string) => {
    const part = parts.find(p => p.id === partId);
    const newItems = [...quote.laborItems];
    const partItems = [...newItems[laborIndex].partItems];
    if(part){
        const isPreOrder = part.stock <= 0;
        partItems[partIndex] = { 
            ...partItems[partIndex], 
            partId, 
            description: part.name, 
            reference: part.reference,
            unitPrice: isPreOrder ? 0 : calculatePartSellingPrice(part),
            isPreOrder,
            preOrderStatus: isPreOrder ? 'pending_pricing' : undefined,
            supplier: part.supplier,
            supplierReference: '',
        };
    } else {
        partItems[partIndex] = { ...partItems[partIndex], partId: '', description: '', unitPrice: 0 };
    }
    newItems[laborIndex].partItems = partItems;
    setQuote(prev => ({...prev, laborItems: newItems}));
  };
  
  const addLaborTask = () => setQuote(prev => ({...prev, laborItems: [...prev.laborItems, {...emptyLaborTask, id: crypto.randomUUID(), partItems: []}]}));
  const removeLaborTask = (index: number) => setQuote(prev => ({...prev, laborItems: prev.laborItems.filter((_, i) => i !== index)}));
  
  const addPartItem = (laborIndex: number, isPreOrder = false) => {
      const newItems = [...quote.laborItems];
      newItems[laborIndex].partItems.push({
          ...emptyPartItem, 
          id: crypto.randomUUID(),
          partId: isPreOrder ? 'CUSTOM_PART' : '',
          isPreOrder,
          preOrderStatus: isPreOrder ? 'pending_pricing' : undefined,
          supplier: '',
          supplierReference: '',
      });
      setQuote(prev => ({...prev, laborItems: newItems}));
  };
  const removePartItem = (laborIndex: number, partIndex: number) => {
      const newItems = [...quote.laborItems];
      newItems[laborIndex].partItems = newItems[laborIndex].partItems.filter((_, i) => i !== partIndex);
      setQuote(prev => ({...prev, laborItems: newItems}));
  };

  const handleUseTemplate = (templateId: string) => {
    if (!templateId) return;
    const template = interventionTemplates.find(t => t.id === templateId);
    if (!template) return;
    const newLaborItems = template.laborItems.map(task => ({
        ...task,
        id: crypto.randomUUID(),
        partItems: task.partItems.map(part => ({ ...part, id: crypto.randomUUID() }))
    }));
    setQuote(prev => ({...prev, laborItems: [...prev.laborItems.filter(l => l.description), ...newLaborItems]}));
  };
  
  const handleAiSuggest = async (index: number) => {
      const prompt = quote.laborItems[index].description;
      if (!prompt) return;
      setAiLoading(index);
      try {
          const suggestion = await suggestDescription(prompt);
          handleLaborChange(index, 'description', suggestion);
      } catch (error) {
          console.error("AI suggestion failed", error);
          alert("La suggestion de l'IA a échoué.");
      } finally {
          setAiLoading(null);
      }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quote.clientId || !quote.vehicleId) {
        alert("Veuillez sélectionner un client et un véhicule.");
        return;
    }

    const cleanedLaborItems = quote.laborItems
      .filter(l => l.description)
      .map(l => ({
          ...l,
          partItems: l.partItems.filter(p => p.partId || (p.isPreOrder && p.description))
      }));

    const hasPendingPreOrders = cleanedLaborItems.some(l => 
        l.partItems.some(p => p.isPreOrder && p.preOrderStatus === 'pending_pricing')
    );
    
    let newStatus: QuoteStatus = existingQuote?.status || 'draft';
    if (newStatus === 'awaiting_part_pricing' && !hasPendingPreOrders) {
        newStatus = 'draft';
    }

    const quoteToSave: Quote = {
      id: existingQuote?.id || crypto.randomUUID(),
      quoteNumber: existingQuote?.quoteNumber || nextQuoteNumber,
      status: newStatus,
      statusHistory: existingQuote?.statusHistory || [{ status: newStatus, date: new Date().toISOString() }],
      ...quote,
      laborItems: cleanedLaborItems,
    };

    if (existingQuote?.status !== newStatus && !quoteToSave.statusHistory.find(h => h.status === newStatus)) {
        quoteToSave.statusHistory.push({ status: newStatus, date: new Date().toISOString() });
    }

    onSave(quoteToSave);
  };

  const subtotal = quote.laborItems.reduce((acc, labor) => {
    const laborCost = labor.hours * labor.rate;
    const partsCost = labor.partItems.reduce((pAcc, part) => pAcc + (part.quantity * part.unitPrice), 0);
    return acc + laborCost + partsCost;
  }, 0);
  const taxAmount = subtotal * (quote.taxRate / 100);
  const total = subtotal + taxAmount;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={existingQuote ? `Modifier Devis ${existingQuote.quoteNumber}` : `Nouveau Devis ${nextQuoteNumber}`}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {isLocked && (
            <div className="p-4 mb-4 text-center bg-yellow-100 dark:bg-yellow-900/50 border border-yellow-300 dark:border-yellow-700 rounded-lg">
                <p className="font-semibold text-yellow-800 dark:text-yellow-200">Ce devis est verrouillé et ne peut plus être modifié.</p>
            </div>
        )}
        <fieldset disabled={isLocked}>
            <div>
                <h3 className="font-semibold text-lg mb-2">Recherche Rapide</h3>
                <div className="flex gap-2 items-center p-4 border dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                <input
                    type="text"
                    value={licensePlateSearch}
                    onChange={(e) => setLicensePlateSearch(e.target.value.toUpperCase())}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleVehicleSearch(); } }}
                    placeholder="Rechercher par plaque d'immatriculation..."
                    className="flex-grow bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3"
                />
                <button
                    type="button"
                    onClick={handleVehicleSearch}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md flex items-center gap-2"
                >
                    <SearchIcon className="h-5 w-5" />
                    Rechercher
                </button>
                </div>
                <div className="text-center my-4 text-sm text-gray-500 font-semibold">OU</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <select name="clientId" value={quote.clientId} onChange={handleChange} required className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3">
                    <option value="">Sélectionner un client</option>
                    {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <select name="vehicleId" value={quote.vehicleId} onChange={handleChange} required disabled={!quote.clientId} className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 disabled:bg-gray-200 dark:disabled:bg-gray-800">
                    <option value="">Sélectionner un véhicule</option>
                    {selectedClientVehicles.map(v => <option key={v.id} value={v.id}>{v.make} {v.model} ({v.licensePlate})</option>)}
                </select>
                <input name="date" type="date" value={quote.date} onChange={handleChange} required className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3"/>
                <input name="taxRate" type="number" value={quote.taxRate} onChange={e => setQuote(p => ({...p, taxRate: parseFloat(e.target.value) || 0}))} placeholder="TVA (%)" className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3"/>
            </div>
            
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-lg">Interventions</h3>
                    <select onChange={e => handleUseTemplate(e.target.value)} className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-1 px-2 text-sm">
                        <option value="">Utiliser un modèle</option>
                        {interventionTemplates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>
                </div>
                {quote.laborItems.map((labor, lIndex) => (
                    <div key={labor.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg space-y-3 bg-gray-50 dark:bg-gray-800/50">
                        <div className="flex justify-between items-start">
                            <p className="font-semibold text-gray-800 dark:text-gray-200">Tâche #{lIndex + 1}</p>
                            <button type="button" onClick={() => removeLaborTask(lIndex)} className="text-red-500 hover:text-red-400"><TrashIcon className="h-5 w-5"/></button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-2">
                            <div className="md:col-span-9">
                            <input type="text" placeholder="Description main d'oeuvre" value={labor.description} onChange={e => handleLaborChange(lIndex, 'description', e.target.value)} className="w-full text-sm p-1 rounded-md bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600" />
                            </div>
                            <div className="md:col-span-3">
                            <button type="button" onClick={() => handleAiSuggest(lIndex)} disabled={aiLoading === lIndex} className="w-full text-sm p-1 rounded-md bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-semibold hover:bg-blue-200 dark:hover:bg-blue-800 disabled:opacity-50">
                                {aiLoading === lIndex ? 'Génération...' : 'Suggérer (IA)'}
                            </button>
                            </div>
                            <div className="md:col-span-6"><input type="number" placeholder="Heures" value={labor.hours} step="0.1" onChange={e => handleLaborChange(lIndex, 'hours', parseFloat(e.target.value) || 0)} className="w-full text-sm p-1 rounded-md bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"/></div>
                            <div className="md:col-span-6"><input type="number" placeholder="Taux horaire" value={labor.rate} step="0.01" onChange={e => handleLaborChange(lIndex, 'rate', parseFloat(e.target.value) || 0)} className="w-full text-sm p-1 rounded-md bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"/></div>
                        </div>
                        <div className="pl-4 border-l-2 border-blue-300 dark:border-blue-700 space-y-2 pt-2">
                            {labor.partItems.map((part, pIndex) => (
                                <div key={part.id} className={`grid grid-cols-12 gap-2 items-center p-2 rounded-md ${part.isPreOrder ? 'bg-orange-50 dark:bg-orange-900/20' : ''}`}>
                                    {part.isPreOrder ? (
                                        <>
                                            <div className="col-span-12 sm:col-span-5"><input type="text" placeholder="Description pièce *" value={part.description} onChange={e => handlePartChange(lIndex, pIndex, 'description', e.target.value)} className="w-full text-sm p-1 rounded-md bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"/></div>
                                            <div className="col-span-12 sm:col-span-4"><input type="text" placeholder="Référence" value={part.reference} onChange={e => handlePartChange(lIndex, pIndex, 'reference', e.target.value)} className="w-full text-sm p-1 rounded-md bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"/></div>
                                        </>
                                    ) : (
                                        <div className="col-span-12 sm:col-span-9">
                                            <select value={part.partId} onChange={e => handlePartSelect(lIndex, pIndex, e.target.value)} className="w-full text-sm p-1 rounded-md bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600">
                                                <option value="">Sélectionner une pièce</option>
                                                {parts.map(p => <option key={p.id} value={p.id}>{p.name} ({p.reference}) - {p.stock} en stock</option>)}
                                            </select>
                                        </div>
                                    )}
                                    <div className="col-span-8 sm:col-span-2"><input type="number" placeholder="Qté" value={part.quantity} onChange={e => handlePartChange(lIndex, pIndex, 'quantity', parseInt(e.target.value, 10) || 0)} className="w-full text-sm p-1 rounded-md bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"/></div>
                                    <div className="col-span-4 sm:col-span-1 text-right"><button type="button" onClick={() => removePartItem(lIndex, pIndex)} className="text-red-500"><TrashIcon className="h-4 w-4"/></button></div>
                                </div>
                            ))}
                            <div className="flex gap-2">
                                <button type="button" onClick={() => addPartItem(lIndex)} className="text-sm flex items-center gap-1 text-green-600 dark:text-green-400 font-semibold"><PlusIcon className="h-4 w-4"/> Pièce en stock</button>
                                <button type="button" onClick={() => addPartItem(lIndex, true)} className="text-sm flex items-center gap-1 text-orange-600 dark:text-orange-400 font-semibold"><PlusIcon className="h-4 w-4"/> Pièce sur commande</button>
                            </div>
                        </div>
                    </div>
                ))}
                <button type="button" onClick={addLaborTask} className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold py-2"><PlusIcon/> Ajouter une tâche</button>
            </div>
        </fieldset>
        <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="w-full max-w-xs space-y-1 text-sm">
                <div className="flex justify-between"><span>SOUS-TOTAL HT</span><span className="font-mono">{subtotal.toFixed(2)}€</span></div>
                <div className="flex justify-between"><span>TVA ({quote.taxRate}%)</span><span className="font-mono">{taxAmount.toFixed(2)}€</span></div>
                <div className="flex justify-between font-bold text-base pt-1 border-t border-gray-300 dark:border-gray-600"><span>TOTAL TTC</span><span className="font-mono">{total.toFixed(2)}€</span></div>
            </div>
        </div>

        <div className="mt-8 flex justify-end gap-4">
          <button type="button" onClick={onClose} className="py-2 px-6 bg-gray-500 text-white rounded-md font-semibold">Annuler</button>
          <button type="submit" disabled={isLocked} className="py-2 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-semibold disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed">Sauvegarder</button>
        </div>
      </form>
    </Modal>
  );
};

export default QuoteForm;