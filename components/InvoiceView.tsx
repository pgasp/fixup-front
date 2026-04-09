import React from 'react';
import { Invoice, Client, Vehicle, Settings, PaymentDetails } from '../types';
import { CarIcon, UsersIcon, CalendarIcon, CreditCardIcon, ClockIcon, CheckCircleIcon } from './icons';
import { calculateQuoteSubtotal, calculateQuoteTaxAmount, calculateQuoteTotal } from '../domain/financial';

interface InvoiceViewProps {
  invoice: Invoice | null;
  client: Client | null;
  vehicle: Vehicle | null;
  settings: Settings;
  onMarkAsPaid: (invoice: Invoice) => void;
}

const paymentMethodLabels: Record<PaymentDetails['method'], string> = {
    card: 'Carte bancaire',
    cash: 'Espèces',
    transfer: 'Virement',
    other: 'Autre',
};

const InvoiceView: React.FC<InvoiceViewProps> = ({ invoice, client, vehicle, settings, onMarkAsPaid }) => {
  if (!invoice || !client || !vehicle) {
    return <div className="text-center p-8">Chargement des données de la facture...</div>;
  }
  
  const { quote } = invoice;
  const subtotal = calculateQuoteSubtotal(quote);
  const taxAmount = calculateQuoteTaxAmount(quote);
  const total = calculateQuoteTotal(quote);
  const allParts = quote.laborItems.flatMap(labor => labor.partItems);

  return (
    <div className="text-sm text-gray-800 dark:text-gray-200">
        <div className="p-4 bg-gray-100 dark:bg-gray-800 flex justify-end gap-2 print:hidden">
            {invoice.status === 'draft' && (
                <button onClick={() => onMarkAsPaid(invoice)} className="px-4 py-2 text-sm font-semibold bg-green-600 text-white rounded-md hover:bg-green-700">Marquer comme Payée</button>
            )}
            <button onClick={() => window.print()} className="px-4 py-2 text-sm font-semibold bg-blue-600 text-white rounded-md hover:bg-blue-700">Imprimer</button>
        </div>
      <header className="flex justify-between items-start p-6 bg-gray-50 dark:bg-gray-900/50 rounded-t-lg">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">FACTURE</h1>
          <p className="font-mono text-gray-600 dark:text-gray-400">{invoice.invoiceNumber}</p>
        </div>
        <div className="text-right flex items-start gap-4">
          <div className="flex-shrink-0">
              {settings.logo && <img src={settings.logo} alt="Logo" className="h-16 w-auto object-contain"/>}
          </div>
          <div>
            <h2 className="text-xl font-bold text-blue-600 dark:text-blue-400">{settings.garageName}</h2>
            <p>{settings.address}</p>
            <p>{settings.postalCode} {settings.city}</p>
          </div>
        </div>
      </header>
      
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 border-y border-gray-200 dark:border-gray-700">
        <div className="md:col-span-1">
            <h3 className="font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2"><UsersIcon className="h-5 w-5"/> Facturé à</h3>
            <p className="font-bold">{client.name}</p>
            <p>{client.address}</p>
            <p>{client.postalCode} {client.city}</p>
        </div>
         <div className="md:col-span-1">
            <h3 className="font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2"><CarIcon className="h-5 w-5"/> Véhicule</h3>
            <p className="font-bold">{vehicle.make} {vehicle.model}</p>
            <p>Immatriculation: {vehicle.licensePlate}</p>
        </div>
        <div className="md:col-span-1">
            <h3 className="font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2"><CalendarIcon className="h-5 w-5"/> Dates</h3>
            <p>Date de facturation: {new Date(invoice.date).toLocaleDateString()}</p>
            <p className="font-semibold">Date d'échéance: {new Date(invoice.dueDate).toLocaleDateString()}</p>
        </div>
      </section>

       <section className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2"><CreditCardIcon className="h-5 w-5"/> Statut du Paiement</h3>
           {invoice.status === 'paid' && invoice.paymentDetails ? (
                <div className="text-green-600 dark:text-green-400 font-bold flex items-center gap-2">
                    <CheckCircleIcon className="h-6 w-6"/>
                    <span>Payée le {new Date(invoice.paymentDetails.date).toLocaleDateString()} par {paymentMethodLabels[invoice.paymentDetails.method]}</span>
                </div>
           ) : (
                <div className="text-orange-600 dark:text-orange-400 font-bold flex items-center gap-2">
                    <ClockIcon className="h-6 w-6"/>
                    <span>En attente de paiement</span>
                </div>
           )}
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
                        <td className="py-2 pl-4">{part.description}</td>
                        <td className="py-2 text-center">{part.quantity}</td>
                        <td className="py-2 text-right">{part.unitPrice.toFixed(2)}€</td>
                        <td className="py-2 text-right font-semibold">{(part.quantity * part.unitPrice).toFixed(2)}€</td>
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
        <p>Merci de régler cette facture avant le {new Date(invoice.dueDate).toLocaleDateString()}.</p>
      </footer>
    </div>
  );
};

export default InvoiceView;
