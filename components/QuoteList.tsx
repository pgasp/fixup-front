import React, { useState, useMemo } from 'react';
import { Quote, Client, QuoteStatus, Appointment } from '../types';
// FIX: Add missing CalendarIcon and WrenchIcon imports.
import { FileTextIcon, PencilIcon, TrashIcon, CheckCircleIcon, XIcon, SearchIcon, ClockIcon, PaperPlaneIcon, CalendarIcon, WrenchIcon, ClipboardCheckIcon } from './icons';

interface QuoteListProps {
  quotes: Quote[];
  clients: Client[];
  appointments: Appointment[];
  onEdit: (quote: Quote) => void;
  onDelete: (quoteId: string) => void;
  onView: (quote: Quote) => void;
  onChangeStatus: (quoteId: string) => void;
  onSchedule: (quote: Quote) => void;
  onCreateRepairOrder: (quoteId: string) => void;
}

const statusConfig: { [key in QuoteStatus]: { text: string; color: string; icon?: React.FC<{className?:string}> } } = {
    draft: { text: 'Brouillon', color: 'text-gray-500 bg-gray-100 dark:text-gray-400 dark:bg-gray-700', icon: FileTextIcon },
    ready_to_send: { text: 'Prêt pour envoi', color: 'text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900/50', icon: ClipboardCheckIcon },
    awaiting_part_pricing: { text: 'Attente cotation', color: 'text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/50', icon: ClockIcon },
    sent: { text: 'Envoyé', color: 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/50', icon: PaperPlaneIcon },
    approved: { text: 'Approuvé', color: 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/50', icon: CheckCircleIcon },
    rejected: { text: 'Rejeté', color: 'text-red-500 bg-red-100 dark:text-red-400 dark:bg-red-900/50', icon: XIcon },
};

const statusFilters: { value: QuoteStatus | 'all', label: string }[] = [
    { value: 'all', label: 'Tous' },
    { value: 'draft', label: 'Brouillons' },
    { value: 'ready_to_send', label: 'Prêts pour envoi' },
    { value: 'awaiting_part_pricing', label: 'Attente cotation' },
    { value: 'sent', label: 'Envoyés' },
    { value: 'approved', label: 'Approuvés' },
    { value: 'rejected', label: 'Rejetés' },
];


const QuoteList: React.FC<QuoteListProps> = ({ quotes, clients, appointments, onEdit, onView, onDelete, onChangeStatus, onSchedule, onCreateRepairOrder }) => {
    const [filter, setFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState<QuoteStatus | 'all'>('all');
    const [showArchived, setShowArchived] = useState(false);
    const [sort, setSort] = useState<{key: 'quoteNumber' | 'date' | 'clientName', direction: 'asc' | 'desc'}>({key: 'date', direction: 'desc'});

    const clientMap = useMemo(() => new Map(clients.map(c => [c.id, c])), [clients]);

    const calculateTotal = (quote: Quote) => {
        const subtotal = quote.laborItems.reduce((acc, labor) => {
            const laborCost = labor.hours * labor.rate;
            const partsCost = labor.partItems.reduce((pAcc, part) => pAcc + (part.quantity * part.unitPrice), 0);
            return acc + laborCost + partsCost;
        }, 0);
        return subtotal * (1 + quote.taxRate / 100);
    };

    const sortedAndFilteredQuotes = useMemo(() => {
        return [...quotes]
            .filter(q => showArchived || !q.isConvertedToRepairOrder) // Hide converted quotes unless toggled
            .map(q => ({...q, clientName: clientMap.get(q.clientId)?.name || 'N/A', total: calculateTotal(q)}))
            .filter(q => {
                const searchMatch = q.quoteNumber.toLowerCase().includes(filter.toLowerCase()) || 
                                    q.clientName.toLowerCase().includes(filter.toLowerCase());
                const statusMatch = statusFilter === 'all' || q.status === statusFilter;
                return searchMatch && statusMatch;
            })
            .sort((a, b) => {
                const aVal = sort.key === 'clientName' ? a.clientName : a[sort.key as 'quoteNumber' | 'date'];
                const bVal = sort.key === 'clientName' ? b.clientName : b[sort.key as 'quoteNumber' | 'date'];
                if (aVal < bVal) return sort.direction === 'asc' ? -1 : 1;
                if (aVal > bVal) return sort.direction === 'asc' ? 1 : -1;
                return 0;
            });
    }, [quotes, filter, statusFilter, sort, clientMap, showArchived]);

  return (
    <div className="space-y-4">
        <div className="p-1 flex justify-between items-center gap-4">
            <div className="flex-grow relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <SearchIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input 
                    type="text" 
                    placeholder="Rechercher par N° de devis ou client..."
                    value={filter}
                    onChange={e => setFilter(e.target.value)}
                    className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow py-2 px-4 pl-10"
                />
            </div>
             <div className="flex items-center gap-2 flex-shrink-0">
                <label htmlFor="showArchivedToggle" className="text-sm font-medium text-gray-600 dark:text-gray-400 whitespace-nowrap">Afficher archivés</label>
                <button
                    id="showArchivedToggle"
                    role="switch"
                    aria-checked={showArchived}
                    onClick={() => setShowArchived(!showArchived)}
                    className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-900 focus:ring-blue-500 ${showArchived ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'}`}
                >
                    <span
                        aria-hidden="true"
                        className={`inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${showArchived ? 'translate-x-5' : 'translate-x-0'}`}
                    />
                </button>
            </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 px-1">
            {statusFilters.map(filter => (
                <button
                    key={filter.value}
                    onClick={() => setStatusFilter(filter.value)}
                    className={`px-4 py-1.5 text-sm font-semibold rounded-full transition-colors ${
                        statusFilter === filter.value
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'bg-white dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
                    }`}
                >
                    {filter.label}
                </button>
            ))}
        </div>
        
        <ul className="space-y-3">
            {sortedAndFilteredQuotes.length > 0 ? sortedAndFilteredQuotes.map(quote => {
                const Icon = statusConfig[quote.status].icon;
                const quoteAppointment = appointments.find(a => a.quoteId === quote.id);
                const isEditable = quote.status === 'draft' || quote.status === 'awaiting_part_pricing';
                return (
                    <li key={quote.id} className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${quote.isConvertedToRepairOrder ? 'opacity-60' : ''}`}>
                        <div className="flex-grow">
                            <p className="font-bold text-lg text-gray-900 dark:text-white">{quote.quoteNumber}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-300">{quote.clientName}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Date: {new Date(quote.date).toLocaleDateString()}</p>
                        </div>
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
                            <div className="flex sm:flex-col items-start sm:items-end gap-2">
                                <p className="font-mono text-lg font-semibold text-blue-600 dark:text-blue-400">{quote.total.toFixed(2)}€</p>
                                <button 
                                    onClick={(e) => { e.stopPropagation(); onChangeStatus(quote.id); }}
                                    title="Changer le statut"
                                    className={`inline-flex items-center gap-1.5 cursor-pointer transition-opacity hover:opacity-80 text-xs font-medium px-3 py-1 rounded-full ${statusConfig[quote.status].color}`}>
                                    {Icon && <Icon className="w-3.5 h-3.5"/>}
                                    {statusConfig[quote.status].text}
                                </button>
                            </div>
                            
                            <div className="flex items-center justify-end gap-1 border-t sm:border-t-0 sm:border-l border-gray-200 dark:border-gray-700 pt-3 sm:pt-0 sm:pl-3">
                                {quote.status === 'approved' && !quote.isConvertedToRepairOrder && !quoteAppointment && (
                                    <button onClick={() => onSchedule(quote)} className="p-2 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" title="Planifier l'intervention"><CalendarIcon className="h-5 w-5"/></button>
                                )}
                                 {quote.status === 'approved' && !quote.isConvertedToRepairOrder && quoteAppointment && (
                                    <button onClick={() => onCreateRepairOrder(quote.id)} className="p-2 text-gray-500 hover:text-green-600 dark:hover:text-green-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" title="Créer la fiche de réparation"><WrenchIcon className="h-5 w-5"/></button>
                                )}
                                <button onClick={() => onView(quote)} className="p-2 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" title="Voir le devis"><FileTextIcon className="h-5 w-5"/></button>
                                <button 
                                    onClick={() => onEdit(quote)} 
                                    disabled={!isEditable}
                                    className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                                        isEditable
                                        ? 'text-gray-500 hover:text-green-600 dark:hover:text-green-400'
                                        : 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                                    }`}
                                    title={isEditable ? "Modifier" : "Ce devis ne peut plus être modifié"}
                                >
                                    <PencilIcon className="h-5 w-5"/>
                                </button>
                                <button onClick={() => onDelete(quote.id)} className="p-2 text-gray-500 hover:text-red-500 dark:hover:text-red-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" title="Supprimer"><TrashIcon className="h-5 w-5"/></button>
                            </div>
                        </div>
                    </li>
                )
            }) : (
                <div className="text-center py-16 px-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                    <FileTextIcon className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500"/>
                    <h3 className="text-xl font-semibold mt-4">Aucun devis trouvé</h3>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">Ajustez vos filtres ou créez un nouveau devis.</p>
                </div>
            )}
        </ul>
    </div>
  );
};

export default QuoteList;