import React, { useState, useEffect } from 'react';
import { RepairOrder, Client, Vehicle, RepairOrderStatus, Invoice, Technician, Settings } from '../types';
import { CarIcon, UsersIcon, CalendarIcon, FileTextIcon, WrenchIcon, CheckCircleIcon, ClipboardCheckIcon, TrashIcon, ClockIcon, DocumentSearchIcon, ReceiptTaxIcon } from './icons';

interface RepairOrderViewProps {
  order: RepairOrder | null;
  client: Client | null;
  vehicle: Vehicle | null;
  settings: Settings;
  invoice?: Invoice;
  technicians: Technician[];
  onUpdateStatus: (orderId: string, status: RepairOrderStatus) => void;
  onAddInspection: (orderId: string) => void;
  onGenerateInvoice: (orderId: string) => void;
  onViewInvoice: (invoice: Invoice) => void;
  onAssignTechnician: (orderId: string, technicianId: string) => void;
  onSaveNotes: (orderId: string, notes: string) => void;
  onSaveMileage: (orderId: string, mileage: number) => void;
}

const statusConfig: { [key in RepairOrderStatus]: { text: string; icon: React.FC<any>; color: string; } } = {
    'scheduled': { text: 'Programmé', icon: CalendarIcon, color: 'text-gray-500 dark:text-gray-400' },
    'workshop_entry': { text: 'Entrée Atelier', icon: ClipboardCheckIcon, color: 'text-blue-500 dark:text-blue-400' },
    'diagnosis_complete': { text: 'Diagnostic Terminé', icon: DocumentSearchIcon, color: 'text-indigo-500 dark:text-indigo-400' },
    'in_progress': { text: 'En Cours', icon: WrenchIcon, color: 'text-yellow-500 dark:text-yellow-400' },
    'waiting_for_part': { text: 'En Attente de Pièce', icon: ClockIcon, color: 'text-orange-500 dark:text-orange-400' },
    'completed': { text: 'Terminée', icon: CheckCircleIcon, color: 'text-green-500 dark:text-green-400' },
    'waiting_for_invoicing': { text: 'Facturation en attente', icon: ReceiptTaxIcon, color: 'text-teal-500 dark:text-teal-400' },
    'invoiced': { text: 'Facturée', icon: ReceiptTaxIcon, color: 'text-purple-500 dark:text-purple-400' },
    'cancelled': { text: 'Annulée', icon: TrashIcon, color: 'text-red-500 dark:text-red-400' },
};

const lifecycleSteps: RepairOrderStatus[] = [
    'scheduled', 
    'workshop_entry', 
    'diagnosis_complete', 
    'in_progress', 
    'completed', 
    'waiting_for_invoicing',
    'invoiced',
];

const RepairOrderView: React.FC<RepairOrderViewProps> = ({ order, client, vehicle, settings, onUpdateStatus, onAddInspection, onGenerateInvoice, invoice, onViewInvoice, technicians, onAssignTechnician, onSaveNotes, onSaveMileage }) => {
  const [notes, setNotes] = useState(order?.notes || '');
  const [mileage, setMileage] = useState(order?.mileage || '');

  useEffect(() => {
    setNotes(order?.notes || '');
    setMileage(order?.mileage || '');
  }, [order]);
  
  const handleSaveNotes = () => {
      onSaveNotes(order!.id, notes);
  };
  
  const handleSaveMileage = () => {
    const mileageNumber = parseInt(String(mileage), 10);
    if (order && !isNaN(mileageNumber)) {
        onSaveMileage(order.id, mileageNumber);
    }
  };


  if (!order || !client || !vehicle) {
    return <div className="text-center p-8">Chargement des données de la fiche...</div>;
  }

  const { quote } = order;
  const subtotal = quote.laborItems.reduce((acc, labor) => acc + (labor.hours * labor.rate) + labor.partItems.reduce((pAcc, part) => pAcc + (part.quantity * part.unitPrice), 0), 0);
  const taxAmount = subtotal * (quote.taxRate / 100);
  const total = subtotal + taxAmount;
  const currentStatusConfig = statusConfig[order.status];
  
  const activeStatusForLifecycle = order.status === 'waiting_for_part' ? 'in_progress' : order.status;
  const currentIndex = lifecycleSteps.indexOf(activeStatusForLifecycle);

  const renderActions = () => {
    switch (order.status) {
        case 'scheduled': return <button onClick={() => onUpdateStatus(order.id, 'workshop_entry')} className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700">Confirmer l'entrée atelier</button>;
        case 'workshop_entry': return <div className="flex flex-col sm:flex-row gap-2">{!order.inspectionReport && (<button onClick={() => onAddInspection(order.id)} className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Faire l'état des lieux</button>)}<button onClick={() => onUpdateStatus(order.id, 'diagnosis_complete')} className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700">Commencer le diagnostic</button></div>;
        case 'diagnosis_complete': return <button onClick={() => onUpdateStatus(order.id, 'in_progress')} className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700">Commencer la réparation</button>;
        case 'in_progress': return <div className="flex flex-col sm:flex-row gap-2"><button onClick={() => onUpdateStatus(order.id, 'waiting_for_part')} className="px-4 py-2 text-sm bg-orange-500 text-white rounded-md hover:bg-orange-600">Mettre en attente (pièce)</button><button onClick={() => onUpdateStatus(order.id, 'completed')} className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700">Marquer comme terminée</button></div>;
        case 'waiting_for_part': return <button onClick={() => onUpdateStatus(order.id, 'in_progress')} className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700">Reprendre la réparation</button>;
        case 'completed': return <button onClick={() => onUpdateStatus(order.id, 'waiting_for_invoicing')} className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700">Préparer pour facturation</button>;
        case 'waiting_for_invoicing': return <button onClick={() => onGenerateInvoice(order.id)} className="px-4 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700">Clôturer et Générer la Facture</button>;
        case 'invoiced': return invoice ? <button onClick={() => onViewInvoice(invoice)} className="px-4 py-2 text-sm bg-purple-600 text-white rounded-md hover:bg-purple-700">Voir la Facture {invoice.invoiceNumber}</button> : null;
        default: return null;
    }
  }


  return (
    <div className="text-sm text-gray-800 dark:text-gray-200">
      <header className="flex justify-between items-start p-6 bg-gray-50 dark:bg-gray-900/50 rounded-t-lg">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">FICHE DE RÉPARATION</h1>
          <p className="font-mono text-gray-600 dark:text-gray-400">{quote.quoteNumber.replace('DEV', 'FICHE')}</p>
        </div>
        <div className="text-right flex items-start gap-4">
          <div className="flex-shrink-0">
              {settings.logo && <img src={settings.logo} alt="Logo" className="h-16 w-auto object-contain"/>}
          </div>
          <div>
            <h2 className="text-xl font-bold text-blue-600 dark:text-blue-400">{settings.garageName}</h2>
          </div>
        </div>
      </header>
      
      <section className="p-6 bg-gray-100 dark:bg-gray-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <currentStatusConfig.icon className={`h-8 w-8 ${currentStatusConfig.color}`} />
          <div>
            <p className="text-gray-500 dark:text-gray-400 uppercase text-xs font-bold">Statut</p>
            <p className={`text-xl font-bold ${currentStatusConfig.color}`}>{currentStatusConfig.text}</p>
          </div>
        </div>
        <div className="flex-shrink-0">
          {renderActions()}
        </div>
      </section>

      <section className="p-6 border-y border-gray-200 dark:border-gray-700">
          <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
              Suivi de progression
          </h3>
          <div className="flex items-center">
              {lifecycleSteps.map((step, index) => {
                  const isCompleted = index < currentIndex;
                  const isActive = index === currentIndex;
                  const isWaiting = order.status === 'waiting_for_part' && step === 'in_progress';
                  const stepConfig = statusConfig[step];
                  const Icon = isCompleted ? CheckCircleIcon : stepConfig.icon;
                  
                  let colorClass = 'text-gray-400 dark:text-gray-600';
                  if(isCompleted) colorClass = 'text-blue-600 dark:text-blue-400';
                  if(isActive) colorClass = stepConfig.color;
                  if(isWaiting) colorClass = statusConfig['waiting_for_part'].color;

                  return (
                      <React.Fragment key={step}>
                          <div className="flex flex-col items-center text-center w-24">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isActive ? 'bg-blue-100 dark:bg-blue-900/50' : ''} ${isWaiting ? 'bg-orange-100 dark:bg-orange-900/50' : ''}`}>
                                  {isWaiting ? <ClockIcon className={`h-6 w-6 ${colorClass}`} /> : <Icon className={`h-6 w-6 ${colorClass}`} />}
                              </div>
                              <p className={`mt-2 text-xs font-semibold ${colorClass}`}>{stepConfig.text}</p>
                          </div>
                          {index < lifecycleSteps.length - 1 && (
                              <div className={`flex-grow h-1 rounded ${isCompleted || isActive ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-700'}`}></div>
                          )}
                      </React.Fragment>
                  )
              })}
          </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6 border-b border-gray-200 dark:border-gray-700">
        <div>
            <h3 className="font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2"><UsersIcon className="h-5 w-5"/> Client</h3>
            <p className="font-bold">{client.name}</p>
            <p>{client.phone}</p>
        </div>
        <div>
            <h3 className="font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2"><CarIcon className="h-5 w-5"/> Véhicule</h3>
            <p className="font-bold">{vehicle.make} {vehicle.model}</p>
            <p>Immatriculation: {vehicle.licensePlate}</p>
        </div>
        <div>
            <h3 className="font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2"><UsersIcon className="h-5 w-5"/> Technicien</h3>
            <select 
                value={order.technicianId || ''} 
                onChange={(e) => onAssignTechnician(order.id, e.target.value)}
                className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 text-sm"
            >
                <option value="">Non assigné</option>
                {technicians.map(tech => (
                    <option key={tech.id} value={tech.id}>{tech.name}</option>
                ))}
            </select>
        </div>
         <div>
            <h3 className="font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2"><CarIcon className="h-5 w-5"/> Kilométrage</h3>
            <div className="flex items-center gap-2">
                <input 
                    type="number"
                    value={mileage}
                    onChange={(e) => setMileage(e.target.value)}
                    placeholder="Km"
                    className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 text-sm"
                />
                {Number(mileage) !== order.mileage && (
                    <button onClick={handleSaveMileage} className="px-3 py-2 text-xs bg-green-600 text-white rounded-md hover:bg-green-700">OK</button>
                )}
            </div>
        </div>
      </section>

      {order.inspectionReport && (
          <section className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2"><ClipboardCheckIcon className="h-5 w-5"/> État des lieux d'entrée</h3>
              <ul className="list-disc list-inside">
                  {order.inspectionReport.items.map(item => <li key={item.id}>{item.description}</li>)}
              </ul>
              {order.inspectionReport.notes && <p className="mt-2 text-sm italic">Notes: {order.inspectionReport.notes}</p>}
          </section>
      )}

       <section className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Notes d'Atelier</h3>
            <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 text-sm"
                placeholder="Ajouter des notes internes sur la réparation..."
            />
            {notes !== (order.notes || '') && (
                <div className="text-right mt-2">
                    <button onClick={handleSaveNotes} className="px-4 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700">Sauvegarder les notes</button>
                </div>
            )}
       </section>
      
      <section className="p-6">
        <h3 className="font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2"><FileTextIcon className="h-5 w-5"/> Détails du devis associé</h3>
        <table className="w-full mt-2">
            <thead className="border-b-2 border-gray-300 dark:border-gray-600">
                <tr className="text-left text-gray-600 dark:text-gray-300">
                    <th className="py-2 font-semibold">Description</th>
                    <th className="py-2 font-semibold text-right">Total HT</th>
                </tr>
            </thead>
            <tbody>
                {quote.laborItems.map(labor => (
                    <React.Fragment key={labor.id}>
                        <tr className="font-semibold bg-gray-50 dark:bg-gray-800/50">
                            <td className="py-2 pl-2">{labor.description} (Main d'œuvre)</td>
                            <td className="py-2 text-right">{(labor.hours * labor.rate).toFixed(2)}€</td>
                        </tr>
                        {labor.partItems.map(part => (
                            <tr key={part.id}>
                                <td className="py-1 pl-8">{part.description}</td>
                                <td className="py-1 text-right">{(part.quantity * part.unitPrice).toFixed(2)}€</td>
                            </tr>
                        ))}
                    </React.Fragment>
                ))}
            </tbody>
            <tfoot>
                <tr className="font-bold border-t-2 border-gray-300 dark:border-gray-600">
                    <td className="py-2 text-right">TOTAL TTC</td>
                    <td className="py-2 text-right text-blue-600 dark:text-blue-400 text-lg">{total.toFixed(2)}€</td>
                </tr>
            </tfoot>
        </table>
      </section>
    </div>
  );
};

export default RepairOrderView;