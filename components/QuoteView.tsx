import React from 'react';
import { Quote, Client, Vehicle, QuoteStatus, Appointment, RepairOrder, Settings } from '../types';
import { CarIcon, UsersIcon, CalendarIcon, CheckCircleIcon } from './icons';
import { calculateQuoteSubtotal, calculateQuoteTaxAmount, calculateQuoteTotal } from '../domain/financial';
import { quoteStatusLifecycleConfig } from '../domain/status';

interface QuoteViewProps {
  quote: Quote | null;
  client: Client | null;
  vehicle: Vehicle | null;
  settings: Settings;
  appointment?: Appointment;
  repairOrder?: RepairOrder;
  onViewRepairOrder: (order: RepairOrder) => void;
  onViewInScheduler: () => void;
}

const QuoteView: React.FC<QuoteViewProps> = ({ quote, client, vehicle, settings, appointment, repairOrder, onViewRepairOrder, onViewInScheduler }) => {
  if (!quote || !client || !vehicle) {
    return <div className="text-center p-8">Chargement des données du devis...</div>;
  }

  const subtotal = calculateQuoteSubtotal(quote);
  const taxAmount = calculateQuoteTaxAmount(quote);
  const total = calculateQuoteTotal(quote);
  
  const sentEntry = quote.statusHistory.find(h => h.status === 'sent');
  const validityStartDate = sentEntry ? new Date(sentEntry.date) : new Date(quote.date);
  const expiryDate = new Date(validityStartDate);
  expiryDate.setDate(expiryDate.getDate() + quote.validityDuration);
  
  const findStatusDate = (status: QuoteStatus) => quote.statusHistory.find(h => h.status === status)?.date;
  
  const stepsToRender: QuoteStatus[] = ['draft'];
  const didAwaitPricing = quote.statusHistory.some(h => h.status === 'awaiting_part_pricing');
  if (didAwaitPricing) {
    stepsToRender.push('awaiting_part_pricing');
  }
  stepsToRender.push('ready_to_send', 'sent');

  if (quote.status === 'rejected') {
    stepsToRender.push('rejected');
  } else if (quote.status === 'approved' || quote.statusHistory.some(h => h.status === 'approved')) {
    stepsToRender.push('approved');
  }
  const currentIndex = stepsToRender.indexOf(quote.status);

  const allParts = quote.laborItems.flatMap(labor => labor.partItems);


  return (
    <div className="text-sm text-gray-800 dark:text-gray-200">
      <header className="flex justify-between items-start p-6 bg-gray-50 dark:bg-gray-900/50 rounded-t-lg">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">DEVIS</h1>
          <p className="font-mono text-gray-600 dark:text-gray-400">{quote.quoteNumber}</p>
        </div>
        <div className="text-right flex items-start gap-4">
            <div className="flex-shrink-0">
                {settings.logo && <img src={settings.logo} alt="Logo" className="h-16 w-auto object-contain"/>}
            </div>
            <div>
              <h2 className="text-xl font-bold text-blue-600 dark:text-blue-400">{settings.garageName}</h2>
              <p>{settings.address}</p>
              <p>{settings.postalCode} {settings.city}</p>
              <p>Tél: {settings.phone}</p>
            </div>
        </div>
      </header>

      {(repairOrder || appointment) && (
        <section className="p-4 bg-gray-100 dark:bg-gray-800 flex items-center justify-center gap-4 text-sm">
            {repairOrder ? (
                <div className="flex items-center gap-2">
                    <CheckCircleIcon className="h-5 w-5 text-green-500" />
                    <span>Ce devis a été converti en fiche de réparation.</span>
                    <button onClick={() => onViewRepairOrder(repairOrder)} className="font-semibold text-blue-600 hover:underline">
                        Voir la fiche N°{repairOrder.quote.quoteNumber.replace('DEV', 'FICHE')}
                    </button>
                </div>
            ) : appointment ? (
                <div className="flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5 text-blue-500" />
                    <span>Rendez-vous planifié le {new Date(appointment.start).toLocaleDateString()} à {new Date(appointment.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.</span>
                    <button onClick={onViewInScheduler} className="font-semibold text-blue-600 hover:underline">
                        Voir dans le planning
                    </button>
                </div>
            ) : null}
        </section>
      )}

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6 border-y border-gray-200 dark:border-gray-700">
        <div className="lg:col-span-1">
            <h3 className="font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2"><UsersIcon className="h-5 w-5"/> Client</h3>
            <p className="font-bold">{client.name}</p>
            <p>{client.address}</p>
            <p>{client.postalCode} {client.city}</p>
            <p>{client.phone}</p>
        </div>
        <div className="lg:col-span-1">
            <h3 className="font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2"><CarIcon className="h-5 w-5"/> Véhicule</h3>
            <p className="font-bold">{vehicle.make} {vehicle.model}</p>
            <p>Immatriculation: {vehicle.licensePlate}</p>
            {vehicle.vin && <p>VIN: {vehicle.vin}</p>}
        </div>
        <div className="lg:col-span-2">
            <h3 className="font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2"><CalendarIcon className="h-5 w-5"/> Cycle de vie et Dates</h3>
             <div className="mt-4 mb-6">
                 <p>Date du devis: {new Date(quote.date).toLocaleDateString()}</p>
                {sentEntry ? (
                  <p>Valable jusqu'au: {expiryDate.toLocaleDateString()}</p>
                ) : (
                  <p>Validité: {quote.validityDuration} jours après envoi</p>
                )}
            </div>

            <div className="flex items-start pt-4">
              {stepsToRender.map((step, index) => {
                  const isCompleted = index < currentIndex;
                  const isActive = index === currentIndex;
                  const stepConfig = quoteStatusLifecycleConfig[step];
                  const Icon = isCompleted ? CheckCircleIcon : stepConfig.icon;
                  const statusDate = findStatusDate(step);

                  let colorClass = 'text-gray-400 dark:text-gray-500';
                  if (isCompleted) colorClass = quoteStatusLifecycleConfig.sent.color;
                  if (isActive) colorClass = stepConfig.color;
                  if (isCompleted && (step === 'approved' || step === 'rejected')) {
                      colorClass = quoteStatusLifecycleConfig[step as QuoteStatus].color;
                  }


                  return (
                      <React.Fragment key={step}>
                          <div className="flex flex-col items-center text-center w-28 flex-shrink-0">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isActive ? 'bg-blue-100 dark:bg-blue-900/50' : ''}`}>
                                  <Icon className={`h-6 w-6 ${colorClass}`} />
                              </div>
                              <p className={`mt-2 text-xs font-semibold ${colorClass}`}>{stepConfig.text}</p>
                               {statusDate && (
                                  <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(statusDate).toLocaleDateString()}</p>
                               )}
                          </div>
                          {index < stepsToRender.length - 1 && (
                              <div className={`flex-grow h-1 rounded mt-5 ${isCompleted || isActive ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-700'}`}></div>
                          )}
                      </React.Fragment>
                  )
              })}
            </div>
        </div>
      </section>

      <section className="p-6">
          <table className="w-full">
            <thead className="border-b-2 border-gray-300 dark:border-gray-600">
                <tr className="text-left text-gray-600 dark:text-gray-300">
                    <th className="py-2 font-semibold">Description</th>
                    <th className="py-2 font-semibold text-center w-32">Quantité / Heures</th>
                    <th className="py-2 font-semibold text-right w-36">Prix U. / Taux HT</th>
                    <th className="py-2 font-semibold text-right w-36">Total HT</th>
                </tr>
            </thead>
            <tbody>
                {/* Section Main d'oeuvre */}
                <tr className="bg-gray-50 dark:bg-gray-800/50">
                    <td colSpan={4} className="pt-4 pb-2 px-2 font-bold text-base text-gray-800 dark:text-gray-200">Main d'œuvre</td>
                </tr>
                {quote.laborItems.length > 0 ? quote.laborItems.map(labor => (
                    <tr key={labor.id} className="border-b border-gray-100 dark:border-gray-700/50">
                        <td className="py-2 pl-4">{labor.description}</td>
                        <td className="py-2 text-center">{labor.hours.toFixed(2)}h</td>
                        <td className="py-2 text-right">{labor.rate.toFixed(2)}€/h</td>
                        <td className="py-2 text-right font-semibold">{(labor.hours * labor.rate).toFixed(2)}€</td>
                    </tr>
                )) : (
                     <tr><td colSpan={4} className="py-2 pl-4 text-sm text-gray-500 italic">Aucune main d'œuvre.</td></tr>
                )}

                {/* Section Pièces */}
                <tr className="bg-gray-50 dark:bg-gray-800/50">
                    <td colSpan={4} className="pt-4 pb-2 px-2 font-bold text-base text-gray-800 dark:text-gray-200">Pièces</td>
                </tr>
                {allParts.length > 0 ? allParts.map(part => (
                    <tr key={part.id} className="border-b border-gray-100 dark:border-gray-700/50">
                        <td className="py-2 pl-4">
                            {part.description}{' '}
                            {part.isPreOrder &&
                                (part.preOrderStatus === 'pending_pricing' ? (
                                    <span className="text-orange-500 text-xs">(Sur commande — cotation)</span>
                                ) : part.preOrderStatus === 'ordered' ? (
                                    <span className="text-amber-600 text-xs font-medium">(En attente livraison)</span>
                                ) : part.preOrderStatus === 'received' ? (
                                    <span className="text-green-600 text-xs font-medium">(Reçue)</span>
                                ) : (
                                    <span className="text-orange-500 text-xs">(Sur commande)</span>
                                ))}
                        </td>
                        <td className="py-2 text-center">{part.quantity}</td>
                        <td className="py-2 text-right">{part.preOrderStatus === 'pending_pricing' ? <span className="text-orange-500 italic">En attente</span> : `${part.unitPrice.toFixed(2)}€`}</td>
                        <td className="py-2 text-right font-semibold">{part.preOrderStatus === 'pending_pricing' ? <span className="text-orange-500 italic">...</span> : `${(part.quantity * part.unitPrice).toFixed(2)}€`}</td>
                    </tr>
                )) : (
                    <tr><td colSpan={4} className="py-2 pl-4 text-sm text-gray-500 italic">Aucune pièce.</td></tr>
                )}
            </tbody>
        </table>
      </section>

      <section className="flex justify-end p-6">
        <div className="w-full max-w-xs space-y-2">
            <div className="flex justify-between">
                <span className="font-semibold text-gray-600 dark:text-gray-300">SOUS-TOTAL HT</span>
                <span className="font-mono">{subtotal.toFixed(2)}€</span>
            </div>
            <div className="flex justify-between">
                <span className="font-semibold text-gray-600 dark:text-gray-300">TVA ({quote.taxRate}%)</span>
                <span className="font-mono">{taxAmount.toFixed(2)}€</span>
            </div>
             <div className="flex justify-between text-xl font-bold pt-2 border-t border-gray-300 dark:border-gray-600">
                <span className="text-gray-900 dark:text-white">TOTAL TTC</span>
                <span className="text-blue-600 dark:text-blue-400 font-mono">{total.toFixed(2)}€</span>
            </div>
        </div>
      </section>
      
      <footer className="p-6 text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700">
        <p>Merci de votre confiance.</p>
        <p>Ce devis est valable {quote.validityDuration} jours à compter de sa date d'émission.</p>
      </footer>
    </div>
  );
};

export default QuoteView;