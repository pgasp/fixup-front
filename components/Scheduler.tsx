import React, { useState, useMemo } from 'react';
import { Appointment, Client } from '../types';

interface SchedulerProps {
  appointments: Appointment[];
  clients: Client[];
  onAppointmentClick: (appointment: Appointment) => void;
}

// Nouvelle fonction pour obtenir 3 semaines (21 jours) à partir d'une date de début, commençant le Lundi.
const getThreeWeeksDays = (date: Date): Date[] => {
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // Lundi comme premier jour
    startOfWeek.setDate(diff);
    startOfWeek.setHours(0,0,0,0);

    const allDays = [];
    for (let i = 0; i < 21; i++) {
        const day = new Date(startOfWeek);
        day.setDate(startOfWeek.getDate() + i);
        allDays.push(day);
    }
    return allDays;
}

const Scheduler: React.FC<SchedulerProps> = ({ appointments, clients, onAppointmentClick }) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const clientMap = useMemo(() => new Map(clients.map(c => [c.id, c])), [clients]);

    const handlePrevWeek = () => {
        const newDate = new Date(currentDate);
        newDate.setDate(currentDate.getDate() - 7);
        setCurrentDate(newDate);
    };

    const handleNextWeek = () => {
        const newDate = new Date(currentDate);
        newDate.setDate(currentDate.getDate() + 7);
        setCurrentDate(newDate);
    };
    
    const allDays = useMemo(() => getThreeWeeksDays(currentDate), [currentDate]);

    const periodAppointments = useMemo(() => {
        const periodStart = allDays[0];
        const periodEnd = new Date(allDays[20].getTime() + 24*60*60*1000 - 1);
        return appointments.filter(app => {
            const appDate = new Date(app.start);
            return appDate >= periodStart && appDate <= periodEnd;
        });
    }, [appointments, allDays]);

    const getMonthAndYear = (date: Date) => date.toLocaleDateString('fr-FR', {month: 'long', year: 'numeric'});
    const headerDateStart = getMonthAndYear(allDays[0]);
    const headerDateEnd = getMonthAndYear(allDays[20]);
    const headerText = headerDateStart === headerDateEnd ? headerDateStart : `${headerDateStart} - ${headerDateEnd}`;
    
    const weekDayHeaders = useMemo(() => allDays.slice(0, 7).map(day => day.toLocaleDateString('fr-FR', { weekday: 'short' })), []);


  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-4">
            <button onClick={handlePrevWeek} className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600">&lt; Précédent</button>
            <h2 className="text-xl font-bold capitalize">{headerText}</h2>
            <button onClick={handleNextWeek} className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600">Suivant &gt;</button>
        </div>
        <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-700 border border-gray-200 dark:border-gray-700">
            {weekDayHeaders.map(header => (
                <div key={header} className="text-center font-semibold py-2 bg-gray-50 dark:bg-gray-900">
                    <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{header}</p>
                </div>
            ))}
            {allDays.map((day) => {
                const appointmentsForDay = periodAppointments
                    .filter(app => new Date(app.start).toDateString() === day.toDateString())
                    .sort((a,b) => new Date(a.start).getTime() - new Date(b.start).getTime());
                
                const isToday = new Date().toDateString() === day.toDateString();
                const isDifferentMonth = day.getMonth() !== new Date(allDays[7]).getMonth(); // Check against a day in the first week

                return (
                    <div key={day.toISOString()} className="bg-white dark:bg-gray-800 p-1 min-h-[150px] relative">
                         <p className={`text-center text-sm mb-1 ${isToday ? 'bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center mx-auto font-bold' : ''} ${isDifferentMonth ? 'text-gray-400 dark:text-gray-500' : 'text-gray-700 dark:text-gray-300'}`}>
                             {day.getDate()}
                         </p>
                        <div className="space-y-1 overflow-y-auto max-h-32">
                            {appointmentsForDay.map(app => {
                                const client = clientMap.get(app.clientId);
                                const vehicle = client?.vehicles.find(v => v.id === app.vehicleId);
                                return (
                                    <div
                                        key={app.id}
                                        onClick={() => onAppointmentClick(app)}
                                        className="bg-blue-100 dark:bg-blue-900/50 border-l-4 border-blue-500 p-1.5 rounded-md cursor-pointer hover:bg-blue-200 dark:hover:bg-blue-800"
                                    >
                                        <p className="text-xs font-bold text-blue-800 dark:text-blue-300">{new Date(app.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                        <p className="text-sm font-semibold truncate text-gray-800 dark:text-gray-200">{client?.name}</p>
                                        <p className="text-xs truncate text-gray-600 dark:text-gray-400">{vehicle?.make} {vehicle?.model}</p>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )
            })}
        </div>
    </div>
  );
};

export default Scheduler;