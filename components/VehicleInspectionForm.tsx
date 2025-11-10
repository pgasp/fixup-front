import React, { useState, useRef } from 'react';
import { VehicleInspectionItem, VehicleInspectionReport } from '../types';
import Modal from './Modal';
import { PlusIcon, TrashIcon, CameraIcon, XIcon } from './icons';

interface VehicleInspectionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (report: VehicleInspectionReport) => void;
  repairOrderNumber: string;
}

const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

const VehicleInspectionForm: React.FC<VehicleInspectionFormProps> = ({ isOpen, onClose, onSave, repairOrderNumber }) => {
    const [items, setItems] = useState<Omit<VehicleInspectionItem, 'id'>[]>([]);
    const [notes, setNotes] = useState('');

    // Camera state and refs
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [currentItemIndexForCamera, setCurrentItemIndexForCamera] = useState<number | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const streamRef = useRef<MediaStream | null>(null);

    const handleAddItem = () => {
        setItems([...items, { description: '', photo: '' }]);
    };

    const handleRemoveItem = (index: number) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const handleItemChange = (index: number, field: 'description', value: string) => {
        const newItems = [...items];
        newItems[index][field] = value;
        setItems(newItems);
    };

    const handlePhotoChange = async (index: number, file: File | null) => {
        if (!file) return;
        if (file.size > 2 * 1024 * 1024) { // 2MB limit
            alert("L'image est trop lourde (max 2MB).");
            return;
        }
        try {
            const base64Photo = await blobToBase64(file);
            const newItems = [...items];
            newItems[index].photo = base64Photo;
            setItems(newItems);
        } catch (error) {
            console.error("Erreur lors de la conversion de l'image:", error);
            alert("Erreur lors du chargement de l'image.");
        }
    };

    // Camera functions
    const openCamera = async (index: number) => {
        if (!navigator.mediaDevices?.getUserMedia) {
            alert("La fonctionnalité caméra n'est pas supportée sur ce navigateur.");
            return;
        }
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
            setCurrentItemIndexForCamera(index);
            setIsCameraOpen(true);
        } catch (err) {
            console.error("Error accessing camera:", err);
            alert("Impossible d'accéder à la caméra. Vérifiez les autorisations de votre navigateur.");
        }
    };

    const closeCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        setIsCameraOpen(false);
        setCurrentItemIndexForCamera(null);
    };

    const handleCapture = () => {
        if (videoRef.current && canvasRef.current && currentItemIndexForCamera !== null) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const context = canvas.getContext('2d');
            if (context) {
                context.drawImage(video, 0, 0, canvas.width, canvas.height);
                const base64Photo = canvas.toDataURL('image/jpeg');
                const newItems = [...items];
                newItems[currentItemIndexForCamera].photo = base64Photo;
                setItems(newItems);
            }
            closeCamera();
        }
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const report: VehicleInspectionReport = {
            id: crypto.randomUUID(),
            items: items.filter(i => i.description).map(i => ({...i, id: crypto.randomUUID()})),
            notes,
        };
        onSave(report);
    };

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose} title={`État des lieux d'entrée - ${repairOrderNumber}`}>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg">Anomalies constatées</h3>
                        {items.map((item, index) => (
                            <div key={index} className="p-4 border border-gray-300 dark:border-gray-600 rounded-lg grid grid-cols-1 md:grid-cols-3 gap-4 items-center bg-gray-50 dark:bg-gray-800/50">
                                <input 
                                    type="text"
                                    placeholder={`Description de l'anomalie #${index + 1}`}
                                    value={item.description}
                                    onChange={e => handleItemChange(index, 'description', e.target.value)}
                                    className="md:col-span-2 w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md"
                                    required
                                />
                                 <div className="flex items-center gap-2">
                                    <label htmlFor={`photo-upload-${index}`} className="flex-1 text-center cursor-pointer py-2 px-3 text-sm font-semibold text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 rounded-md truncate">
                                        Importer
                                    </label>
                                    <input id={`photo-upload-${index}`} type="file" accept="image/*" onChange={e => handlePhotoChange(index, e.target.files ? e.target.files[0] : null)} className="hidden"/>
                                    
                                    <button type="button" onClick={() => openCamera(index)} className="flex-1 text-center py-2 px-3 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-md truncate">
                                        Caméra
                                    </button>
                                    
                                    <button type="button" onClick={() => handleRemoveItem(index)} className="p-2 text-red-500 hover:text-red-400"><TrashIcon className="h-5 w-5"/></button>
                                </div>
                                {item.photo && <img src={item.photo} alt={`Anomalie ${index + 1}`} className="md:col-span-3 rounded-md max-h-40 object-contain mx-auto"/>}
                            </div>
                        ))}
                        <button type="button" onClick={handleAddItem} className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold py-2"><PlusIcon/> Ajouter une anomalie</button>
                    </div>
                     <div>
                        <label htmlFor="notes" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Notes générales</label>
                        <textarea id="notes" value={notes} onChange={e => setNotes(e.target.value)} rows={3} className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3"></textarea>
                    </div>
                     <div className="mt-8 flex justify-end gap-4">
                        <button type="button" onClick={onClose} className="py-2 px-6 bg-gray-500 text-white rounded-md font-semibold">Annuler</button>
                        <button type="submit" className="py-2 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-semibold">Sauvegarder et commencer</button>
                    </div>
                </form>
            </Modal>

            {/* Camera View */}
            {isCameraOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-90 flex flex-col justify-center items-center z-[60] p-4">
                    <video ref={videoRef} autoPlay playsInline className="max-w-full max-h-[70vh] rounded-lg w-full"></video>
                    <canvas ref={canvasRef} className="hidden"></canvas>
                    <div className="absolute bottom-8 flex justify-center w-full">
                        <button onClick={handleCapture} className="p-4 bg-blue-600 text-white rounded-full font-semibold text-lg ring-4 ring-white ring-opacity-50">
                            <CameraIcon className="h-8 w-8"/>
                        </button>
                    </div>
                    <button onClick={closeCamera} className="absolute top-4 right-4 p-2 bg-gray-800 bg-opacity-50 text-white rounded-full font-semibold">
                       <XIcon className="h-6 w-6"/>
                    </button>
                </div>
            )}
        </>
    );
};

export default VehicleInspectionForm;