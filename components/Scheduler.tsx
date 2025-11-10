import React, { useState } from 'react';
import { Appointment, Client } from '../types';

interface SchedulerProps {
  appointments: Appointment[];
  clients: Client[];
  onAppointmentClick: (appointment: Appointment) => void;
}

const getWeekDays = (date: Date): Date[] => {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay());
    const week = [];
    for (let i = 0; i < 7; i++) {
        const day = new Date(startOfWeek);
        day.setDate(startOfWeek.getDate() + i);
        week.push(day);
    }
    return week;
}

const Scheduler: React.FC<SchedulerProps> = ({ appointments, clients, onAppointmentClick }) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const clientMap = new Map(clients.map(c => [c.id, c]));

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
    
    const weekDays = getWeekDays(currentDate);
    const weekAppointments = appointments.filter(app => {
        const appDate = new Date(app.start);
        return appDate >= weekDays[0] && appDate <= new Date(weekDays[6].getTime() + 24*60*60*1000 - 1);
    });

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-4">
            <button onClick={handlePrevWeek} className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded">&lt; Précédent</button>
            <h2 className="text-xl font-bold">{weekDays[0].toLocaleDateString('fr-FR', {month: 'long', year: 'numeric'})}</h2>
            <button onClick={handleNextWeek} className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded">Suivant &gt;</button>
        </div>
        <div className="grid grid-cols-7 gap-1">
            {weekDays.map(day => (
                <div key={day.toISOString()} className="text-center font-semibold border-b-2 pb-2 dark:border-gray-700">
                    <p className="text-sm text-gray-500">{day.toLocaleDateString('fr-FR', { weekday: 'short' })}</p>
                    <p>{day.getDate()}</p>
                </div>
            ))}
            {weekDays.map(day => (
                <div key={day.toISOString()} className="border-r dark:border-gray-700 p-1 min-h-[200px]">
                    {weekAppointments
                        .filter(app => new Date(app.start).toDateString() === day.toDateString())
                        .sort((a,b) => new Date(a.start).getTime() - new Date(b.start).getTime())
                        .map(app => {
                            const client = clientMap.get(app.clientId);
                            const vehicle = client?.vehicles.find(v => v.id === app.vehicleId);
                            return (
                                <div
                                    key={app.id}
                                    onClick={() => onAppointmentClick(app)}
                                    className="bg-blue-100 dark:bg-blue-900/50 border-l-4 border-blue-500 p-2 rounded-md mb-2 cursor-pointer hover:bg-blue-200 dark:hover:bg-blue-800"
                                >
                                    <p className="text-xs font-bold">{new Date(app.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                    <p className="text-sm font-semibold truncate">{client?.name}</p>
                                    <p className="text-xs truncate">{vehicle?.make} {vehicle?.model}</p>
                                </div>
                            )
                        })
                    }
                </div>
            ))}
        </div>
    </div>
  );
};

export default Scheduler;
